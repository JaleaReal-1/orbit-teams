# Reposicionamiento comercial de JaleaSec

Revisión local: 15 de octubre de 2026. Rama: `codex/jaleasec-posicionamiento-web`.
Especificación: `JALEASEC_CODEX_PLAN_REPO.md` (archivo aportado por el propietario, conservado sin cambios).

## Compatibilidad y decisiones

La inspección del código y los cinco commits recientes confirmó una web estática HTML/CSS/JS, catálogo compartido, solicitud local por WhatsApp y Campus Planner independiente con Vite/Capacitor. No se necesita migrar el stack, instalar dependencias, añadir backend ni modificar despliegue. Se conserva el diseño oscuro, los acentos, tarjetas y componentes existentes.

Las ofertas de entrada son web para negocio y portafolio universitario. Se conserva la referencia web desde S/ 300 y la adaptación Android desde S/ 350. El portafolio no tenía precio confirmado: muestra «Solicitar cotización». Los ocho precios/plazos del catálogo se conservan como orientativos. El número comercial permanece en `apps/web/data/contact.js`, sin modificaciones.

## Archivos y cambios

| Archivo | Cambio |
| --- | --- |
| `apps/web/index.html` | JaleaSec, hero de software, CTA directo, dos entradas de público, ofertas iniciales, FAQ, formulario breve, sección de demostraciones y metadatos. El teléfono ilustrativo se mueve a demostraciones. |
| `apps/web/negocios.html` (nuevo) | Landing específica con ejemplos de necesidades, oferta web, evaluación de software, proceso, enlace a demo, FAQ y WhatsApp contextual. |
| `apps/web/universitarios.html` (nuevo) | Landing de portafolios y proyectos personales legítimos, con proceso, demo, FAQ y WhatsApp contextual. |
| `apps/web/assets/jaleasec.svg` (nuevo) | Marca gráfica original de código, usada como logo y favicon; se conserva el SVG anterior. |
| `apps/web/styles.css` | Ajustes graduales de hero, tarjetas, landings, formulario y estados. Contención de órbitas decorativas, navegación intermedia, foco existente y objetivos táctiles. |
| `apps/web/data/catalog.js` | Conserva ocho IDs y categorías; añade segmentos/destacados, ofertas y precios centralizados, filtro editorial y estado de cotización personalizada. Aclara uso individual de Campus Planner. |
| `apps/web/app.js` | Renderiza ofertas/filtros, mensajes contextuales y preselección de ofertas y fichas. Guarda accesos a campos opcionales, permite Escape en menú, respeta movimiento reducido y oculta vistas previas obsoletas al editar. Revela campos opcionales con errores de validación. |
| `apps/web/lib/request.js` | Mensaje de JaleaSec con tipo de cliente y solo campos informados; sin repetición de valores vacíos. |
| `apps/web/solucion.html`, `apps/web/detail.js` | Marca, favicon, metadatos dinámicos, salida útil para ID inválido y distinción explícita entre demo y propuesta por encargo. |
| `apps/web/privacidad.html` | Solo nombre visible, logo y favicon; se conserva el contenido y flujo técnico descrito. |
| `apps/mobile/campus-planner/index.html`, `apps/mobile/campus-planner/src/app.js` | Únicamente dos sustituciones de marca visible: título y pie. Sin cambios de lógica, datos, clave de almacenamiento, paquetes ni Android. |
| `scripts/build.mjs` | Solo nombre público del producto en `health.json`; mantiene endpoint y proceso de compilación. |
| `tests/commercial.test.mjs` | Actualiza esquema de solicitud; verifica opcionales vacíos, acentos/saltos, codificación WhatsApp, filtros, demo única y ofertas. |
| `README.md` | Identidad actual, oferta, funcionamiento y referencias operativas heredadas. |
| `docs/REPOSICIONAMIENTO-JALEASEC.md` (nuevo) | Este informe de cambios, validación y pendientes. |

