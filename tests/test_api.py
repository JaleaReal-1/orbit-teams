import io
import os
import sys
import tempfile
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))
TEST_DIR = tempfile.TemporaryDirectory()
os.environ['DATABASE_URL'] = 'sqlite:///' + str(Path(TEST_DIR.name) / 'test.db')
os.environ['PUBLIC_BASE_URL'] = 'http://testserver'
os.environ['ADMIN_USERNAME']='tester'
os.environ['ADMIN_PASSWORD']='test-password-only'

from fastapi.testclient import TestClient
from PIL import Image
from sqlalchemy import select, func
import main
from database import SessionLocal
from models import Orden, Dedicatoria

main.UPLOADS = Path(TEST_DIR.name) / 'uploads'
main.UPLOADS.mkdir()
# Serve test uploads through the existing static mount without writing into production storage.
from fastapi.staticfiles import StaticFiles
for route in main.app.routes:
    if getattr(route, 'name', None) == 'static':
        route.app = StaticFiles(directory=TEST_DIR.name)

PAYLOAD = dict(nombre_compradora='María', telefono_whatsapp='+51 999 999 999',
               metodo_pago='yape', nombre_chico='José 🏎️', mensaje_texto='Te quiero <script>alert(1)</script>',
               modelo_auto_elegido='deportivo')

def approve_gift(client, slug):
    response=client.post('/admin/'+slug+'/aprobar',data={'token':main.approval_token(slug)},auth=('tester','test-password-only'),follow_redirects=False)
    assert response.status_code==303

def test_create_get_upload_and_validation():
    with TestClient(main.app) as client:
        image = Image.new('RGB', (10, 10), 'red')
        buffer = io.BytesIO(); image.save(buffer, 'PNG')
        response = client.post('/api/upload', files={'file': ('../../photo.png', buffer.getvalue(), 'image/png')})
        assert response.status_code == 201
        url = response.json()['url']
        # Test mount maps uploads/ under the temporary static root.
        assert client.get(url).status_code == 200
        created = client.post('/api/crear', json={**PAYLOAD, 'url_foto_fondo': url})
        assert created.status_code == 200
        data = created.json()
        assert len(data['slug_url']) == 6 and data['estado_pago'] == 'pendiente'
        assert data["enlace"] == "http://testserver/" + data["slug_url"]
        assert client.get('/api/dedicatoria/'+data['slug_url']).json()['estado']=='pendiente'
        approve_gift(client, data['slug_url'])
        read = client.get('/api/dedicatoria/' + data['slug_url'])
        assert read.status_code == 200
        assert read.json()['nombre_chico'] == PAYLOAD['nombre_chico']
        assert read.json()['mensaje_texto'] == PAYLOAD['mensaje_texto']
        assert 'telefono_whatsapp' not in read.json() and 'id_orden' not in read.json()
        assert client.get('/api/dedicatoria/!!!!!!').status_code == 404
        assert client.get('/api/dedicatoria/zzzzzz').status_code == 404
        assert client.post('/api/upload', files={'file': ('fake.png', b'<script>bad</script>', 'image/png')}).status_code == 415
        assert client.post('/api/crear', json={**PAYLOAD, 'estado_pago': 'pagado'}).status_code == 422
        assert client.post('/api/crear', json={**PAYLOAD, 'url_foto_fondo': 'https://evil.example/x.jpg'}).status_code == 422
        assert client.post('/api/crear', json={**PAYLOAD, 'modelo_auto_elegido': 'unknown'}).status_code == 422
        preflight = client.options('/api/crear', headers={'Origin':'https://frontend.example', 'Access-Control-Request-Method':'POST'})
        assert preflight.headers['access-control-allow-origin'] == '*'
        assert client.get('/').status_code == 200 and client.get('/regalo.html').status_code == 200
        with SessionLocal() as db:
            assert db.scalar(select(func.count()).select_from(Orden)) == 1
            assert db.scalar(select(func.count()).select_from(Dedicatoria)) == 1

def test_collision_rolls_back_order(monkeypatch):
    with TestClient(main.app) as client:
        monkeypatch.setattr(main.secrets, 'choice', lambda chars: 'a')
        first = client.post('/api/crear', json=PAYLOAD)
        assert first.status_code == 200
        with SessionLocal() as db:
            count_before = db.scalar(select(func.count()).select_from(Orden))
        assert client.post('/api/crear', json=PAYLOAD).status_code == 503
        with SessionLocal() as db:
            assert db.scalar(select(func.count()).select_from(Orden)) == count_before

