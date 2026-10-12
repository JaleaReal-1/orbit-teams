# Orbit Joy · API y regalos de carritos

Implementación local independiente dentro de `Nexo/backend`. El catálogo original en `../dist` se conserva como referencia; su servidor 4173 está apagado. La aplicación activa sirve el catálogo y API juntos en 8000. La plantilla del compañero todavía no se recibió: `static/regalo.html` es una plantilla funcional provisional, no una modificación de su archivo.

## Estructura

```text
backend/
├── main.py                   # API, subida y rutas HTML
├── database.py               # Settings, engine y sesiones
├── models.py                 # Orden y Dedicatoria
├── schemas.py                # Validación de entrada y salida
├── requirements.txt
├── .env.example
├── static/
│   ├── index.html            # Bienvenida y botón Ver regalos
│   ├── catalogo.html         # Catálogo independiente con editor
│   ├── catalog.js            # Editor → upload/crear → enlace persistente
│   ├── catalog.css           # Diseño del catálogo
│   ├── planes.html           # Comparación de planes
│   ├── crear.html            # Formulario independiente de referencia
│   ├── crear.js              # Upload + crear mediante fetch
│   ├── regalo.html           # Vista dinámica del regalo
│   ├── regalo.js             # GET por slug, inyección segura
│   ├── style.css
│   └── uploads/
├── tests/test_api.py
└── deploy/
    ├── orbitjoy.service
    └── nginx.conf
```

## MySQL y ejecución local

Desde `backend/`:

```bash
python3 -m venv .venv
.venv/bin/pip install -r requirements.txt
cp .env.example .env
```

En MySQL, ejecutar con un usuario administrador (cambiar la contraseña):

```sql
CREATE DATABASE orbitjoy CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'orbitjoy'@'localhost' IDENTIFIED BY 'CAMBIAR_POR_UNA_CLAVE_SEGURA';
GRANT SELECT, INSERT, UPDATE, DELETE, CREATE, REFERENCES, INDEX
ON orbitjoy.* TO 'orbitjoy'@'localhost';
```

Editar `.env` con la conexión real y `PUBLIC_BASE_URL`. Si la contraseña contiene caracteres reservados de una URL, codificarlos porcentualmente. Mantener `charset=utf8mb4` para mensajes con emojis.

```bash
.venv/bin/uvicorn main:app --host 127.0.0.1 --port 8000 --reload
```

Abrir http://127.0.0.1:8000 y http://127.0.0.1:8000/docs.
Al iniciar se crean las tablas que faltan. `create_all` no crea la base MySQL ni migra tablas existentes; para futuras modificaciones utilizar migraciones con Alembic.

## API

`POST /api/upload`: multipart con campo `file`. Solo imágenes reales JPG, PNG o WebP, hasta 5 MB. Se recodifican como JPG con nombre aleatorio, sin conservar metadata original ni nombre del usuario. Devuelve `{"url":"http://127.0.0.1:8000/static/uploads/....jpg"}`.

`POST /api/crear`: JSON plano, por ejemplo:

```json
{
  "nombre_compradora": "María",
  "telefono_whatsapp": "+51 999 999 999",
  "metodo_pago": "yape",
  "nombre_chico": "José",
  "mensaje_texto": "Contigo, cada camino es una aventura.",
  "modelo_auto_elegido": "deportivo",
  "url_foto_fondo": null
}
```

Modelos: `deportivo`, `clasico`, `todoterreno`. Métodos: `gratis`, `yape`, `plin`, `transferencia`, `efectivo`. El editor gratuito usa `gratis`; no procesa cobros. La foto debe provenir de `/api/upload`.

Retorna IDs, `slug_url`, `enlace` y `estado_pago: pendiente`. La orden y dedicatoria se guardan atómicamente; se reintenta un slug cuando colisiona con el índice único. No se permite marcar el pago como completado desde este endpoint.

`GET /api/dedicatoria/{slug}`: solo devuelve los datos de presentación. No expone el teléfono ni datos de la orden. Devuelve 404 para slug desconocido o inválido.

## Adaptar la plantilla del compañero

Conservar su HTML/CSS y colocar estos IDs en sus elementos: `nombre-chico`, `mensaje-texto`, `modelo-auto`, `car`, `gift`, `message`, `reveal`, `status`. Cargar `/static/regalo.js` al final del body. El script lee `?slug=xxxxxx`, consulta la API e inserta texto con `textContent`.

El mapa `models` en `regalo.js` contiene etiquetas y emojis provisionales. Sustituirlos por los assets y lógica interactiva de la plantilla real cuando se reciba. Si el frontend está en otro origen, definir `window.API_BASE_URL` antes de cargar ambos scripts. CORS `*` está habilitado sin credenciales.

## Ubuntu EC2 (instrucciones, no desplegado)

1. Instalar Python 3, venv, MySQL y Nginx. Copiar este proyecto a `/home/ubuntu/orbitjoy/backend`.
2. Crear el usuario/base y `.env`, instalar las dependencias en `.venv`.
3. Cambiar `PUBLIC_BASE_URL` al origen real, por ejemplo `https://regalos.ejemplo.com`.
4. Copiar `deploy/orbitjoy.service` a `/etc/systemd/system/` y ejecutar `sudo systemctl daemon-reload` y `sudo systemctl enable --now orbitjoy`.
5. Cambiar `REEMPLAZAR_DOMINIO` en la configuración Nginx, habilitarla y verificar `sudo nginx -t` antes de recargar Nginx.
6. Configurar DNS y HTTPS. En el security group permitir HTTP/HTTPS y SSH restringido; MySQL y Uvicorn quedan internos.

La configuración suministrada de Nginx es HTTP: requiere configurar el certificado antes de manejar pedidos reales. Los uploads se guardan en disco local: usar un volumen EBS persistente y respaldar tanto MySQL como `static/uploads`. No almacenar imágenes en un disco efímero.

## Pruebas y límites actuales

```bash
.venv/bin/pip install -r requirements-dev.txt
.venv/bin/pytest -q tests
```

Las pruebas usan SQLite temporal para verificar API, rollback de colisiones, validación, imágenes y CORS. No sustituyen una prueba de integración con MySQL real.

No hay pasarela de pagos, autenticación de administración ni verificación de pagos. Los enlaces funcionan inmediatamente y no se bloquean por pago pendiente. Un slug de seis caracteres no proporciona privacidad: cualquier persona con el enlace puede leer el regalo y las fotos son públicas. Antes de vender, implementar comprobación de pago en servidor, control de abuso/rate limiting y política de retención. No se publicó ni configuró ninguna instancia EC2.

## Demo local sin MySQL

Para revisar interfaz y API sin un servidor MySQL instalado:

```bash
DATABASE_URL=sqlite:///./local-demo.db PUBLIC_BASE_URL=http://127.0.0.1:8000 .venv/bin/uvicorn main:app --host 127.0.0.1 --port 8000
```

Esta demo guarda registros en SQLite local; producción sigue configurada para MySQL en `.env.example`.

## Portada formal

La portada incluye presentación, nuestra idea, cómo funciona, preguntas frecuentes y contacto por WhatsApp +51 978371277. El catálogo continúa en `/catalogo.html`. El pie compartido enlaza a `/privacidad.html`, con una explicación factual de esta demo. No hay correo ni Instagram configurados.
