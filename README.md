# JaleaSec

JaleaSec es una marca digital de desarrollo de software con atención online para universitarios y negocios de Juliaca, Perú. Proyecto independiente, sin afiliación institucional. Cada encargo se plantea con diseño e identidad propios para el cliente y un alcance acordado. Ofertas iniciales: web para negocio y portafolio universitario. Apps Android y sistemas pequeños sujetos a evaluación y cotización. No se ofrecen servicios de ciberseguridad.

La web usa HTML, CSS y JavaScript nativo, con páginas estáticas para negocios y universitarios, catálogo de propuestas y solicitud revisable por WhatsApp. Campus Planner sigue siendo la única demo funcional.

El diseño comercial Tech Lab comparte tipografía, paneles y navegación entre Inicio, Negocios, Universitarios, Proyectos, fichas y privacidad. `/proyectos.html` distingue la demo funcional de los conceptos ficticios. Consulta [diseño y validación Tech Lab](docs/TECH-LAB.md) para revisar los cambios localmente.

Los nombres npm, workspace, Android, recursos AWS y rutas `/orbit-soft/` son identificadores operativos heredados; se mantienen sin migración. El dominio indicado es `jaleasec.tech`; canonical y sitemap quedan pendientes de confirmar su ruta pública real. No se ha modificado infraestructura con este reposicionamiento.

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
apps/mobile/campus-planner/     Demo offline con Capacitor 8
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

Agregar o editar soluciones y ofertas iniciales en `apps/web/data/catalog.js`. Los filtros usan metadatos editoriales `segments` y `featured` sin cambiar las categorías originales. Cada registro alimenta catálogo, ficha y selector de solicitud. Precios desde S/ 300 para webs y desde S/ 350 para un desarrollo Android básico; referencias editoriales sujetas a alcance, sin prometer un paquete cerrado. Plazos en semanas desde la definición y recepción del contenido.

WhatsApp comercial: +51 938 888 511. Cambiar `apps/web/data/contact.js` si cambia el contacto comercial. El formulario no almacena datos ni envía automáticamente: valida, prepara un mensaje, permite revisarlo/copiarlo y abre WhatsApp al elegir Enviar.

Campus Planner es la única demo funcional. Las demás fichas son propuestas de desarrollo a medida por encargo, no apps ya terminadas. No se inventan clientes, testimonios ni trabajos entregados.

## Campus Planner

Cursos/horarios, tareas y exámenes, seguimiento, notas, configuración visual, exportación/restauración JSON y reporte CSV. Persistencia nativa con Capacitor Preferences; localStorage solo en la demo de navegador. Hasta 500 registros por módulo. Sin servidor, sincronización ni PWA. Copias no cifradas; no usar datos sensibles en la demo pública.

```powershell
npm run android:sync
npm run android:open --workspace @orbit-soft/campus-planner
```

Consultar [Android](docs/ANDROID.md) para producir y firmar el APK. Se generó/sincronizó el proyecto nativo; la compilación e instalación Android requieren SDK 36 y JDK 21, ausentes en este equipo. No hay APK compilado incluido.

## Arquitectura y publicación

[Arquitectura](docs/ARQUITECTURA.md), [despliegue AWS](docs/DESPLIEGUE.md) y [planificación](PLANIFICACION.md). Solo se despliega la web estática y su demo; el backend futuro está deshabilitado. Roles, usuarios y proveedor de autenticación existen como contratos opcionales del núcleo, sin login real ni garantías de seguridad de servidor.

Destino AWS: `/home/ec2-user/orbit-soft`. URL principal HTTP: http://18.224.68.11/orbit-soft/ (también funciona el hostname AWS con ese prefijo). `/orbit-soft/health.json` identifica el commit del build publicado. El proyecto es el único servicio de la instancia: Nginx atiende directamente el puerto 80, sirve los archivos bajo /orbit-soft/ y redirige la raíz a esa ruta. No utiliza un proxy de otra aplicación. HTTPS propio pendiente de dominio/certificado.

## Validación y privacidad

`npm test` comprueba registros comerciales, composición/codificación de la solicitud, copias válidas e inválidas, referencias de cursos, seguimiento, CSV y módulos deshabilitados. `npm ci` usa el lock versionado.

Claves, `.env`, certificados, keystores, archivos de firma, bases, APKs, cachés y dependencias quedan fuera de Git. No se copian bases ni registros reales. La imagen Docker admite únicamente los archivos compilados y la configuración Nginx.
