from sqlalchemy import ForeignKey, String, Text, CheckConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship
from database import Base

class Orden(Base):
    __tablename__ = 'ordenes'
    __table_args__ = (CheckConstraint("estado_pago IN ('pendiente','pagado','rechazado')", name='ck_estado_pago'),)
    id_orden: Mapped[int] = mapped_column(primary_key=True)
    nombre_compradora: Mapped[str] = mapped_column(String(100))
    telefono_whatsapp: Mapped[str] = mapped_column(String(25))
    metodo_pago: Mapped[str] = mapped_column(String(30))
    estado_pago: Mapped[str] = mapped_column(String(20), default='pendiente')
    dedicatorias: Mapped[list['Dedicatoria']] = relationship(back_populates='orden')

class Dedicatoria(Base):
    __tablename__ = 'dedicatorias'
    __table_args__ = (CheckConstraint("estado IN ('pendiente','pagado')", name='ck_dedicatoria_estado'),)
    id_dedicatoria: Mapped[int] = mapped_column(primary_key=True)
    slug_url: Mapped[str] = mapped_column(String(6), unique=True, index=True)
    estado: Mapped[str] = mapped_column(String(20), default='pendiente', server_default='pendiente')
    nombre_chico: Mapped[str] = mapped_column(String(100))
    mensaje_texto: Mapped[str] = mapped_column(Text)
    modelo_auto_elegido: Mapped[str] = mapped_column(String(50))
    url_foto_fondo: Mapped[str | None] = mapped_column(String(500), nullable=True)
    id_orden: Mapped[int] = mapped_column(ForeignKey('ordenes.id_orden'), index=True)
    orden: Mapped[Orden] = relationship(back_populates='dedicatorias')