El formulario pide nombre, tipo de cliente y necesidad, más consentimiento antes de preparar el mensaje. La solución es opcional; formato, actividad, funciones, usuarios, herramientas, presupuesto y fecha quedan en «Más detalles (opcional)». La vista previa no equivale a envío: el usuario debe abrir WhatsApp y enviar allí.

No se crea ejemplo comercial ficticio adicional; la demo real es suficiente para este alcance. No se inventan clientes, testimonios, cifras ni servicios de ciberseguridad. No se ofrecen tareas evaluadas para suplantar trabajo académico.

## Verificación completada

- `npm test`: 10 pruebas correctas, incluidas las 6 pruebas existentes de Campus Planner sin modificarlas.
- `npm run build`: correcto; compila Vite/Capacitor para demo y prepara `dist/web`.
- `node --check` en módulos comerciales editados: correcto.
- `git diff --check`: sin errores de espacios.
- Revisión de HTML compilado con HTMLParser: etiquetas balanceadas e IDs únicos en las cinco páginas comerciales.
- 150 resoluciones estáticas de enlaces/recursos/anclas correctas al interpretar las páginas desde raíz y `/orbit-soft/`.
- Navegador: portada, ambas landings, ficha válida e inválida, privacidad y demo cargan. Sin errores de consola registrados en los recorridos.
- Vista previa con nombre ficticio, acentos, `&`, signos y texto largo: mensaje legible y URL codificada. Copiar muestra «Mensaje copiado». No se envió ningún mensaje externo.
- Preselección de portafolio y web para negocio: solución, tipo de cliente y formato correctos; filtro Negocios y Universitarios con estados `aria-pressed` correctos.
- Menú móvil abre y cierra; Escape cierra y devuelve foco; filtros activables con Enter.
- Sin desbordamiento horizontal en portada, ambas landings, ficha de Agenda Local y privacidad a 320, 375, 390, 768, 1024 y 1440 px. Revisión visual de portada móvil y escritorio: se conserva el tema oscuro, CTA verde, jerarquía del hero y tarjeta de oferta. Se corrigió desbordamiento de órbitas decorativas detectado durante la revisión.
- Servidor temporal local con prefijo: navegación home → negocios → oferta → solicitud, ficha y demo funcionan desde `/orbit-soft/`; título/pie de la demo muestran JaleaSec.

Los servidores de revisión son locales, sin relación con producción. No se ejecutó `npm ci`: se usaron las dependencias ya instaladas y no cambiaron `package.json` ni el lock.

## Pendientes y límites de la revisión

- Zoom real 200%: los atajos del navegador integrado no alteraron su factor de zoom; no se da por verificado. Revisarlo manualmente antes de publicar.
- La revisión de teclado/foco y responsive no constituye una auditoría completa de accesibilidad o pruebas en teléfonos físicos.
- WhatsApp: se verificó el enlace, su codificación y copia; no se envió ningún mensaje ni se probó una conversación real en móvil.
- Confirmar precio y alcance del portafolio, condiciones de soporte y contenido real de futuros proyectos de portafolio. Los precios existentes siguen siendo referencias, no nuevos compromisos comerciales.
- Confirmar la ruta real de publicación de `jaleasec.tech` antes de añadir canonical, sitemap o robots. No se hicieron consultas ni cambios a DNS o producción.
- Los metadatos de fichas se actualizan con JavaScript, como la arquitectura actual. Algunos rastreadores sociales no ejecutan JS; un futuro cambio separado podría generar fichas HTML por producto si se necesita compartirlas con metadatos específicos sin JS.

## Migraciones pospuestas

Se mantienen `orbit-soft`, `@orbit-soft/campus-planner`, IDs Android/Capacitor, clave local `orbitsoft.campusplanner.v1`, Nginx, Docker, carpetas AWS, releases y endpoint `/orbit-soft/health.json`. Renombrarlos requeriría un plan separado para no romper rutas, instalación/actualizaciones ni datos locales. La documentación histórica mantiene hechos anteriores.

No se hizo push, merge, despliegue ni cambios de infraestructura, secretos, certificados o cuentas externas. Los cambios quedan locales para revisión.
