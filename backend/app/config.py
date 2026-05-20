from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    supabase_url: str
    supabase_key: str
    supabase_service_key: str
    openai_api_key: str
    mercadopago_access_token: str
    resend_api_key: str
    jwt_secret: str
    frontend_url: str = "http://localhost:3000"
    admin_emails: str = ""

    def get_admin_emails(self) -> list[str]:
        return [e.strip().lower() for e in self.admin_emails.split(",") if e.strip()]

    class Config:
        env_file = ".env"


settings = Settings()
