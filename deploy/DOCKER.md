# Orbit Joy en Docker

La aplicación y el frontend se sirven desde el contenedor `app`. El contenedor `web` contiene Nginx y publica el puerto 80. La API de diagnóstico está enlazada solo a localhost:8001.

## Arranque

Requiere Docker Engine, Compose y Buildx para `compose build`.

```bash
mkdir -p data static/uploads
sudo chown -R 10001:10001 data static/uploads
PUBLIC_BASE_URL=http://localhost docker compose up -d --build
```

Los directorios `data/` y `static/uploads/` son montajes persistentes; la base y las fotos sobreviven a recrear contenedores. No borrarlos al actualizar. `.env`, registros locales y fotos no se incorporan a la imagen.

## EC2

Directorio activo: `/home/ec2-user/orbitjoy/docker`.

```bash
cd /home/ec2-user/orbitjoy/docker
sudo docker compose ps
sudo docker compose logs --tail 50
```

`PUBLIC_BASE_URL=https://18.188.198.49` está en `.env`. Se migraron las dedicatorias y fotos existentes y se conservó un respaldo en `/home/ec2-user/orbitjoy/backups/`. Los servicios anteriores permanecen instalados para recuperación; están detenidos y deshabilitados. HTTPS está activo con un certificado de Let’s Encrypt para la IP.

## Experiencia de creación

Tres decisiones: nombre del destinatario, elección o edición del mensaje y creación del enlace. No se exige teléfono ni registro. Nombre del remitente y fotografía son opcionales. La firma se incorpora al mensaje compartido si se proporciona. El botón de WhatsApp abre un borrador; el usuario decide si lo envía.

Referencias: [NN/g: formularios](https://www.nngroup.com/articles/web-form-design/), [GOV.UK: question pages](https://design-system.service.gov.uk/patterns/question-pages/). La reducción del abandono es una hipótesis; todavía no hay métricas ni un experimento con usuarios.

## Pago y administración

`Dedicatoria.estado` admite `pendiente` (por defecto) y `pagado`. La migración conserva registros y pone los antiguos en pendiente. El panel `/admin` usa HTTPBasic y credenciales `ADMIN_USERNAME` / `ADMIN_PASSWORD`. No tiene contraseña predeterminada. Cada aprobación verifica un token HMAC y actualiza también la orden. La API pública oculta el mensaje y la foto mientras el regalo está pendiente.

El panel público está en `https://18.188.198.49/admin`. HTTP redirige a HTTPS. También se puede conectar mediante túnel SSH:

```bash
ssh -i /Users/danm/Downloads/orbit-keys.pem -N -L 8801:127.0.0.1:8001 ec2-user@18.188.198.49
```

Abrir `http://127.0.0.1:8801/admin`. El panel pide las credenciales de `admin-server-access.txt`. El checkout utiliza `WHATSAPP_NUMBER=51978371277`; el voucher se adjunta manualmente. No se configuraron precios ni claves de Yape/Plin: no se inventan datos de cobro.

Archivos activos: `main.py`, `models.py`, `schemas.py`, `migration.py`, `static/index.html` (inicio), `static/catalogo.html` (creador), `static/catalog.js` (su lógica), `static/checkout.js` (código/WhatsApp), `static/catalog.css` y `static/style.css`. Se mantiene la estructura original sin duplicar un `script.js` alternativo.

## HTTPS y renovación

En EC2, `.env` incluye `COMPOSE_FILE=compose.yaml:compose.https.yaml`; los comandos normales de Compose conservan HTTPS. Los certificados están en `certificates/` y los desafíos ACME en `acme/`, fuera de la imagen y del repositorio. No borrar estas carpetas.

El temporizador `orbitjoy-cert-renew.timer` ejecuta Certbot 5.5.0 dos veces al día y recarga Nginx. Está habilitado al arrancar y recupera ejecuciones pendientes. El certificado de IP tiene duración corta. Verificación:

```bash
sudo systemctl list-timers orbitjoy-cert-renew.timer
sudo journalctl -u orbitjoy-cert-renew.service
```

Fuentes: [certificados IP con Certbot](https://letsencrypt.org/2026/03/11/shorter-certs-certbot).

## Panel y acceso actualizado

`/admin` redirige a `/admin/login`. El formulario usa las mismas credenciales existentes y emite una cookie firmada, HttpOnly, Secure en producción y SameSite=strict, válida por ocho horas. El login valida un token temporal ligado al navegador; las aprobaciones y el cierre de sesión validan tokens HMAC. HTTPBasic se conserva para integraciones existentes.

Panel con resumen de pendientes/activados, búsqueda por nombre/código, vistas por estado y confirmación de aprobación. Diseño propio en `static/admin.css`, plantillas `admin.html` / `admin-login.html` y controles en `admin.js`. Ocho pruebas API aprobadas y flujo de login/logout validado por HTTPS en EC2. Vista de escritorio y móvil revisadas con un regalo sintético local.

Panel simplificado: cabecera única, búsqueda, dos vistas por estado y listado. Tipografía de sistema de 14–16 px, contraste oscuro y acciones visibles en tarjetas móviles sin desplazamiento horizontal. Acceso en una tarjeta única, sin ilustraciones ni columnas decorativas.
