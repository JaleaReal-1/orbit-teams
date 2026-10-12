# Despliegue AWS de Orbit Soft

Host autorizado: `ec2-18-224-68-11.us-east-2.compute.amazonaws.com`.
Ruta: `/home/ec2-user/orbit-soft/releases/<commit>`; `current` apunta a la entrega vigente. Clave SSH únicamente local, ignorada por Git. Nunca copiarla al release.

1. Ejecutar `npm ci`, `npm test`, `npm run build` desde un checkout limpio del commit.
2. Crear un archivo tar con `git archive`, añadir solo `dist/web` compilado y un archivo `RELEASE_COMMIT` con el SHA completo. Inspeccionar su contenido antes de transferir.
3. Crear la carpeta del release por SSH y transferir el tar mediante SCP.
4. Extraer y ejecutar `bash deploy/release.sh`.
5. Verificar desde el servidor y una conexión externa `/orbit-soft/`, `/orbit-soft/health.json`, `/orbit-soft/solucion.html?id=campus-planner`, `/orbit-soft/privacidad.html` y `/orbit-soft/demos/campus-planner/`. Comprobar también que `/orbit-soft` redirija con 308 a `/orbit-soft/` y que la raíz siga sirviendo Orbit Joy.

Compose crea `orbit-soft-web-1`, red `orbit-soft-public` y puerto interno `127.0.0.1:8082`. Solo Nginx sirve archivos estáticos. La web se enruta por el Nginx existente del servidor, conectado a esa red, con un bloque HTTP para el hostname autorizado y su IP. `location ^~ /orbit-soft/` dirige a `http://orbit-soft-web:80/`: la barra final retira el prefijo y permite reutilizar los enlaces relativos del sitio y la demo. La raíz dirige al backend de Orbit Joy; `/admin` queda bloqueado por HTTP. El script conserva las rutas HTTPS previas, guarda una copia de la configuración anterior en AWS y valida `nginx -t` antes de recargar.

URL principal: `http://18.224.68.11/orbit-soft/`. Alternativa: `http://ec2-18-224-68-11.us-east-2.compute.amazonaws.com/orbit-soft/`. La demo está en `/orbit-soft/demos/campus-planner/`; el health público en `/orbit-soft/health.json`, y el interno permanece en `http://127.0.0.1:8082/health.json`. `/orbit-soft` redirige a la variante con barra final, conservando parámetros. No se reutiliza el certificado de Orbit Joy, que corresponde a otra IP. HTTPS de Orbit Soft requiere un dominio/certificado propio; no está configurado en esta etapa. El formulario no transmite información al servidor: prepara el texto y se envía mediante el servicio HTTPS de WhatsApp al pulsar el enlace y confirmar en esa app. La demo HTTP no es un almacenamiento para datos privados.

Si el contenedor del ingreso se recrea, conectar nuevamente `orbitjoy-web-1` a `orbit-soft-public` antes de recargar Nginx; el acoplamiento está documentado y se debe mover a un proxy de ingreso permanente al contratar dominio.

Rollback: entrar al release anterior, exportar su `RELEASE_COMMIT`, ejecutar `docker compose -p orbit-soft up -d --build --wait`, volver a apuntar `current` y recargar Nginx (su upstream cambia al recrear el contenedor). Para revertir también la ruta pública, restaurar `ingress-before-<commit>.conf`, validar y recargar. No borrar las carpetas previas ni datos de Orbit Joy.
