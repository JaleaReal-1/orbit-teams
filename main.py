import io
import time
import hmac
import hashlib
from html import escape
import re
import secrets
import string
import warnings
from contextlib import asynccontextmanager
from pathlib import Path
from urllib.parse import urlsplit
from uuid import uuid4

from fastapi import FastAPI, Depends, File, Form, HTTPException, UploadFile, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, HTMLResponse, RedirectResponse
from fastapi.security import HTTPBasic, HTTPBasicCredentials
from fastapi.staticfiles import StaticFiles
from PIL import Image, UnidentifiedImageError
from sqlalchemy import select, func
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from database import Base, ROOT, engine, get_db, settings
from models import Orden, Dedicatoria
from schemas import CrearRequest, CrearResponse, DedicatoriaResponse, UploadResponse, EsperaResponse

STATIC = ROOT / 'static'
UPLOADS = STATIC / 'uploads'
UPLOADS.mkdir(parents=True, exist_ok=True)
Image.MAX_IMAGE_PIXELS = 20_000_000

@asynccontextmanager
async def lifespan(app):
    from migration import migrate
    migrate()
    yield
    engine.dispose()

app = FastAPI(title='Orbit Joy API', lifespan=lifespan)
app.add_middleware(CORSMiddleware, allow_origins=['*'], allow_credentials=False,
                   allow_methods=['GET', 'POST'], allow_headers=['*'])
@app.middleware('http')
async def payment_cache_control(request: Request, call_next):
    response = await call_next(request)
    if request.url.path.startswith(('/api/dedicatoria/', '/admin')):
        response.headers['Cache-Control'] = 'no-store'
    return response

app.mount('/static', StaticFiles(directory=STATIC), name='static')

def public_url(path: str) -> str:
    return settings.public_base_url.rstrip('/') + path

def normalized_photo(value: str | None) -> str | None:
    if not value:
        return None
    parts = urlsplit(value)
    base = urlsplit(settings.public_base_url)
    if parts.query or parts.fragment or (parts.netloc and (parts.scheme, parts.netloc) != (base.scheme, base.netloc)):
        raise HTTPException(422, 'Usa una imagen subida mediante /api/upload.')
    if not re.fullmatch(r'/static/uploads/[a-f0-9]{32}\.jpg', parts.path):
        raise HTTPException(422, 'URL de foto inválida.')
    if not (UPLOADS / Path(parts.path).name).is_file():
        raise HTTPException(422, 'La foto no existe. Súbela nuevamente.')
    return parts.path

@app.post('/api/upload', response_model=UploadResponse, status_code=201)
def upload(file: UploadFile = File(...)):
    # Sync endpoint: image decoding and local disk writes run in FastAPI's thread pool.
    try:
        data = file.file.read(settings.upload_max_bytes + 1)
        if len(data) > settings.upload_max_bytes:
            raise HTTPException(413, 'La foto supera el límite de 3 MB.')
        try:
            with warnings.catch_warnings():
                warnings.simplefilter('error', Image.DecompressionBombWarning)
                with Image.open(io.BytesIO(data)) as image:
                    if image.format not in {'JPEG', 'PNG', 'WEBP'}:
                        raise HTTPException(415, 'Usa una foto JPG, PNG o WebP.')
                    image.load()
                    image.thumbnail((2560, 2560))
                    clean = image.convert('RGB')
                    name = uuid4().hex + '.jpg'
                    target = UPLOADS / name
                    try:
                        clean.save(target, 'JPEG', quality=88)
                    except Exception:
                        target.unlink(missing_ok=True)
                        raise
        except (UnidentifiedImageError, OSError, Image.DecompressionBombError, Image.DecompressionBombWarning):
            raise HTTPException(415, 'La imagen está dañada o es demasiado grande.')
        return {'url': public_url('/static/uploads/' + name)}
    finally:
        file.file.close()

