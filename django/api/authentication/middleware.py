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
        self.pass_cookie_to_body(
            request, "/api/auth/token/verify/", "token", api_settings.JWT_AUTH_COOKIE
        )
        self.pass_cookie_to_body(
            request,
            "/api/auth/token/refresh/",
            "refresh",
            api_settings.JWT_AUTH_REFRESH_COOKIE,
        )

        return None

    def pass_cookie_to_body(
        self, request: HttpRequest, url_path: str, key: str, cookie_key: str
    ) -> None:
        if request.path == url_path:
            try:
                if key in json.loads(request.body.decode("utf-8")):
                    return None
            except JSONDecodeError:
                ...

            if cookie_key in request.COOKIES:
                data = {key: request.COOKIES[cookie_key]}
                request._body = json.dumps(data).encode("utf-8")
