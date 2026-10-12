from pathlib import Path
from pydantic_settings import BaseSettings, SettingsConfigDict
from sqlalchemy import create_engine
from sqlalchemy.orm import DeclarativeBase, sessionmaker

ROOT = Path(__file__).resolve().parent

class Settings(BaseSettings):
    database_url: str = 'mysql+pymysql://orbitjoy:change-me@127.0.0.1:3306/orbitjoy?charset=utf8mb4'
    public_base_url: str = 'http://127.0.0.1:8000'
    upload_max_bytes: int = 3 * 1024 * 1024
    admin_username: str = ''
    admin_password: str = ''
    whatsapp_number: str = '51978371277'
    model_config = SettingsConfigDict(env_file=ROOT / '.env', extra='ignore')

settings = Settings()
engine = create_engine(settings.database_url, pool_pre_ping=True, pool_recycle=1800,
                       **({'connect_args': {'check_same_thread': False}} if settings.database_url.startswith('sqlite') else {}))
SessionLocal = sessionmaker(bind=engine, expire_on_commit=False)

class Base(DeclarativeBase):
    pass

def get_db():
    with SessionLocal() as session:
        yield session