@app.post('/api/crear', response_model=CrearResponse, status_code=200)
def crear(data: CrearRequest, db: Session = Depends(get_db)):
    photo = normalized_photo(data.url_foto_fondo)
    for _ in range(10):
        slug = ''.join(secrets.choice(string.ascii_lowercase + string.digits) for _ in range(6))
        try:
            with db.begin():
                order = Orden(nombre_compradora=data.nombre_compradora,
                              telefono_whatsapp=data.telefono_whatsapp,
                              metodo_pago=data.metodo_pago, estado_pago='pendiente')
                db.add(order)
                db.flush()
                dedication = Dedicatoria(slug_url=slug, nombre_chico=data.nombre_chico,
                    mensaje_texto=data.mensaje_texto, modelo_auto_elegido=data.modelo_auto_elegido,
                    url_foto_fondo=photo, id_orden=order.id_orden)
                db.add(dedication)
                db.flush()
            return CrearResponse(id_orden=order.id_orden, id_dedicatoria=dedication.id_dedicatoria,
                                 slug_url=slug, enlace=public_url('/' + slug))
        except IntegrityError:
            # Only retry a slug collision; other constraint errors must remain visible to operators.
            collision = db.scalar(select(Dedicatoria.id_dedicatoria).where(Dedicatoria.slug_url == slug))
            db.rollback()
            if collision is None:
                raise
    raise HTTPException(503, 'No se pudo generar un enlace. Intenta nuevamente.')

@app.get('/api/dedicatoria/{slug}', response_model=DedicatoriaResponse | EsperaResponse)
def get_dedicatoria(slug: str, db: Session = Depends(get_db)):
    record = lookup(slug, db)
    if record.estado == 'pendiente':
        return EsperaResponse(slug_url=record.slug_url, mensaje=WAIT_MESSAGE, whatsapp_url=whatsapp_url(record.slug_url))
    return record

WAIT_MESSAGE = '¡Tu carrito está en el taller! Estamos verificando tu pago para entregarte las llaves. Escríbenos al WhatsApp si aún no has enviado tu voucher.'
basic = HTTPBasic(auto_error=False)

def whatsapp_url(slug):
    from urllib.parse import quote
    message = f'Hola, quiero activar mi carrito digital. Mi código de regalo es #{slug.upper()}. Aquí adjunto mi captura de pago de Yape/Plin para habilitarlo.'
    return 'https://wa.me/' + settings.whatsapp_number + '?text=' + quote(message, safe='')

def lookup(slug, db):
    slug = slug.lower()
    if not re.fullmatch(r'[a-z0-9]{6}', slug):
        raise HTTPException(404, 'Dedicatoria no encontrada.')
    record = db.scalar(select(Dedicatoria).where(Dedicatoria.slug_url == slug))
    if record is None:
        raise HTTPException(404, 'Dedicatoria no encontrada.')
    return record

def waiting_view(record):
    html = (STATIC / 'espera.html').read_text()
    return HTMLResponse(html.replace('{{CODE}}', escape(record.slug_url.upper())).replace('{{MESSAGE}}', escape(WAIT_MESSAGE)).replace('{{WHATSAPP}}', escape(whatsapp_url(record.slug_url), quote=True)), headers={'Cache-Control':'no-store'})

def signed_value(value):
    signature = hmac.new(settings.admin_password.encode(), value.encode(), hashlib.sha256).hexdigest()
    return value + '.' + signature

def valid_signed(value):
    if not value or not settings.admin_password:
        return None
    payload, _, signature = value.rpartition('.')
    if not secrets.compare_digest(signed_value(payload).rpartition('.')[2], signature):
        return None
    return payload

def session_user(request):
    payload = valid_signed(request.cookies.get('orbit_admin'))
    if payload:
        user, _, expires = payload.rpartition('|')
        if expires.isdigit() and int(expires) > time.time() and user == settings.admin_username:
            return user
    return None

def credentials_valid(username, password):
    return (secrets.compare_digest(username.encode(), settings.admin_username.encode())
            & secrets.compare_digest(password.encode(), settings.admin_password.encode()))

