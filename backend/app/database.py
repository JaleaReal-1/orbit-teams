from sqlalchemy import create_engine
from sqlalchemy.orm import DeclarativeBase, sessionmaker

class Base(DeclarativeBase):
    pass

def create_session_factory(database_url: str):
    """Explicit opt-in: never creates a database or reads credentials at import time."""
    if not database_url.startswith(("postgresql+psycopg://", "mysql+pymysql://")):
        raise ValueError("Configure PostgreSQL or MySQL outside the repository.")
    return sessionmaker(bind=create_engine(database_url, pool_pre_ping=True))
