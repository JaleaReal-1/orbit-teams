# Verificación de la reestructuración

Fecha: 12 octubre 2026.

- Suite original antes del retiro: **6 aprobadas, 1 fallida**. El acceso `/admin` redirige al login (200 final) mientras la prueba esperaba 401; no es una regresión del nuevo MVP.
- Suite actual: **8 pruebas aprobadas** de catálogo y solicitud, codificación WhatsApp, copias, entradas inválidas, asociación de cursos, seguimiento, seguridad de CSV y permisos por defecto.
- `npm run build`: web y demo compilan correctamente.
- `npm run android:sync`: proyecto Android generado; tres plugins nativos sincronizados (Preferences, Filesystem, Share). Sin compilación/instalación APK: falta JDK 21 y SDK 36.
- Navegador: portada responsive inspeccionada a 390 px, sin desbordamiento horizontal; mensaje de solicitud generado con datos ficticios y enlace WhatsApp completo sin enviar el mensaje. Campus Planner conserva un curso y una tarea completada al recargar. Consola de demo sin errores en ese recorrido.
- Las copias/restauración se comprueban por pruebas de dominio; la exportación mediante el selector nativo Android necesita un dispositivo.
- Archivos privados: clave PEM y transferencia heredada ignoradas; staging/release se inspeccionan antes de subir. No se usa ninguna base real.

El despliegue se identifica por `/health.json`; la comprobación final debe comparar ese commit con `git rev-parse HEAD` y con `origin/main`, además de comprobar portada, fichas, privacidad y demo tanto en AWS como externamente.
