# Campus Planner Android

Proyecto nativo generado y sincronizado con Capacitor 8. Android mínimo: API 24 (Android 7), compile/target SDK 36 según la plantilla generada. Node 22 o superior. Usar Android Studio 2025.2.1 o posterior, SDK 36 y JDK 21. Fuentes oficiales: [entorno Capacitor](https://capacitorjs.com/docs/getting-started/environment-setup), [Android](https://capacitorjs.com/docs/android), [Preferences](https://capacitorjs.com/docs/apis/preferences).

```powershell
npm ci
npm run android:sync
npm run android:open --workspace @orbit-soft/campus-planner
```

Desde `apps/mobile/campus-planner/android`, con Java y SDK configurados:

```powershell
.\gradlew.bat assembleDebug
```

Resultado: `app/build/outputs/apk/debug/app-debug.apk`. Para entrega comercial generar una versión release firmada en Android Studio; conservar keystore, contraseñas y firma fuera del repositorio. No usar el APK de depuración como entrega comercial. La instalación externa requiere habilitar la fuente en el teléfono. Las actualizaciones deben conservar appId y firma para mantener datos.

Antes de entregar: instalar en un teléfono Android, activar modo avión, crear/editar cursos y actividades, cerrar/reabrir, exportar por el selector nativo, restaurar una copia, probar una actualización y verificar áreas seguras y teclado. Estas pruebas nativas están pendientes en esta máquina: solo tiene Java 8 y no dispone de Android Studio/SDK. Se verificaron el build de interfaz, la generación de `android/` y `cap sync`; no se afirma haber compilado ni instalado un APK.

Funcionalidades: cursos y bloques de horario, tareas/exámenes con fecha, seguimiento de completadas, notas, tema/nombre, JSON exportable/restaurable y CSV. Las tareas pendientes son recordatorios visuales; no hay notificaciones del sistema, calificaciones, alarmas ni sincronización en esta plantilla.
