# JALEASEC — Plan de reposicionamiento comercial y cambios de código para Codex

> **Repositorio analizado:** `https://github.com/JaleaReal-1/orbit-teams` (rama `main`, lectura realizada el 15/10/2026).  
> **Sitio comercial:** `https://jaleasec.tech`  
> **Propósito:** convertir la web existente de Orbit Soft en el sitio comercial de **JaleaSec**, enfocado **exclusivamente por ahora en desarrollo de software** para **universitarios y negocios de Juliaca**.  
> **Estado de este documento:** especificación de implementación; **no se ha modificado el repositorio**.

---

## 0. Instrucciones operativas para Codex

Actúa como desarrollador frontend senior, diseñador UX/UI y responsable de calidad del proyecto. **Antes de editar, inspecciona el estado actual del repositorio, revisa el historial reciente y lee este documento completo.** Confirma que los archivos y la arquitectura descritos siguen vigentes: el repositorio podría haber cambiado después de la revisión.

1. Trabaja sobre una **rama nueva** (p. ej. `feat/jaleasec-posicionamiento-web`) y no publiques ni hagas despliegues. Respeta cambios locales existentes y no los sobrescribas.
2. **No migres el stack** a React, Next.js, Tailwind u otro framework. Utiliza HTML, CSS y JavaScript nativo; reutiliza la estructura y los componentes actuales. Evita dependencias nuevas salvo necesidad demostrada.
3. Modifica principalmente `apps/web/`, con actualizaciones mínimas en pruebas y documentación. **No reconstruyas ni reescribas Campus Planner.**
4. Haz cambios pequeños, fáciles de revisar y coherentes. Asegura accesibilidad, diseño responsive y enlaces reales.
5. Nunca inventes clientes, testimonios, estadísticas, certificaciones, experiencia comercial, equipo, casos reales, plazos garantizados ni productos terminados.
6. La identidad pública será **JaleaSec**, exactamente así, con dominio actual `jaleasec.tech`. **JaleaSoft NO se lanzará como marca aparte por ahora.**
7. JaleaSec tiene una visión de ciberseguridad a largo plazo, pero su fundador sigue formándose: **NO crear páginas comerciales, precios, botones de contratación ni afirmaciones de experiencia profesional en ciberseguridad**. Si se menciona, hacerlo solo en el contexto de la visión futura o aprendizaje, sin ofrecer servicios.
8. JaleaSec será una **marca digital con atención online**, con referencia geográfica comercial a **Juliaca, Perú**. No inventes oficina, dirección, atención presencial, equipo registrado ni afiliación universitaria.
9. Fuera de alcance: trámites, registro de marca, Indecopi, constitución empresarial, asesoría legal o redacción de nuevos textos jurídicos. La página de privacidad existente debe **conservarse y mantenerse técnicamente fiel** a la forma real de manejar los datos; actualiza solo las referencias de marca y los hechos que cambien.
10. No toques infraestructura real, secretos, certificados, DNS, dominios, producción, cuentas externas o credenciales. **No hagas `git push`, deploy ni merge** sin instrucción explícita.

## 1. Arquitectura REAL del repositorio: respetarla

No supongas que es una SPA de React. La inspección confirmó:

| Área | Archivo(s) relevante(s) | Notas |
| --- | --- | --- |
| Home comercial | `apps/web/index.html` | HTML estático, secciones con anclas. |
| Estilos | `apps/web/styles.css` | Diseño oscuro, tarjetas, responsive y variables CSS; conservar como base. |
| Interacción web | `apps/web/app.js` | Menú móvil, catálogo, filtros, solicitud, WhatsApp. |
| Catálogo | `apps/web/data/catalog.js` | `solutions`: **8 registros**; categorías actuales Estudiantes, Docentes, Profesionales, Negocios, Organizaciones y A tu medida. |
| Contacto | `apps/web/data/contact.js` | `contact.whatsapp`, `contact.display`, `whatsappUrl(message)`; conservar número confirmado en el código salvo cambio autorizado. |
| Solicitud | `apps/web/lib/request.js` | `requestMessage(values)` genera mensaje, luego se revisa y abre WhatsApp. |
| Fichas | `apps/web/solucion.html`, `apps/web/detail.js` | Detalles de cada solución con parámetro `?id=...`. |
| Privacidad existente | `apps/web/privacidad.html` | Su contenido describe el flujo local, sin envío automático. |
| Demo funcional | `apps/mobile/campus-planner/` | Vite + Capacitor 8; se publica demo de navegador en `/demos/campus-planner/`. |
| Build | `scripts/build.mjs`, `package.json` | `npm run build` compila Campus Planner y copia `apps/web` hacia `dist/web`; incluye `health.json`. |
| Tests | `tests/commercial.test.mjs`, `tests/planner.test.mjs` | Ejecutar `npm test`; ampliar/ajustar pruebas comerciales. |
| Despliegue heredado | `deploy/nginx.conf`, `deploy/release.sh`, docs | Actualmente usan prefijo y nombres internos `/orbit-soft/`; NO renombrar sin plan de migración separado. |
| Backend | `backend/` | Es un esqueleto futuro, no un backend comercial en producción. NO añadir almacenamiento de leads. |

### Advertencia de compatibilidad técnica

Las cadenas `orbit-soft` aparecen en lugares que **no son marca de cara al público**: nombre npm (`orbit-soft`), workspace `@orbit-soft/campus-planner`, identificadores Android, carpeta AWS, imágenes Docker, rutas `/orbit-soft/`, configuración de Nginx y algunos archivos de documentación histórica.

- Cambiar **sí**: textos públicos, `title`, descripción, OG, navbar, hero, footer, etiquetas, aria-label, mensaje comercial, branding en `health.json` si procede, y descripción actual de README.
- Cambiar **NO por ahora**: `@orbit-soft/campus-planner`, `appId` de Capacitor, paquetes Java/Gradle, rutas del servidor, nombres de recursos operativos, directorio de releases, endpoint `/orbit-soft/health.json` ni nombre del repositorio. Documentar estas referencias como identificadores heredados.
- Verificar enlaces en ruta raíz **y** al servir el build desde el subdirectorio `/orbit-soft/` usado actualmente. **No crear rutas `/negocios` o `/universitarios` que dependan de rewrites inexistentes**; preferir páginas HTML explícitas, p. ej. `./negocios.html` y `./universitarios.html`.

## 2. Objetivo de negocio y audiencia

**Objetivo primario:** que una persona entienda qué vende JaleaSec, se identifique como **universitario** o **negocio de Juliaca** y pueda empezar una **conversación por WhatsApp con el mínimo esfuerzo**.

**Servicio único comercial en esta etapa:** desarrollo de software: webs informativas, portafolios web, aplicaciones Android y sistemas pequeños a medida. No ofrecer servicios de ciberseguridad.

**Segmento A — Negocios de Juliaca:** pequeños negocios, barberías, tiendas, servicios, academias y emprendimientos. Problemas potenciales: presencia digital débil, información dispersa, consultas, reservas y registros manuales. **No afirmar que todo negocio tiene esos problemas; son hipótesis para explorar.**

**Segmento B — Universitarios:** estudiantes que necesitan portafolios personales, sitios para iniciativas, apps organizativas o software para proyectos personales legítimos. No presentar el servicio como elaboración de tareas evaluadas para suplantar trabajo académico.

**Conversión objetivo:** clic en CTA a WhatsApp con mensaje relevante, o solicitud breve revisable. No perseguir solo seguidores o visitas.

## 3. P0 — Cambios indispensables de lanzamiento

### P0.1. Rebranding visual y textual en toda la web comercial

- Sustituir **Orbit Soft / orbitsoft / Orbit** como marca **visible** por **JaleaSec** en `index.html`, `solucion.html`, `detail.js`, `app.js`, `request.js`, `privacidad.html`, atributos accesibles, encabezados, footer, metadatos y títulos dinámicos.
- No hacer búsqueda/reemplazo global sobre todo el repo: preservar identificadores técnicos descritos en §1.
- Crear una **marca gráfica SVG original, sencilla y legible** en `apps/web/assets/jaleasec.svg` (o equivalente) y actualizar el favicon y el logo web. Inspiración: tecnología, precisión, software; sin insinuar certificados o servicios de seguridad. Mantener el logo anterior si otros recursos aún lo usan; no romperlos.
- Mantener el lenguaje visual oscuro de `styles.css` (tipografía, contrastes y acentos existentes); hacer mejoras graduales, no un rediseño costoso o completo.
- Evitar falsas señales de autoridad: contadores de clientes, valoraciones, logotipos de terceros, “somos líderes”, etc.