def test_upload_size(monkeypatch):
    monkeypatch.setattr(main.settings, 'upload_max_bytes', 16)
    with TestClient(main.app) as client:
        assert client.post('/api/upload', files={'file': ('a.jpg', b'x' * 17, 'image/jpeg')}).status_code == 413

def test_mens_collection_preserves_design_in_shared_gift():
    with TestClient(main.app) as client:
        for design in ['hombre_noir', 'hombre_azul', 'hombre_verde', 'hombre_marfil', 'hombre_rojo', 'hombre_plata']:
            created = client.post('/api/crear', json={**PAYLOAD, 'metodo_pago': 'gratis',
                'modelo_auto_elegido': design, 'mensaje_texto': '¡Feliz Día del Hombre!'})
            assert created.status_code == 200
            approve_gift(client, created.json()['slug_url'])
            gift = client.get('/api/dedicatoria/' + created.json()['slug_url'])
            assert gift.status_code == 200
            assert gift.json()['modelo_auto_elegido'] == design
            assert gift.json()['mensaje_texto'] == '¡Feliz Día del Hombre!'

def test_gift_without_contact_details():
    with TestClient(main.app) as client:
        payload={key:value for key,value in PAYLOAD.items() if key not in ['nombre_compradora','telefono_whatsapp']}
        created=client.post('/api/crear', json=payload)
        assert created.status_code == 200
        approve_gift(client, created.json()['slug_url'])
        gift=client.get('/api/dedicatoria/'+created.json()['slug_url'])
        assert gift.json()['nombre_chico'] == payload['nombre_chico']
        assert client.post('/api/crear',json={**payload,'telefono_whatsapp':'abc'}).status_code == 422


def test_payment_gate_admin_auth_and_escaping():
    with TestClient(main.app) as client:
        created=client.post('/api/crear',json={**PAYLOAD,'nombre_chico':'<script>bad</script>'}).json()
        slug=created['slug_url']
        pending=client.get('/api/dedicatoria/'+slug).json()
        assert pending['estado']=='pendiente'
        assert 'mensaje_texto' not in pending and 'url_foto_fondo' not in pending
        assert main.WAIT_MESSAGE in client.get('/'+slug).text
        assert main.WAIT_MESSAGE in client.get('/regalo.html?slug='+slug).text
        assert client.get('/admin').status_code==401
        assert client.get('/admin',auth=('tester','wrong')).status_code==401
        panel=client.get('/admin',auth=('tester','test-password-only'))
        assert panel.status_code==200 and '&lt;script&gt;bad&lt;/script&gt;' in panel.text
        assert client.post('/admin/'+slug+'/aprobar',data={'token':main.approval_token(slug)}).status_code==401
        assert client.post('/admin/'+slug+'/aprobar',data={'token':'wrong'},auth=('tester','test-password-only')).status_code==403
        approve_gift(client,slug)
        paid=client.get('/api/dedicatoria/'+slug).json()
        assert paid['estado']=='pagado' and paid['mensaje_texto']==PAYLOAD['mensaje_texto']
        assert main.WAIT_MESSAGE not in client.get('/'+slug).text
        approve_gift(client,slug)  # Repeated approvals are safe.
        with SessionLocal() as db:
            record=db.scalar(select(Dedicatoria).where(Dedicatoria.slug_url==slug))
            assert record.orden.estado_pago=='pagado'
        assert client.post('/api/crear',json={**PAYLOAD,'estado':'pagado'}).status_code==422
        assert client.get('/unknown-slug').status_code==404


def test_migration_preserves_legacy_records(tmp_path,monkeypatch):
    from sqlalchemy import create_engine, text, inspect
    import migration
    legacy=create_engine('sqlite:///'+str(tmp_path/'legacy.db'))
    with legacy.begin() as connection:
        connection.execute(text("CREATE TABLE dedicatorias (id_dedicatoria INTEGER PRIMARY KEY, slug_url VARCHAR(6), mensaje_texto TEXT)"))
        connection.execute(text("INSERT INTO dedicatorias VALUES (1,'legacy','Con cariño')"))
    monkeypatch.setattr(migration,'engine',legacy)
    migration.migrate()
    migration.migrate()
    with legacy.connect() as connection:
        assert connection.execute(text('SELECT mensaje_texto,estado FROM dedicatorias')).one()==('Con cariño','pendiente')
