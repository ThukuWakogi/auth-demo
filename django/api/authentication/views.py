from allauth.account.models import EmailAddress
from dj_rest_auth.app_settings import api_settings
from dj_rest_auth.views import LoginView
from rest_framework import status
from rest_framework.response import Response
from rest_framework.serializers import ValidationError

from django.utils import timezone
from django.utils.translation import gettext_lazy as _


class CustomLoginView(LoginView):
    def get_response(self):
        serializer_class = self.get_response_serializer()

        if api_settings.USE_JWT:
            from rest_framework_simplejwt.settings import api_settings as jwt_settings

            access_token_expiration = (
                timezone.now() + jwt_settings.ACCESS_TOKEN_LIFETIME
            )
            refresh_token_expiration = (
                timezone.now() + jwt_settings.REFRESH_TOKEN_LIFETIME
            )
            return_expiration_times = api_settings.JWT_AUTH_RETURN_EXPIRATION
            # auth_httponly = api_settings.JWT_AUTH_HTTPONLY
            data = {
                "user": self.user,
                "access": self.access_token,
                "refresh": self.refresh_token,
            }

            # if not auth_httponly:
            #     data["refresh"] = self.refresh_token
            # else:
            #     # Wasnt sure if the serializer needed this
            #     data["refresh"] = ""

            if return_expiration_times:
                data["access_expiration"] = access_token_expiration
                data["refresh_expiration"] = refresh_token_expiration

            serializer = serializer_class(
                instance=data, context=self.get_serializer_context()
            )
        elif self.token:
            serializer = serializer_class(
                instance=self.token,
                context=self.get_serializer_context(),
            )
        else:
            return Response(status=status.HTTP_204_NO_CONTENT)

        response = Response(serializer.data, status=status.HTTP_200_OK)
        if api_settings.USE_JWT:
            from dj_rest_auth.jwt_auth import set_jwt_cookies

            set_jwt_cookies(response, self.access_token, self.refresh_token)
        return response

    def post(self, request, *args, **kwargs):
        self.request = request
        self.serializer = self.get_serializer(data=self.request.data)
        print(request.data)
        try:
            self.serializer.is_valid(raise_exception=True)
        except ValidationError as e:
            if "non_field_errors" in e.detail:
                for x in e.detail.get("non_field_errors"):
                    if x == "E-mail is not verified.":
                        email = EmailAddress.objects.filter(
                            user__username=request.data.get("username")
                        ).first()

                        if email and not email.verified:
                            email.send_confirmation(request)

                            raise ValidationError(
                                {
                                    "non_field_errors": [
                                        _(
                                            f"A verification E-mail has been sent to {email.email}."
                                        )
                                    ]
                                }
                            )

            raise ValidationError(e.detail)

        self.login()

        return self.get_response()
