# Orbit Joy: copia de AWS y análisis inicial

Fecha: 12 de octubre de 2026.

## Procedencia

Código copiado de `/home/ec2-user/orbitjoy/docker` en `ec2-18-224-68-11.us-east-2.compute.amazonaws.com`. Docker confirmó esa carpeta como directorio de trabajo de los contenedores activos `orbitjoy-app-1` y `orbitjoy-web-1`.

Se verificó que el archivo descargado coincide con el SHA-256 del servidor: `8ae8f84972c5b286eea97f5ca9f3d5ce6e9233dd9037925a94691cca58e90dfc`.

Se copiaron el código, frontend, pruebas y configuración de despliegue. Se excluyeron `.env`, certificados, base de datos, fotos de clientes, entornos virtuales y cachés. La versión anterior `backend` y los respaldos permanecen en AWS. La copia local usa una base nueva; no replica pedidos existentes. No se reiniciaron ni modificaron los servicios de producción.

## Arquitectura y comportamiento actual

- API: Python 3.12, FastAPI, Pydantic y SQLAlchemy.
- Frontend: HTML, CSS y JavaScript servidos desde `static`; catálogo, creador, checkout, regalo y administración.
- Persistencia: SQLite en el despliegue Docker (`data/orbitjoy.db`), con soporte de conexión MySQL. Imágenes en `static/uploads`.
- Despliegue: Docker Compose, Uvicorn con dos procesos y Nginx; configuración adicional para HTTPS y renovación de certificados.
- Flujo: subir imagen, crear orden y dedicatoria, generar enlace de seis caracteres, mostrar espera y activar manualmente desde administración después de verificar el pago por WhatsApp.
- Administración: formulario de acceso, cookies firmadas, alternativa HTTP Basic y validación de tokens en aprobación.
- Migración: agrega el estado de la dedicatoria conservando registros existentes.

## Hallazgos para el siguiente desarrollo

1. `README.md` conserva descripciones antiguas: dice que no hay administración ni bloqueo de pago, aunque ambos ya existen. `deploy/EC2-status.md` contiene una IP anterior.
2. Incluso el método `gratis` crea regalos pendientes y requiere aprobación. Confirmar el comportamiento comercial deseado antes de cambiarlo.
3. No se observa limitación de intentos de acceso, creación de regalos ni subida de imágenes. Las fotos se sirven como archivos públicos aunque el regalo esté pendiente.
4. Las dependencias usan rangos amplios y no hay archivo de bloqueo. Una instalación nueva puede diferir de la imagen desplegada.
5. Los enlaces cortos facilitan compartir, pero no deben considerarse una garantía de privacidad.
6. Las pruebas existentes cubren API, imágenes, colisiones, aprobación y migración; una expectativa de administración parece anterior al formulario de acceso actual.

## Desarrollo local en Windows

El entorno `.venv` está separado del código. Para iniciar una demo sin MySQL ni credenciales de producción:

```powershell
$env:PYTHONUTF8 = '1'
$env:DATABASE_URL = 'sqlite:///./local-demo.db'
$env:PUBLIC_BASE_URL = 'http://127.0.0.1:8000'
.\.venv\Scripts\python.exe -m uvicorn main:app --host 127.0.0.1 --port 8000 --reload
```

Abrir `http://127.0.0.1:8000`. Para utilizar administración, definir `ADMIN_USERNAME` y `ADMIN_PASSWORD` locales antes de iniciar. No reutilizar credenciales de AWS.

```powershell
$env:PYTHONUTF8 = '1'
.\.venv\Scripts\python.exe -m pytest -q tests
```

## Preparación para GitHub

Se ampliaron `.gitignore` y `.dockerignore` para excluir la clave PEM presente en esta carpeta, otros archivos de claves, configuración privada y el archivo de transferencia. Repositorio de destino autorizado: https://github.com/JaleaReal-1/orbit-teams, rama `main`.

## Verificación local

Dependencias instaladas en `.venv`; `pip check` no encontró incompatibilidades declaradas. Resultado de `pytest -q tests`: **6 pruebas aprobadas y 1 fallida**. La prueba `test_payment_gate_admin_auth_and_escaping` espera HTTP 401 al abrir `/admin` sin sesión, pero el código actual redirige al formulario de acceso y el cliente de pruebas sigue esa redirección hasta HTTP 200. Esa prueba se detiene allí, por lo que sus comprobaciones posteriores no quedaron verificadas en esta ejecución. Se conserva el código y la prueba originales para revisar este desfase en el siguiente desarrollo.

Se ejecutó Python con `PYTHONUTF8=1`, necesario para leer las plantillas UTF-8 con la configuración de Windows utilizada. Las versiones instaladas son las permitidas actualmente por los rangos, no una reproducción exacta de las versiones de producción.

## Actualización: reestructuración Orbit Soft (12 octubre 2026)

Se revisó el producto de regalos completo. La lógica de órdenes, dedicatorias, fotos, pagos, enlaces cortos y administración se retiró del árbol activo porque no corresponde a la nueva oferta. Su versión original es recuperable mediante el commit a312e38; no se conserva una aplicación heredada ejecutable en producción de Orbit Soft. La base y los servicios anteriores en AWS no se migran.

Reutilizado: estructura de despliegue Docker/Nginx, separación de almacenamiento e interfaz como criterio de arquitectura y número público de WhatsApp. Nuevos: web estática, catálogo de datos, solicitud por WhatsApp, plantilla Android Campus Planner con Capacitor, núcleo de dominio/reportes y esqueleto futuro FastAPI.

Se ejecutaron nuevamente las siete pruebas originales antes de retirarlas: 6 aprobadas y 1 fallida, test_payment_gate_admin_auth_and_escaping (401 esperado, 200 recibido tras redirección al login). La nueva suite tiene 8 pruebas, todas aprobadas. Build de interfaz y cap sync Android completados. La verificación nativa/compilación APK queda pendiente por ausencia de JDK 21 y SDK Android; hay Java 8 instalado.

Despliegue preparado para carpeta separada /home/ec2-user/orbit-soft, contenedor estático en puerto interno 8082 e ingreso HTTP por el hostname AWS autorizado. La configuración HTTPS anterior apunta a 18.188.198.49: no se utiliza como certificado de Orbit Soft. Registrar dominio y HTTPS propio es el siguiente paso operativo.
