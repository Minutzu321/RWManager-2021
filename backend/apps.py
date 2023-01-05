from django.apps import AppConfig
from .disbot import startBot


class BackendConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'backend'

    def ready(self):
        # startBot()
        pass
