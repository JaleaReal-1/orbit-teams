# Análisis de Orbit Soft

Estado técnico del MVP al 12 de octubre de 2026.

Web independiente HTML/CSS/JavaScript: ocho soluciones, fichas, servicios, proceso, demo, preguntas frecuentes, solicitud por WhatsApp y privacidad. No hay pagos, cuentas reales, panel comercial ni almacenamiento de solicitudes.

Campus Planner usa Capacitor 8 y Vite con cursos, horarios, tareas, exámenes, notas, configuración y copias JSON/CSV. Interfaz, dominio y repositorio están separados. Preferences guarda datos nativos y la demo usa localStorage. No sincroniza ni pide INTERNET. Proyecto Android generado/sincronizado; compilar e instalar APK requiere JDK 21/SDK 36, pendientes en este equipo.

FastAPI y SQLAlchemy PostgreSQL/MySQL están preparados en backend, sin despliegue, tablas ni credenciales. Sesión, usuarios y roles son contratos opcionales deshabilitados.

Orbit Soft es el único proyecto de aplicación de AWS. orbit-soft-web-1 sirve directamente el puerto 80 desde /usr/share/nginx/html/orbit-soft/. La raíz redirige a /orbit-soft/. No depende de otro ingreso. Los releases viven en /home/ec2-user/orbit-soft y se identifican por commit y health. HTTPS requiere dominio/certificado propios.

La limpieza autorizada retira la aplicación sustituida, sus contenedores, imágenes, red, servicios/timer, código, bases, fotos, certificados y configuración. No se conserva una copia de esa aplicación en la instancia. No se publican datos reales ni secretos.

Ocho pruebas actuales aprobadas; build y sincronización Capacitor comprobados. Navegador verificó formulario, enlaces, persistencia y demo. El despliegue se valida con health/HTTP y ausencia de servicios de otras aplicaciones. Consultar docs/VALIDACION.md y docs/DESPLIEGUE.md.
