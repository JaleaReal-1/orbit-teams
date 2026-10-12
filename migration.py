"""Add payment state to existing SQLite/MySQL databases without removing rows."""
from sqlalchemy import inspect, text
from sqlalchemy.exc import DBAPIError
from database import engine, Base
import models

def migrate():
    Base.metadata.create_all(bind=engine)
    if 'estado' in {column['name'] for column in inspect(engine).get_columns('dedicatorias')}:
        return
    try:
        with engine.begin() as connection:
            connection.execute(text("ALTER TABLE dedicatorias ADD COLUMN estado VARCHAR(20) NOT NULL DEFAULT 'pendiente' CHECK (estado IN ('pendiente','pagado'))"))
    except DBAPIError:
        # Two workers may initialize simultaneously; only ignore an already completed migration.
        if 'estado' not in {column['name'] for column in inspect(engine).get_columns('dedicatorias')}:
            raise

if __name__ == '__main__':
    migrate()
