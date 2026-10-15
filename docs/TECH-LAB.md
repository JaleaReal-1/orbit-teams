# JaleaSec / Tech Lab

Rediseño local del 15 de octubre de 2026, basado en `JALEASEC_CODEX_TECH_LAB.md` y el tema `data-style="lab"` de `JALEASEC_TECH_LAB_REFERENCIA.html`. Ambos archivos de referencia se conservaron sin editar.

## Decisiones

- La implementación se preparó inicialmente en `main`, por instrucción del propietario («Trabaja en nuestra rama»). Posteriormente autorizó publicarla en `main` y conservar el trabajo en la rama `codex/jaleasec-tech-lab`.
- Se conserva el HTML estático, CSS y módulos JavaScript existentes. Sin router, framework, fuentes remotas ni dependencias nuevas.
- Identidad Tech Lab: fondo `#07171a`, paneles `#0e2325`/`#143037`, acento `#62ead4`, cuadrícula tenue y etiquetas monoespaciadas. Logo de código actualizado al mismo lenguaje.
- Se reorganiza la presentación de los componentes compartidos, sin limitar el cambio a la paleta: hero dividido, mockups de navegador, tarjetas de audiencia y oferta, catálogo de tres columnas, proceso, FAQ, formulario en panel y fichas con resumen lateral.
- Texto de lectura de 16–18 px, descripciones de tarjetas de 16 px, acciones de 15–16 px y áreas táctiles de al menos 44 px. Las etiquetas decorativas pueden ser menores.
- La nueva página `proyectos.html` reúne la demo y conceptos con contexto y enlaces propios. La home conserva `#demos`, `#soluciones`, `#proceso` y `#solicitud`.
- Los mockups son HTML/CSS ligeros y estáticos. Norte y Sofía son ejemplos ficticios, rotulados como conceptos; sus botones dibujados no envían ni reservan nada. Campus Planner sigue siendo la única demo funcional.
- Navegación y pie consistentes en las seis páginas comerciales. En móvil el menú depende de la clase aplicada al inicializar JS; si no carga JS, los enlaces quedan visibles.
- Aparición de secciones con IntersectionObserver, sin estado oculto inicial. Sin soporte del observador o con movimiento reducido se conserva el contenido directamente visible. CSS desactiva animaciones, transiciones y transformaciones con `prefers-reduced-motion`.

## Archivos

| Archivo | Cambio |
| --- | --- |
| `apps/web/styles.css` | Sistema visual compartido Tech Lab, tipografía, componentes, responsive, hover y movimiento reducido. Sustituye los estilos y el mockup orbital anterior. |
| `apps/web/assets/jaleasec.svg` | Logo y favicon con turquesa, geometría y bordes Tech Lab. |
| `apps/web/index.html` | Hero con mockup, rutas de audiencia, sección de proyectos, jerarquía, formulario y navegación actualizados. Conserva anclas y campos. |
| `apps/web/negocios.html` | Hero con web ficticia, oferta y evaluación de sistemas presentadas en paneles, acceso a proyectos. |
| `apps/web/universitarios.html` | Hero con portafolio ficticio, paneles de oferta y adaptación, acceso a proyectos. |
| `apps/web/proyectos.html` (nuevo) | Demo Campus Planner, conceptos de negocio y portafolio, estados, tecnologías, alcance y consultas preseleccionadas. |
| `apps/web/solucion.html` | Encabezado y pie compartidos, tema y carga de las interacciones generales. |
| `apps/web/detail.js` | Inicialización del reveal tras generar la ficha; elimina estilo inline de un enlace. Conserva los datos y mensajes de alcance. |
| `apps/web/privacidad.html` | Navegación, tema, enlace para saltar al contenido y pie consistentes; sin modificar el contenido de privacidad. |
| `apps/web/app.js` | Mejora progresiva del menú, estado accesible del filtro y reveal. Conserva contacto, catálogo, ofertas, preselección, validación, preview y copia. |
| `apps/web/lib/reveal.js` (nuevo) | Mejora visual opcional, sin ocultación obligatoria ni dependencias. |
| `tests/commercial-pages.test.mjs` (nuevo) | Verifica recursos, enlaces y anclas en raíz/subdirectorio, IDs de fichas/ofertas y fallback sin observador o con movimiento reducido. |
| `README.md` | Acceso a esta guía y a la página de proyectos. |
| `docs/TECH-LAB.md` (nuevo) | Decisiones, archivos, validación y revisión local. |

