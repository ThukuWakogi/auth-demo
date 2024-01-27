from django.urls import path, include
from api.authentication.views import CustomLoginView

urlpatterns = [
    path("login/", CustomLoginView.as_view()),
    path("", include("dj_rest_auth.urls")),
    path("", include("dj_rest_auth.registration.urls")),
]
