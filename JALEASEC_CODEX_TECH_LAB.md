# JaleaSec — Implementación visual Tech Lab

## Instrucción principal para Codex

Implementa el rediseño visual **Tech Lab (estilo C)** sobre el repositorio actual `JaleaReal-1/orbit-teams`. Este documento es la especificación y `JALEASEC_TECH_LAB_REFERENCIA.html` es una **referencia visual conceptual**, no código de producción para copiar íntegramente.

**Objetivo:** que JaleaSec se vea como un estudio tecnológico actual, reconocible, legible y dinámico; que destaque ofertas reales de desarrollo de software para **negocios y universitarios de Juliaca** y facilite conversaciones por WhatsApp. La marca JaleaSec conserva su visión futura de ciberseguridad, pero **NO se ofrecen servicios de ciberseguridad actualmente**. Operación online.

## 0. Antes de modificar

1. Lee `README.md`, `apps/web/index.html`, `apps/web/negocios.html`, `apps/web/universitarios.html`, `apps/web/solucion.html`, `apps/web/detail.js`, `apps/web/app.js`, `apps/web/styles.css`, `apps/web/data/catalog.js`, `apps/web/lib/request.js`, `apps/web/data/contact.js`, `tests/commercial.test.mjs` y el archivo de referencia.
2. Trabaja en una rama nueva, sin reemplazar la rama principal automáticamente. Detecta cambios locales para no sobrescribirlos.
3. Usa HTML, CSS y JavaScript nativo ya existentes; **no migres a React, Next.js ni añadas librerías de animación grandes**.
4. Conserva los endpoints, enlaces y comportamiento existentes. No cambies nombres internos `@orbit-soft/...`, `orbit-soft` en Docker/AWS, rutas operativas de Nginx, configuración Android ni backend.
5. No hagas `git push`, despliegue ni cambios de infraestructura sin aprobación.

## 1. Dirección visual obligatoria: Tech Lab

El estilo elegido **no** es Editorial Premium ni Product Studio; es el tema `data-style="lab"` del prototipo. Extrae de él las ideas de diseño, pero adáptalas limpiamente a la web real, sin copiar el entorno del prototipo ni sus botones para elegir estilos o vistas.

### Paleta base

- Fondo principal: `#07171a`
- Superficie: `#0e2325`
- Superficie elevada: `#143037`
- Texto principal: `#f6f8fc`
- Texto secundario: `#c0d8da`
- Texto terciario, solo no crítico: `#95b7b8`
- Líneas/bordes: `#2b5757`
- Acento turquesa: `#62ead4`
- Fondo de panel destacado: `#0b2326`

Organiza estos valores mediante **variables CSS**; usa el acento para botones, foco, enlaces y elementos destacados. Mantén alto contraste: no uses letras gris oscuro sobre fondo oscuro. Usa degradados y brillos muy discretos; **evita el neón excesivo**.

### Estética

- Fondo técnico con cuadrícula muy tenue (solo visual, no interactiva).
- Líneas geométricas, paneles tipo dashboard/terminal o navegador, bordes finos y radios discretos (4–10 px).
- Etiquetas técnicas y microcopy con fuente monoespaciada como acento; los párrafos y títulos deben usar una fuente sans legible.
- Botones sólidos turquesa y variantes outline; estados hover/focus notables.
- Mucho mejor espaciado entre título, descripción, CTA y componentes.
- Tarjetas y mockups representativos y **claramente ficticios o demostrativos**. No inventes reseñas, empresas cliente, datos de ventas, resultados ni métricas.

## 2. Tipografía y legibilidad — prioridad máxima

- Texto principal de lectura: **16–18 px** y `line-height` aproximado 1.5–1.75.
- Texto de tarjetas: **mínimo 15–16 px**; descripciones importantes nunca de 11–13 px.
- Botones/links de acción: **15–16 px**, áreas táctiles alrededor de 44 px como mínimo.
- H1 escritorio: `clamp(3rem, 5.8vw, 5.25rem)` aproximadamente, ajustado al contenido.
- H1 móvil: alrededor de 36–46 px sin desbordes ni palabras truncadas.
- H2: aproximadamente 32–52 px según pantalla y sección.
- Etiquetas decorativas: 12–14 px solo cuando no contienen información esencial.
- Prioriza escaneo: pocos párrafos extensos, titulares directos y beneficios visibles.
- Verifica navegación con teclado, semántica, títulos jerárquicos y contraste suficiente.

## 3. Vistas a implementar

### Inicio (`apps/web/index.html`)
- Conservar JaleaSec y el mensaje comercial de **desarrollo de software**, no seguridad ofensiva, pentesting ni auditorías.
- Hero Tech Lab: H1 claro, subtítulo útil, CTA principal **«Cuéntanos tu proyecto»** conectado a WhatsApp y CTA secundario para explorar soluciones.
- Vista visual de producto, tipo navegador/mockup limpio, que ejemplifique una web para negocio o solución tecnológica. Debe poder hacerse con HTML/CSS o assets locales ligeros.
- Dos caminos de audiencia muy visibles: **«Tengo un negocio»** y **«Soy universitario»**, enlazados a las rutas existentes.
- Ofertas iniciales, soluciones por encargo, proyectos/demos, proceso, FAQ y contacto con jerarquía moderna.
- Conserva los anchors usados (`#soluciones`, `#proceso`, `#demos`, `#solicitud`) y los enlaces que dependen de ellos.

