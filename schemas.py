import re
from typing import Literal
from pydantic import BaseModel, ConfigDict, Field, field_validator

ModelAuto = Literal['deportivo', 'clasico', 'todoterreno', 'hombre_noir', 'hombre_azul', 'hombre_verde', 'hombre_marfil', 'hombre_rojo', 'hombre_plata']

class CrearRequest(BaseModel):
    model_config = ConfigDict(str_strip_whitespace=True, extra='forbid')
    nombre_compradora: str = Field(default="Alguien especial", min_length=1, max_length=100)
    telefono_whatsapp: str = Field(default="", max_length=25)
    metodo_pago: Literal['gratis', 'yape', 'plin', 'transferencia', 'efectivo']
    nombre_chico: str = Field(min_length=1, max_length=100)
    mensaje_texto: str = Field(min_length=1, max_length=2000)
    modelo_auto_elegido: ModelAuto
    url_foto_fondo: str | None = Field(default=None, max_length=500)

    @field_validator('telefono_whatsapp')
    @classmethod
    def phone(cls, value):
        if value == '':
            return value
        if not re.fullmatch(r'\+?[0-9 ()-]+', value) or not 7 <= sum(c.isdigit() for c in value) <= 15:
            raise ValueError('Introduce un teléfono válido, con código de país si corresponde.')
        return value

class CrearResponse(BaseModel):
    id_orden: int
    id_dedicatoria: int
    slug_url: str
    enlace: str
    estado_pago: Literal['pendiente'] = 'pendiente'

class DedicatoriaResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    slug_url: str
    estado: Literal['pendiente', 'pagado']
    nombre_chico: str
    mensaje_texto: str
    modelo_auto_elegido: str
    url_foto_fondo: str | None

class UploadResponse(BaseModel):
    url: str

class EsperaResponse(BaseModel):
    slug_url: str
    estado: Literal['pendiente'] = 'pendiente'
    mensaje: str
    whatsapp_url: str
