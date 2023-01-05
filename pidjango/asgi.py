import os

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'pidjango.settings')

import django
django.setup()

from channels.security.websocket import AllowedHostsOriginValidator
from channels.routing import ProtocolTypeRouter, URLRouter
from django.core.asgi import get_asgi_application
import backend.routing

from channels.auth import AuthMiddlewareStack

application = ProtocolTypeRouter({
    "http": get_asgi_application(),
    "websocket": AllowedHostsOriginValidator(
        AuthMiddlewareStack(
            URLRouter(
                backend.routing.websocket_urlpatterns
            )
        ),
    ),
})