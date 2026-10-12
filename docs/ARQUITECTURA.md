# Arquitectura del MVP

Web comercial estática independiente → enlace de WhatsApp. No API ni datos comerciales guardados. Catálogo en `apps/web/data/catalog.js`, contacto en `data/contact.js`, composición de solicitud en `lib/request.js`, componentes visuales compartidos en CSS.

Campus Planner:

```text
Interfaz / src/app.js
       ↓
Dominio / packages/core/planner.js
       ↓
Contrato load() / save(state)
       ↓
LocalPlannerRepository → Capacitor Preferences → SharedPreferences Android
                                           → localStorage en demo de navegador
```

Sin service worker, manifiesto PWA ni URL remota embebida en Android. La APK incluye sus propios archivos y no solicita permiso INTERNET. El backup automático Android está deshabilitado. La copia JSON se comparte con Filesystem/Share nativos; en navegador se descarga. Restaurar valida versión, fechas, relaciones e identificadores antes de reemplazar el estado. El repositorio persiste antes de actualizar la interfaz. Las notas se escapan al renderizar; el CSV neutraliza fórmulas.

Almacenamiento individual para un MVP pequeño (hasta 500 registros por módulo), sin cifrado propio. Los datos se pierden al desinstalar si no hay una copia externa. No es apropiado para datos clínicos o documentos sensibles sin controles adicionales. Migrar el adaptador a SQLite para datos voluminosos, consultas o alto volumen de escrituras; las vistas y el dominio mantienen el mismo contrato.

`packages/core/modules.js` ofrece configuración de capacidades, interfaz de proveedor de sesión, representación de usuario, política de roles y reporte CSV. Autenticación, usuarios reales y roles operativos están deshabilitados. No existe una falsa pantalla de login. Para una futura app colaborativa, los permisos deben aplicarse también en el backend.

`src/data/future-api.js` marca la frontera de integración; no conecta a ningún servidor. `backend/` prepara FastAPI y una fábrica SQLAlchemy para PostgreSQL/MySQL, sin tablas, credenciales, sincronización ni despliegue. Antes de implementarlo: modelos por organización, migraciones, autenticación, aislamiento entre clientes, estrategia de conflictos y respaldos.

Para agregar una plantilla: crear otra app bajo `apps/mobile`, cambiar appId/nombre/recursos, definir módulos y campos, reutilizar validación/repositorio/reportes y acordar el alcance. Un APK por cliente requiere identidad y firma de actualización propias, conservadas fuera de Git.

AWS publica únicamente `dist/web`, incluida la demo compilada de navegador, bajo `/orbit-soft/`. El contenedor no contiene el backend, claves ni bases. `/orbit-soft/health.json` identifica públicamente el commit del paquete construido; dentro del contenedor es `/health.json`. Nginx retira el prefijo público y todos los enlaces de web/demo son relativos, manteniendo el producto Android independiente de esa ruta.