def require_admin(request: Request, credentials: HTTPBasicCredentials | None = Depends(basic)):
    if not settings.admin_username or not settings.admin_password:
        raise HTTPException(503, 'Configura las credenciales de administración.')
    user = session_user(request)
    if user:
        return user
    if credentials and credentials_valid(credentials.username, credentials.password):
        return credentials.username
    raise HTTPException(401, 'Inicia sesión para continuar.')

def admin_html(filename, values=None, status=200):
    html = (STATIC / filename).read_text()
    for key, value in (values or {}).items():
        html = html.replace('{{' + key + '}}', str(value))
    return HTMLResponse(html, status_code=status, headers={'Cache-Control':'no-store', 'X-Frame-Options':'DENY', 'Referrer-Policy':'same-origin'})

def login_view(error='', status=200):
    token = signed_value(secrets.token_urlsafe(24) + '|' + str(int(time.time()) + 1800))
    response = admin_html('admin-login.html', {'TOKEN':token, 'ERROR':escape(error)}, status)
    response.set_cookie('orbit_login_csrf', token, httponly=True, secure=settings.public_base_url.startswith('https://'), samesite='strict', max_age=1800, path='/admin')
    return response

@app.get('/admin/login', response_class=HTMLResponse, include_in_schema=False)
def login_page(request: Request):
    if session_user(request):
        return RedirectResponse('/admin', status_code=303)
    return login_view()

@app.post('/admin/login', include_in_schema=False)
def login_submit(request: Request, username: str = Form(...), password: str = Form(...), token: str = Form(...)):
    if not settings.admin_username or not settings.admin_password:
        return login_view('El acceso todavía no está configurado.', 503)
    payload = valid_signed(token)
    expires = payload.rpartition('|')[2] if payload else ''
    if not secrets.compare_digest(token, request.cookies.get('orbit_login_csrf', '')) or not expires.isdigit() or int(expires) < time.time():
        return login_view('La sesión de acceso venció. Inténtalo nuevamente.', 403)
    if not credentials_valid(username, password):
        return login_view('Usuario o contraseña incorrectos. Revisa tus datos.', 401)
    response = RedirectResponse('/admin', status_code=303)
    response.set_cookie('orbit_admin', signed_value(username + '|' + str(int(time.time()) + 28800)), httponly=True, secure=settings.public_base_url.startswith('https://'), samesite='strict', max_age=28800, path='/admin')
    response.delete_cookie('orbit_login_csrf', path='/admin')
    return response

@app.post('/admin/logout', include_in_schema=False)
def logout(token: str = Form(...), username: str = Depends(require_admin)):
    if not secrets.compare_digest(token, approval_token('logout')):
        raise HTTPException(403, 'Recarga el panel e inténtalo nuevamente.')
    response = RedirectResponse('/admin/login', status_code=303)
    response.delete_cookie('orbit_admin', path='/admin')
    return response

def approval_token(slug):
    return hmac.new(settings.admin_password.encode(), ('approve:'+slug).encode(), hashlib.sha256).hexdigest()

@app.get('/api/config', include_in_schema=False)
def public_config():
    return {'whatsapp_number':settings.whatsapp_number}

