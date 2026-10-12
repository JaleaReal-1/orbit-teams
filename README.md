# Orbit Soft

Estudio de software orientado a estudiantes, docentes, profesionales y pequeños emprendimientos de Juliaca, especialmente la comunidad de la UPeU filial Juliaca. Estudio independiente, sin afiliación institucional.

MVP: web comercial mobile-first, catálogo de ocho soluciones con fichas, servicios, proceso, demo, preguntas frecuentes, solicitud revisable por WhatsApp y política de privacidad. Dos líneas iniciales: webs informativas y aplicaciones Android configurables. Sin pagos, cuentas reales, panel comercial ni hosting para clientes.

## Ejecutar

Node.js 22+ y npm:

```powershell
npm ci
npm test
npm run build
npm run dev
```

Abrir http://127.0.0.1:4173. La demo Campus Planner está en `/demos/campus-planner/`. `npm run build` primero compila la app móvil y después prepara `dist/web` con la demo. No hace falta Python para publicar la web.

## Estructura

```text
apps/web/                       Web estática comercial
  data/catalog.js               Catálogo y precios orientativos
  data/contact.js               Contacto WhatsApp público
  lib/request.js                Mensaje de cotización
apps/mobile/campus-planner/     Plantilla offline con Capacitor 8
  android/                      Proyecto nativo Android versionado
  src/data/                     Repositorio local / frontera API futura
packages/core/                  Dominio, copias, reportes y módulos opcionales
backend/                        Esqueleto futuro FastAPI + PostgreSQL/MySQL
deploy/                         Nginx e instalación AWS por release
scripts/                        Build y servidor de revisión local
tests/                          Pruebas útiles de dominio y solicitud
docs/                           Arquitectura, Android y despliegue
```

## Personalizar la oferta

Agregar o editar soluciones en `apps/web/data/catalog.js`. Cada registro alimenta catálogo, ficha y selector de solicitud. Precios desde S/ 300 para webs y desde S/ 350 para una adaptación Android básica; referencias editoriales sujetas a alcance, sin prometer un paquete cerrado. Plazos en semanas desde la definición y recepción del contenido.

WhatsApp comercial: +51 978 371 277. Cambiar `apps/web/data/contact.js` si cambia el contacto comercial. El formulario no almacena datos ni envía automáticamente: valida, prepara un mensaje, permite revisarlo/copiarlo y abre WhatsApp al elegir Enviar.

Campus Planner es la única demo funcional. Las demás fichas son propuestas de adaptación por encargo, no apps ya terminadas. No se inventan clientes, testimonios ni trabajos entregados.

## Campus Planner

Cursos/horarios, tareas y exámenes, seguimiento, notas, configuración visual, exportación/restauración JSON y reporte CSV. Persistencia nativa con Capacitor Preferences; localStorage solo en la demo de navegador. Hasta 500 registros por módulo. Sin servidor, sincronización ni PWA. Copias no cifradas; no usar datos sensibles en la demo pública.

```powershell
npm run android:sync
npm run android:open --workspace @orbit-soft/campus-planner
```

Consultar [Android](docs/ANDROID.md) para producir y firmar el APK. Se generó/sincronizó el proyecto nativo; la compilación e instalación Android requieren SDK 36 y JDK 21, ausentes en este equipo. No hay APK compilado incluido.

## Arquitectura y publicación

[Arquitectura](docs/ARQUITECTURA.md), [despliegue AWS](docs/DESPLIEGUE.md) y [planificación](PLANIFICACION.md). Solo se despliega la web estática y su demo; el backend futuro está deshabilitado. Roles, usuarios y proveedor de autenticación existen como contratos opcionales del núcleo, sin login real ni garantías de seguridad de servidor.

Destino AWS: `/home/ec2-user/orbit-soft`. URL principal HTTP: http://18.224.68.11/orbit-soft/ (también funciona el hostname AWS con ese prefijo). `/orbit-soft/health.json` identifica el commit del build publicado. Orbit Soft es el único proyecto de la instancia: Nginx atiende directamente el puerto 80, sirve los archivos bajo /orbit-soft/ y redirige la raíz a esa ruta. No utiliza un proxy de otra aplicación. HTTPS propio pendiente de dominio/certificado.

## Validación y privacidad

`npm test` comprueba registros comerciales, composición/codificación de la solicitud, copias válidas e inválidas, referencias de cursos, seguimiento, CSV y módulos deshabilitados. `npm ci` usa el lock versionado.


Claves, `.env`, certificados, keystores, archivos de firma, bases, APKs, cachés y dependencias quedan fuera de Git. No se copian bases ni registros reales. La imagen Docker admite únicamente los archivos compilados y la configuración Nginx.