### Negocios (`apps/web/negocios.html`)
- Hero enfocado en el beneficio para emprendimientos de Juliaca, no en jerga técnica.
- Oferta «Web para tu negocio» prioritaria, con alcance y exclusiones consistentes con `apps/web/data/catalog.js`.
- Preview visual de **negocio ficticio** (web informativa con servicios y WhatsApp), rotulada explícitamente como demo conceptual si no es una demo navegable real.
- Mostrar aplicaciones y sistemas a medida como encargos, sin aparentar que ya existen productos terminados.
- CTA de WhatsApp con mensaje contextual conservado.

### Universitarios (`apps/web/universitarios.html`)
- Hero centrado en portafolios, iniciativas y herramientas personales.
- Preview de portafolio ficticio y propuesta de portafolio universitario con elementos visuales entendibles.
- Campus Planner como **única demo funcional**, con vínculo correcto; no modificar sus datos ni lógica.
- CTA WhatsApp contextual; mantener límites éticos del trabajo académico.

### Proyectos
- Puedes crear `apps/web/proyectos.html` **si mejora claramente la navegación**; alternativamente mejora la sección existente `#demos`/`#soluciones` sin duplicar demasiados contenidos.
- Mostrar Campus Planner (funcional) y previews conceptuales de web para negocio/portafolio como **conceptos**, nunca como trabajos entregados.
- Cards con captura/mockup legible, título, alcance, tecnología y estado real.
- Navegación de vuelta y CTA para consultar un proyecto.

### Contacto y fichas
- Aplicar el diseño Tech Lab a `solucion.html`, las fichas generadas por `detail.js`, formulario y `privacidad.html` para consistencia visual.
- Mantener el flujo actual: generar previsualización de mensaje, copiar y abrir WhatsApp **sin enviar automáticamente**.
- No mostrar precios inventados. Reutilizar valores de `apps/web/data/catalog.js` y no duplicarlos innecesariamente.

## 4. Dinamismo discreto y funcional

- Hover en tarjetas: elevación 3–6 px y borde turquesa muy suave.
- Botones con transición 160–250 ms; navegación y estados de selección claros.
- Reveal al hacer scroll solo si aporta: `IntersectionObserver`, animación ligera en transform/opacity de ~250–450 ms, con fallback a contenido visible sin JS.
- Soportar `prefers-reduced-motion: reduce`: desactivar transformaciones y transiciones innecesarias.
- Nada de cursores personalizados, parallax pesado, videos de fondo, destellos continuos ni animaciones infinitas.
- La página debe poder usarse perfectamente en táctil sin depender de hover.

## 5. SEO y rendimiento sin romper la publicación

- Conservar títulos, descripciones, `lang="es"`, y metadatos OG existentes, mejorando los que dependan de la nueva vista.
- Si se añaden canonical/sitemap, **confirmar la ruta real de producción antes**; no asumir que el servidor sirve la web desde `/` o `/orbit-soft/` sin verificarlo.
- Mantener rutas relativas cuando sean necesarias para el despliegue actual.
- No añadir fuentes remotas obligatorias, imágenes enormes ni scripts pesados. Optimizar assets nuevos y carga en móvil.
- Mantener interacción, menú móvil, filtros, contacto, demo y accesibilidad.

## 6. Validación y criterios de aceptación

Ejecutar `npm ci`, `npm test`, `npm run build` y `npm run dev` si el entorno lo permite. Actualizar tests al agregar nuevas páginas o estados. Comprobar manualmente si hay navegador disponible:

- Anchuras 360, 390, 768, 1024 y 1440 px; sin overflow horizontal ni texto cortado.
- H1, descripciones, precios y CTAs legibles y visibles en móvil.
- Menú móvil y teclado funcionando; foco visible.
- Todos los enlaces a Negocios, Universitarios, catálogo, fichas, demo, WhatsApp y privacidad.
- `app.js` funcionando en páginas con o sin catálogo/formulario (sin excepciones por elementos ausentes).
- Formulario conserva validación, preview y copia y no envía datos sin clic explícito.
- Campus Planner funciona igual que antes.
- `prefers-reduced-motion` funciona y las animaciones no ocultan contenido si no carga JS.
- Diferenciar claramente lo funcional, lo conceptual y el desarrollo por encargo.

## 7. Entrega esperada

1. Implementa P0: paleta Tech Lab, tipografía, nueva jerarquía visual, encabezado, tarjetas y botones, responsive, consistencia en todas las vistas.
2. Implementa P1: previews comerciales veraces, interacción ligera y sección de proyectos si aplica.
3. Al terminar, resume archivos modificados, decisiones tomadas, pruebas ejecutadas con resultados reales y pendientes no verificados.
4. **No hagas push ni despliegue.** Permite revisión local antes de publicar.

## Exclusiones explícitas

No: servicios de ciberseguridad, afirmaciones de empresa constituida, referencias a trámites, Indecopi, pagos, login, dashboards reales, backend de producción, datos falsos de clientes, reestructuración del monorepo ni renombrar rutas técnicas heredadas. No cambies los precios ni textos contractuales sin señalarlos para revisión.
