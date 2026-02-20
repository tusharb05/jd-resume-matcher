from pydantic import BaseModel

class SignUpRequestSchema(BaseModel):
    email: str
    password: str