@app.get('/admin', response_class=HTMLResponse, include_in_schema=False)
def admin(request: Request, credentials: HTTPBasicCredentials | None = Depends(basic), db: Session = Depends(get_db), estado: str = 'pendiente', q: str = ''):
    if not session_user(request) and credentials is None:
        return RedirectResponse('/admin/login', status_code=303)
    username = require_admin(request, credentials)
    estado = estado if estado in ('pendiente', 'pagado') else 'pendiente'
    counts = dict(db.execute(select(Dedicatoria.estado, func.count()).group_by(Dedicatoria.estado)).all())
    records = db.scalars(select(Dedicatoria).where(Dedicatoria.estado == estado).order_by(Dedicatoria.id_dedicatoria.desc())).all()
    query = q.strip().lower()[:100]
    if query:
        records = [item for item in records if query.lstrip('#') in item.slug_url or query in item.nombre_chico.lower()]
    names = {'hombre_noir':'Noir · edición especial', 'deportivo':'Deportivo', 'clasico':'Clásico', 'lujo':'Lujo', 'hombre_galaxia':'Galaxia', 'hombre_ramo':'Ramo de carritos'}
    rows = []
    for item in records:
        code = escape(item.slug_url.upper())
        action = (f'<button class="approve" type="button" data-code="#{code}" data-name="{escape(item.nombre_chico, quote=True)}" data-action="/admin/{item.slug_url}/aprobar" data-token="{approval_token(item.slug_url)}">Aprobar regalo</button>' if estado == 'pendiente' else '<span class="released">Regalo activado</span>')
        rows.append(f'<tr><td><strong class="gift-code">#{code}</strong><small>Regalo digital</small></td><td data-label="Para"><strong>{escape(item.nombre_chico)}</strong><small>{escape(item.orden.nombre_compradora or "Sin remitente")}</small></td><td data-label="Diseño">{escape(names.get(item.modelo_auto_elegido, item.modelo_auto_elegido))}</td><td><div class="row-actions"><a class="view" href="/{item.slug_url}" target="_blank" rel="noopener">Ver regalo</a>{action}</div></td></tr>')
    if not rows:
        rows.append('<tr><td colspan="4"><div class="empty"><span>✧</span><h3>Todo en orden por aquí</h3><p>No hay regalos que coincidan con esta vista.</p></div></td></tr>')
    return admin_html('admin.html', {'USERNAME':escape(username), 'PENDING':counts.get('pendiente',0), 'PAID':counts.get('pagado',0), 'TOTAL':sum(counts.values()), 'ROWS':''.join(rows), 'QUERY':escape(q[:100], quote=True), 'STATE':estado, 'PENDING_ACTIVE':'active' if estado == 'pendiente' else '', 'PAID_ACTIVE':'active' if estado == 'pagado' else '', 'LOGOUT_TOKEN':approval_token('logout'), 'NOTICE':'Regalo activado. Ya está listo para compartir.' if request.query_params.get('aprobado') == '1' else ''})

@app.post('/admin/{slug}/aprobar', include_in_schema=False)
def approve(slug: str, token: str = Form(...), username: str = Depends(require_admin), db: Session = Depends(get_db)):
    record = lookup(slug, db)
    if not secrets.compare_digest(token, approval_token(record.slug_url)):
        raise HTTPException(403, 'La aprobación no es válida. Recarga el panel.')
    record.estado = 'pagado'
    record.orden.estado_pago = 'pagado'
    db.commit()
    return RedirectResponse('/admin?aprobado=1', status_code=303)

@app.get('/', include_in_schema=False)
def home():
    return FileResponse(STATIC / 'index.html')

@app.get('/regalo.html', include_in_schema=False)
def regalo(slug: str | None = None, db: Session = Depends(get_db)):
    if slug:
        record = lookup(slug, db)
        if record.estado == 'pendiente':
            return waiting_view(record)
    return FileResponse(STATIC / 'regalo.html')

@app.get('/planes.html', include_in_schema=False)
def planes():
    return FileResponse(STATIC / 'planes.html')

@app.get('/crear.html', include_in_schema=False)
def formulario():
    return FileResponse(STATIC / 'crear.html')

@app.get('/catalogo.html', include_in_schema=False)
def catalogo():
    return FileResponse(STATIC / 'catalogo.html')

@app.get('/privacidad.html', include_in_schema=False)
def privacidad():
    return FileResponse(STATIC / 'privacidad.html')

# Keep this catch-all after concrete routes such as /admin and /catalogo.html.
@app.get('/{slug}', include_in_schema=False)
def gift_by_slug(slug: str, db: Session = Depends(get_db)):
    record = lookup(slug, db)
    if record.estado == 'pendiente':
        return waiting_view(record)
    return FileResponse(STATIC / 'regalo.html', headers={'Cache-Control':'no-store'})
