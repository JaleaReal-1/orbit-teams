# Despliegue AWS de Orbit Soft

Host autorizado: ec2-18-224-68-11.us-east-2.compute.amazonaws.com.
Único proyecto de aplicación: Orbit Soft. Un contenedor Nginx sirve directamente el puerto 80, sin proxy heredado ni API de producción.

URL principal: http://18.224.68.11/orbit-soft/ . También funciona el hostname AWS con ese prefijo. La raíz / redirige a /orbit-soft/; /orbit-soft redirige a la variante con barra final, conservando parámetros. Las rutas ajenas al sitio responden 404.

## Publicación

1. Ejecutar npm ci, npm test y npm run build desde el commit seleccionado.
2. Crear un tar con git archive, añadir solo dist/web y un archivo RELEASE_COMMIT con el SHA completo. Revisar que no contenga claves, .env, bases ni certificados.
3. Crear /home/ec2-user/orbit-soft/releases/<commit> y transferir el paquete por SCP con la clave local ignorada por Git.
4. Extraer y ejecutar bash deploy/release.sh.
5. Comprobar /orbit-soft/health.json, portada, ficha, privacidad y demo desde el servidor y externamente. El health debe coincidir con main y current señalar el release vigente.

El script construye una imagen etiquetada por commit, valida nginx -t y prueba un contenedor temporal en 127.0.0.1:8083 antes de actualizar orbit-soft-web-1. La red orbit-soft-public solo agrupa este servicio. Los archivos se copian en /usr/share/nginx/html/orbit-soft/. No hay volumen de datos ni backend comercial.

Solo se publica HTTP. HTTPS requiere dominio y certificado propios; el puerto 443 no se sirve mientras no exista TLS válido. El formulario prepara un mensaje local y se envía por WhatsApp HTTPS. No usar datos privados en la demo pública.

## Recuperación

Desde un release compatible con esta arquitectura, exportar RELEASE_COMMIT y ejecutar sudo env RELEASE_COMMIT="$RELEASE_COMMIT" docker compose -p orbit-soft up -d --build --wait. Verificar health y actualizar current. No usar releases que dependan de un proxy de otra aplicación. La limpieza de la aplicación sustituida es una migración puntual; no se guardan sus respaldos en esta instancia.