### P0.2. Hero enfocado en conversión

En la portada (`apps/web/index.html`), proponer esta copia o una versión editorialmente mejor sin perder el mensaje:

**Eyebrow:** `JALEASEC · DESARROLLO DE SOFTWARE · JULIACA, PERÚ`

**H1:** `Creamos soluciones digitales para tus ideas y tu negocio.`

**Texto:** `Desarrollamos páginas web, aplicaciones Android y sistemas personalizados para universitarios y negocios de Juliaca. Atención online y soluciones definidas según tus necesidades.`

**CTA principal:** `Cuéntanos tu proyecto` → contacto directo por WhatsApp (mensaje precargado, no envío automático).

**CTA secundario:** `Explorar soluciones` → ancla/sección de públicos objetivo.

- En menos de un scroll debe quedar clara la propuesta.
- La gran ilustración actual de Campus Planner puede conservarse como prueba técnica, pero **no debe dominar el argumento comercial** ni hacer parecer que JaleaSec solo crea software académico.
- Mantener performance y jerarquía semántica de encabezados.

### P0.3. Dos caminos de entrada claros

Crear una sección inmediatamente después del hero con **dos tarjetas diferenciadas**, responsivas y accesibles:

1. `Tengo un negocio` → `./negocios.html`. Texto: `Una web para presentar tus servicios o una herramienta digital para organizar mejor tu negocio.` CTA `Ver soluciones para negocios`.
2. `Soy universitario` → `./universitarios.html`. Texto: `Portafolios web, proyectos personales y herramientas digitales para tu vida universitaria.` CTA `Ver soluciones para universitarios`.

En ambas páginas incluir encabezado, propuesta específica, problemas habituales expresados como ejemplos, **servicios disponibles sin inventar funcionalidades**, proceso, demostraciones o capturas reales, FAQ acotada, CTA a WhatsApp y enlace a solicitud más detallada si se desea. Mantener la misma identidad y navegación. Cada una debe tener `title`, `description`, H1 y URL propios.

No introducir un router ni backend. Usar navegación estática y enlaces relativos compatibles con subdirectorios.

### P0.4. Oferta comercial fácil de entender

Destacar estas dos **ofertas iniciales** (sin afirmar que ya fueron vendidas):

- **Web para tu negocio:** landing informativa adaptable a móviles, secciones para servicios/productos, información de contacto y botón WhatsApp. Dominio y hosting externos no incluidos salvo acuerdo.
- **Portafolio universitario:** página personal con presentación, proyectos, habilidades y contacto. Contenido proporcionado por el cliente y alcances definidos.

Como ofertas adicionales, mencionar apps Android o sistemas a medida **bajo evaluación y cotización**, sin compromiso de integrar servidores, pagos o sincronización que aún no existen.

**Precios:** el código actual muestra webs `Desde S/ 300` y adaptación Android `Desde S/ 350`; los ocho registros tienen precios y plazos orientativos. **No sustituirlos automáticamente por S/ 250, 690 u otras cifras hipotéticas**. Primero localizar todos los precios, conservar referencias existentes si continúan coherentes, y explicar siempre que son orientativos y sujetos a alcance. Para ofertas nuevas sin precio confirmado usar `Solicitar cotización`. Centralizar textos/precios para evitar contradicciones.

No prometer fecha de entrega fija ni soporte gratuito ilimitado. No vender servicios que todavía requieren implementación no evaluada.

### P0.5. Contacto con baja fricción

Mantener y mejorar el sistema actual:

