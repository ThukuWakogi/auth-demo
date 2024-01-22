from django.contrib.auth.backends import ModelBackend
from django.http.request import HttpRequest
from typing import Any
from django.contrib.auth.base_user import AbstractBaseUser
from django.contrib.auth import get_user_model
from django.db.models import Q


class CustomModelBackend(ModelBackend):
    def authenticate(
        self,
        request: HttpRequest,
        username: str | None = ...,
        password: str | None = ...,
        **kwargs: Any
    ) -> AbstractBaseUser | None:
        UserModel = get_user_model()

        try:
            user = UserModel.objects.get(
                Q(username__iexact=username) | Q(email__iexact=username)
            )

            if user.check_password(password):
                return user

            return None
        except UserModel.DoesNotExist:
            return None
