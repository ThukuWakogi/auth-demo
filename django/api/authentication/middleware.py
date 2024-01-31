import json
from json.decoder import JSONDecodeError

from dj_rest_auth.app_settings import api_settings

from django.http import HttpRequest


class MoveHTTPOnlyTokenToBody:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        response = self.get_response(request)

        return response

    def process_view(self, request: HttpRequest, view_func, *view_args, **view_kwargs):
        if request.path == "/api/auth/token/verify/":
            try:
                if "token" in json.loads(request.body.decode("utf-8")):
                    return None
            except JSONDecodeError:
                ...

            if api_settings.JWT_AUTH_COOKIE in request.COOKIES:
                data = {"token": request.COOKIES[api_settings.JWT_AUTH_COOKIE]}
                request._body = json.dumps(data).encode("utf-8")

        return None