No se modificaron catálogo/precios, número comercial, composición del mensaje, Campus Planner, núcleo, backend, infraestructura, scripts de compilación/despliegue, package.json ni lock.

## Validación

- `npm ci`: correcto con el lock existente. El instalador informó tres avisos moderados en las dependencias existentes; no se ejecutó actualización automática ni se cambió el lock.
- `npm test`: 12 pruebas correctas, incluidas las pruebas de dominio y solicitud anteriores.
- `npm run build`: correcto, incluye compilación de la demo Vite y copia comercial a `dist/web`.
- `npm run dev`: servidor local iniciado correctamente en `http://127.0.0.1:4173/`.
- `git diff --check`: correcto.
- HTML de las seis páginas: etiquetas balanceadas e identificadores únicos, comprobado con HTMLParser.
- Navegador: portada, Negocios, Universitarios, Proyectos, ficha válida, ID inválido, privacidad y demo cargan; sin errores de consola registrados en esos recorridos.
- Portada y las otras cinco vistas comerciales, a 320, 360, 390, 768, 1024 y 1440 px: sin overflow horizontal. Revisión visual de portada móvil y escritorio y hero universitario: fondo, cuadrícula, contraste, jerarquía y mockups coherentes con Tech Lab.
- Portada: H1 medido de 83.52 px y descripción de 18 px a 1440 px; H1 de 36–39 px y descripción de 17 px a 320–390 px.
- Menú móvil: abre/cierra, actualiza `aria-expanded`, Escape devuelve foco. Filtro Todas por Enter muestra los ocho registros; estado del filtro anunciado en un `role="status"`.
- Solicitud preseleccionada desde web para negocio: tipo Negocio, solución y formato correctos. Mensaje con signos y `&` codificado correctamente en WhatsApp; copia muestra «Mensaje copiado»; editar oculta la vista previa anterior. No se envió ningún mensaje externo.
- Los CTA segmentados conservan mensajes distintos para negocios y universitarios. Las consultas de proyectos enlazan a la oferta correspondiente.
- Copia temporal de portada sin scripts: navegación móvil visible, hero con opacidad 1 y sin overflow. Esa copia se eliminó al regenerar el build.
- Fallback del reveal sin observador y con preferencia de movimiento reducido validado por pruebas. La regla CSS evita transformaciones y animaciones en ese modo.
- Campus Planner carga con su estado local anterior. No se modificaron sus datos ni archivos.

## Revisar localmente

Desde la raíz del repositorio:

```powershell
npm run build
npm run dev
```

Abrir `http://127.0.0.1:4173/`, y desde allí Negocios, Universitarios, Proyectos, Soluciones y Conversemos. La demo está en `/demos/campus-planner/`; la privacidad en `/privacidad.html`. Después de editar archivos fuente, recompilar: el servidor existente sirve `dist/web`, no vigila los cambios automáticamente.

## Límites y pendientes

La revisión no sustituye una auditoría completa de accesibilidad, pruebas en dispositivos físicos o diferentes navegadores. Movimiento reducido se cubrió mediante tests de fallback y CSS, sin cambiar la preferencia del sistema. No se probó envío real por WhatsApp. Los precios y alcances conservan su carácter orientativo. Canonical, sitemap, dominio y rutas de producción permanecen fuera de este rediseño.

Durante la implementación no se publicó ni se alteró infraestructura. Tras la revisión local, el propietario autorizó el push a `main` para activar el despliegue conectado de Cloudflare y conservar el trabajo en `codex/jaleasec-tech-lab`. El estado final del despliegue se consulta en Cloudflare.