- Conservar `contact.whatsapp` y `whatsappUrl()` de `apps/web/data/contact.js` como fuente única de contacto; **no exponer un número inventado**.
- Agregar CTA directo a WhatsApp en hero y en ambas landing pages con mensajes de contexto distintos, p. ej.:
  - Negocios: `Hola, JaleaSec. Tengo un negocio en Juliaca y me gustaría conversar sobre una página web o una herramienta digital.`
  - Universitarios: `Hola, JaleaSec. Soy universitario y quiero consultar por un portafolio o proyecto de software.`
  - General: `Hola, JaleaSec. Me gustaría conversar sobre un proyecto de software.`
- No agregar formulario de login, base de datos de prospectos, API, email transaccional o CRM.
- El formulario `#request-form` actual pide **12 campos**. Simplificar la primera fase a: `nombre`, `tipo de cliente`, `qué necesita / problema` y, si es útil, `tipo de solución`. Dejar otros campos como opcionales o en un bloque desplegable `Más detalles (opcional)`. Evitar exigir presupuesto, funciones, usuarios o fecha para iniciar una conversación. Preservar accesibilidad, validación y límites de longitud.
- Mantener una **vista previa** del mensaje y el botón `Enviar por WhatsApp` bajo acción expresa del usuario. No afirmar “solicitud enviada” si solo se generó el texto.
- Actualizar `apps/web/lib/request.js` y su test para el nuevo esquema. Los campos opcionales vacíos no deberían inundar el mensaje con 10 veces `Por definir`; generar un texto legible y claro.
- Asegurar que la preselección desde `?solution=...#solicitud`, `data-platform` y `#solution-select` no genere errores si cambian los campos. Revisar nulos antes de acceder a elementos que puedan no existir.
- Los CTAs han de funcionar en celular y navegador de escritorio. Comprobar codificación de acentos, signos y saltos de línea.

### P0.6. Portafolio y credibilidad honestos

Añadir una sección `Proyectos y demostraciones`, o una página `./proyectos.html` si simplifica la navegación:

- **Campus Planner**: mostrarlo como **demo funcional**, con enlace REAL `./demos/campus-planner/`, explicar brevemente qué hace y que trabaja con almacenamiento local y datos ficticios.
- **Software para negocios**: crear como máximo una **vista de ejemplo demostrativa, estática o interactiva simple** (p. ej., prototipo visual de una landing para barbería o sistema de reservas ficticio), únicamente si se puede construir con calidad sin comprometer P0. Debe decir claramente `Ejemplo conceptual / no es un proyecto entregado a un cliente`. No simular reservas reales, servidores o confirmaciones que no existen.
- Enlaces al código o GitHub solo cuando sean públicos y pertinentes; no inventarlos.
- No reutilizar fichas de propuestas (`Agenda Local`, `Inventory Mobile`, etc.) como casos de éxito terminados. Sus estados actuales son `Adaptación por encargo`; preservarlos o hacerlos más explícitos.

## 4. P1 — Jerarquía del catálogo y mejoras de experiencia

### P1.1. Catalogar sin borrar trabajo anterior

En `apps/web/data/catalog.js` actualmente hay 8 soluciones: `campus-planner`, `course-manager`, `clinic-pocket`, `agenda-local`, `inventory-mobile`, `event-check-in`, `document-flow`, `custom`. **No eliminarlas masivamente** ni presentarlas como ocho aplicaciones operativas.

- Primera impresión: destacar lo directamente relevante a universitarios y negocios. Para lo demás, usar sección secundaria `Más soluciones por encargo` o filtros secundarios.
- Cambiar navegación comercial prominente hacia `Universitarios` y `Negocios` sin clasificar falsamente a cada solución. Se puede añadir metadato editorial explícito `segments` o `featured` y mantener `category` original.
- Conservar `id` existente: `detail.js`, enlaces `solucion.html?id=...` y preselección dependen de él.
- Actualizar el filtro en `apps/web/app.js` si cambia el criterio; preservar `aria-pressed`, estado activo y operación con teclado.
- Ajustar estados/comentarios de la UI para distinguir claramente `Demo disponible`, `Concepto`, `Adaptación por encargo`, `Cotización a medida`.

### P1.2. Páginas de detalles y FAQ

