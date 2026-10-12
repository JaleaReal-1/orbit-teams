# Verificación de la reestructuración

Fecha: 12 octubre 2026.

- Suite original antes del retiro: **6 aprobadas, 1 fallida**. El acceso `/admin` redirige al login (200 final) mientras la prueba esperaba 401; no es una regresión del nuevo MVP.
- Suite actual: **8 pruebas aprobadas** de catálogo y solicitud, codificación WhatsApp, copias, entradas inválidas, asociación de cursos, seguimiento, seguridad de CSV y permisos por defecto.
- `npm run build`: web y demo compilan correctamente.
- `npm run android:sync`: proyecto Android generado; tres plugins nativos sincronizados (Preferences, Filesystem, Share). Sin compilación/instalación APK: falta JDK 21 y SDK 36.
- Navegador: portada responsive inspeccionada a 390 px, sin desbordamiento horizontal; mensaje de solicitud generado con datos ficticios y enlace WhatsApp completo sin enviar el mensaje. Campus Planner conserva un curso y una tarea completada al recargar. Consola de demo sin errores en ese recorrido.
- Las copias/restauración se comprueban por pruebas de dominio; la exportación mediante el selector nativo Android necesita un dispositivo.
- Archivos privados: clave PEM y transferencia heredada ignoradas; staging/release se inspeccionan antes de subir. No se usa ninguna base real.

AWS: contenedor independiente saludable en `/home/ec2-user/orbit-soft`; Nginx validado y recargado. Portada y demo responden 200 desde el servidor. Una conexión externa confirmó 200 en portada, health, ficha Campus Planner, privacidad, demo y archivos JS del catálogo. `/health.json` coincide con el commit publicado; `current` apunta al release correspondiente. Orbit Joy continúa activo en sus contenedores previos.

La primera validación de Nginx detectó el límite del hash para el hostname AWS y restauró la configuración anterior antes de recargar. Se corrigió el tamaño del hash y se añadió comprobación del commit con espera de la nueva generación del ingreso. La publicación inicial de Orbit Soft es HTTP; HTTPS propio sigue pendiente.
