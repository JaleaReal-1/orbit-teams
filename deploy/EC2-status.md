# Despliegue EC2 · 30 de septiembre de 2026

- Host: `ec2-user@18.188.198.49` (Amazon Linux 2023).
- Aplicación: `/home/ec2-user/orbitjoy/backend`.
- Python 3.12, entorno `.venv`, Nginx como proxy al puerto interno 8000.
- Servicios `orbitjoy` y `nginx` activos y habilitados al arrancar.
- Base SQLite persistente: `/home/ec2-user/orbitjoy/backend/orbitjoy.db`.
- Archivos subidos: `/home/ec2-user/orbitjoy/backend/static/uploads`.
- URL configurada: `http://18.188.198.49`.
- HTTP interno responde 200. El acceso público HTTP no responde: revisar la regla entrante TCP 80 del grupo de seguridad y la conectividad de AWS.
- HTTPS y dominio todavía no configurados.

No se copiaron la llave SSH, la base de datos local ni las fotos locales.

## Actualización: Docker y creador guiado

Ruta activa: `/home/ec2-user/orbitjoy/docker`. Contenedores `orbitjoy-app-1` (API + frontend) y `orbitjoy-web-1` (Nginx). Base y uploads en montajes persistentes. Backup de la migración: `/home/ec2-user/orbitjoy/backups/20260930-213400`. Se conservaron tres dedicatorias previas. HTTP público verificado; HTTPS aún pendiente. Docker, Compose y Buildx instalados. Los servicios anteriores del host están detenidos y deshabilitados. Ver `DOCKER.md`.

## Checkout y verificación de pagos

Actualizado en Docker: `Dedicatoria.estado`, sala de espera `/{slug}`, API que oculta contenido pendiente y administración HTTPBasic. Se respaldó la base antes de migrar en `/home/ec2-user/orbitjoy/backups/payment-20260930-215414`. Regalos anteriores pasan a pendiente. Panel público HTTP bloqueado en Nginx; acceso mediante túnel SSH a localhost:8801 (API del host:8001). Credenciales fuera del código, en `.env` del servidor; copia local privada `admin-server-access.txt`. Validación de fotos: 3 MB. Pruebas API: 7 aprobadas y ciclo de aprobación verificado en servidor con un regalo sintético.

## HTTPS configurado

Panel: https://18.188.198.49/admin. Certificado público Let’s Encrypt para la IP emitido y montado en Nginx Docker. Puerto 443 activo; HTTP redirige a HTTPS salvo desafíos ACME. PUBLIC_BASE_URL actualizado a HTTPS. Renovación automática mediante orbitjoy-cert-renew.timer dos veces al día. Catálogo HTTPS 200, panel sin credenciales 401, panel autenticado 200.