- Modificar `solucion.html` y `detail.js` para mostrar JaleaSec en logo, título dinámico, meta description y footer; mantener funcional el parámetro `id`.
- Simplificar las descripciones excesivamente técnicas cuando el lector es cliente no desarrollador; no exagerar capacidades.
- Mantener avisos transparentes sobre uso local y sincronización no incluida en la app actual.
- Actualizar FAQ para dos públicos, precios orientativos, contacto online, plazos sujetos a alcance y diferencia entre demo y desarrollo por encargo.
- La antigua pregunta `¿Orbit Soft pertenece a la UPeU?` puede reformularse como `¿JaleaSec es parte de alguna universidad?`, con respuesta breve y factual: es un proyecto independiente; no representa oficialmente a ninguna institución. Evitar que la marca parezca parte de UPeU.

### P1.3. UX y accesibilidad

- Menú móvil usable, foco visible, orden lógico de tabulación, `aria-expanded` actualizado y sin enlaces rotos.
- Verificar a 320, 375, 390, 768, 1024 y 1440 px, con texto largo y zoom 200%.
- No usar imágenes gigantes ni scripts externos por estética. Respetar `prefers-reduced-motion` donde haya transiciones.
- Revisar legibilidad de color, tamaños de botón, jerarquía de H1/H2 y estados hover/focus.
- No añadir librerías CSS ni trackers solo para el rediseño.

## 5. P1 — SEO local y metadatos

- En portada usar propuesta editorial similar a:
  - `<title>JaleaSec | Desarrollo de páginas web y software en Juliaca</title>`
  - `<meta name="description" content="Desarrollamos páginas web, portafolios, aplicaciones Android y sistemas personalizados para negocios y universitarios de Juliaca. Atención online.">`
- `negocios.html`: título/description especializados en páginas web y soluciones para negocios de Juliaca.
- `universitarios.html`: título/description especializados en portafolios y soluciones para universitarios.
- `solucion.html` mantiene metadatos dinámicos seguros y coherentes, sin prometer más de lo descrito en cada ficha.
- Ajustar `og:title`, `og:description`, `og:type` y `og:image` **solo si existe un recurso válido**. Favicon actualizado.
- Crear `robots.txt` y `sitemap.xml` solo si se conocen las URLs canónicas reales; no publicar rutas equivocadas por ignorar el prefijo actual `/orbit-soft/`. El dominio actual es `jaleasec.tech`, pero validar rutas reales antes de fijar canonical/sitemap.
- Enlazar páginas desde la home y entre sí; usar semántica HTML y contenido útil para el visitante. Evitar relleno repetitivo de palabras clave, testimonios ficticios y supuestos rankings de Google.
- Sin Google Business Profile, mapas físicos ni direcciones inventadas. El negocio es online.

## 6. P2 — Mantenimiento, documentación y pruebas

- `scripts/build.mjs`: actualizar solo el **nombre público** del producto en `health.json`, si procede; no romper el endpoint esperado por release.
- Actualizar `README.md` con identidad JaleaSec, propuesta comercial, stack, ejecución local y aclaración de que algunas rutas/identificadores técnicos siguen bajo nombres heredados de Orbit Soft. No alterar el funcionamiento de scripts por una limpieza cosmética.
- Mantener `ANALISIS-PROYECTO.md`, `PLANIFICACION.md` y docs históricas sin reescribir hechos del pasado; añadir nota de transición en documentación actual si resulta útil.
- La página `privacidad.html` ya existe: mantener el acceso desde el formulario y el footer; ajustar nombre visible y solo hechos técnicos que efectivamente cambien. No crear documentos legales nuevos.
- Ajustar `tests/commercial.test.mjs`: actualmente espera **exactamente 8 productos** y que el mensaje contenga todos los campos antiguos. Si el catálogo se amplía o cambia la solicitud, refactorizar tests a las reglas vigentes, en lugar de romper funcionalidad para que pasen.
- No cambiar `tests/planner.test.mjs` salvo causa real. No introducir regresiones en la demo.

### Comandos de validación

Desde la raíz del repo, con Node 22+:

```bash
npm ci
npm test
npm run build
npm run dev
```

Verificar en `http://127.0.0.1:4173/`:

