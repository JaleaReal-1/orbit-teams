# API futura

Punto de partida FastAPI/SQLAlchemy; **no se despliega en el MVP**. La web no lo necesita y Campus Planner no lo llama. No existen rutas de usuarios, pagos ni sincronización.

Desde `backend`, para explorar en Python 3.12 aislado:

```powershell
python -m venv .venv
.venv/Scripts/python -m pip install -e ".[postgres]"
.venv/Scripts/python -m uvicorn app.main:app --reload
```

El conector admite PostgreSQL (`postgresql+psycopg://`) o MySQL (`mysql+pymysql://`, extra `mysql`). Se crea solo al suministrar una URL explícita con configuración privada. No se crean tablas ni bases automáticamente.

Antes de habilitarlo: fijar un lock, definir modelos por organización, migraciones Alembic, autenticación de servidor, autorización, cifrado de transporte, versionado y resolución de conflictos. La política de roles del núcleo es configuración de plantilla; no es seguridad de servidor. Nunca confiar en permisos enviados por el teléfono.
