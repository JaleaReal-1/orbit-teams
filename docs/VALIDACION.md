# Validación de Orbit Soft

Fecha: 12 octubre 2026.

- Ocho pruebas aprobadas: catálogo/solicitud, WhatsApp, copias, relaciones de datos, seguimiento, CSV y permisos por defecto.
- Web y demo compiladas. Capacitor Android generado/sincronizado con Preferences, Filesystem y Share. APK nativo pendiente por ausencia de JDK 21/SDK 36.
- Navegador: diseño a 390 px sin desbordamiento, mensaje de solicitud sin enviar, fichas preseleccionadas y datos persistentes al recargar. Demo sin errores en esos recorridos.
- Copias/restauración verificadas por dominio; compartir nativo necesita un dispositivo.
- Claves, bases, certificados y datos reales excluidos de Git y del paquete.

## Verificación operativa del despliegue independiente

Validar Nginx y el candidato antes del cambio público. Health debe coincidir con main en /orbit-soft/health.json. Portada, recursos, ficha, privacidad y demo deben devolver 200; la raíz redirigir al sitio y /orbit-soft a la variante con barra final. Las rutas antiguas de administración/API no deben estar disponibles.

Tras la limpieza, verificar contenedores, redes, imágenes de aplicación, servicios/timers, carpetas y configuración: solo Orbit Soft debe permanecer como proyecto de aplicación. HTTP es la publicación disponible; HTTPS necesita dominio/certificado propios.