- Portada y navegación; páginas `negocios.html` y `universitarios.html`; ficha `solucion.html?id=campus-planner`; `privacidad.html`.
- `demos/campus-planner/` carga y conserva el comportamiento actual.
- CTA de WhatsApp abre `wa.me` con el texto de JaleaSec, correctamente codificado, **sin enviar automáticamente**.
- Enlace de solución preselecciona la oferta; vista previa y copia de mensaje funcionan.
- 404 en una ficha inválida muestra salida útil; sin errores de consola.
- Menú, filtros, navegación por teclado y mobile funcionan correctamente.
- El contenido público no ofrece ciberseguridad ni conserva menciones obsoletas a Orbit Soft.

**No desplegar:** la infraestructura descrita sirve archivos bajo `/orbit-soft/` y además puede existir una ruta específica desde el dominio `jaleasec.tech`. Si se requiere cambiar rutas o infraestructura, solo anotar una recomendación de migración para revisión posterior.

## 7. Criterios de aceptación finales

Consideraré el trabajo terminado cuando se cumpla todo lo siguiente:

- [ ] Web comercial completamente identificada como **JaleaSec**.
- [ ] Queda claro en el hero que **hoy se vende desarrollo de software**.
- [ ] Dos rutas de entrada visibles: **Negocios de Juliaca** y **Universitarios**.
- [ ] Al menos dos ofertas fáciles de comprender: web para negocio y portafolio universitario.
- [ ] Primer contacto simple y mensajes segmentados que funcionen por WhatsApp.
- [ ] Campus Planner sigue operativa como demo; otras ideas no se presentan como entregas terminadas.
- [ ] Catálogo y fichas mantienen identificadores/enlaces funcionales.
- [ ] SEO básico correcto en páginas comerciales sin URLs canónicas falsas.
- [ ] Responsive, accesibilidad y navegación comprobadas.
- [ ] `npm test` y `npm run build` correctos, o bloqueadores reales documentados con exactitud.
- [ ] Ningún trámite legal, nueva página de ciberseguridad, dependencia innecesaria ni despliegue no autorizado.

## 8. Entregable de Codex en su última respuesta

Presenta:

1. **Resumen ejecutivo** de lo que cambió y por qué mejora la conversión.
2. **Relación de archivos** añadidos/modificados.
3. **Capturas o descripción de revisión visual** de escritorio y móvil si tienes herramientas para verificarlas; no inventar capturas.
4. **Pruebas ejecutadas y resultados**, separando verificaciones completadas de las no disponibles.
5. **Pendientes de negocio** que el propietario debe confirmar (por ejemplo, precios exactos, imágenes de portafolio adicionales o contenidos reales).
6. **Riesgos de migración pospuestos**: dominio/rutas AWS, nombres npm/Android y otros identificadores operativos legacy.
7. Confirmación explícita de que **no se desplegó ni se cambió la infraestructura**.

---

## Prompt corto para iniciar Codex

```text
Analiza el repositorio local de JaleaSec (antes Orbit Soft) y lee completo JALEASEC_CODEX_PLAN_REPO.md.

Quiero implementar la identidad pública JaleaSec y mejorar la web para captar los primeros clientes de desarrollo de software entre universitarios y negocios de Juliaca. Hoy NO ofrecemos ciberseguridad; esa especialidad queda para el futuro. Funcionamos como marca digital y atendemos online; no quiero trámites ni contenidos sobre asuntos legales.

No migres el stack: la web actual usa HTML/CSS/JS nativo, el catálogo está en apps/web/data/catalog.js, el formulario de WhatsApp está en app.js/lib/request.js, y Campus Planner tiene su propio workspace Capacitor/Vite.

Trabaja en una nueva rama y respeta cambios locales. Aplica los cambios P0 y P1 del documento y aborda P2 si es pertinente. Mantén la demo funcional, las URLs relativas y las rutas/identificadores internos de despliegue heredados; no hagas reemplazo global de orbit-soft. Conserva el diseño oscuro como base. No inventes clientes, productos terminados, testimonios ni precios.

Actualiza pruebas y ejecuta npm test y npm run build. No despliegues, no hagas push ni merge. Al terminar, presenta archivos modificados, pruebas, pendientes y riesgos.
```
