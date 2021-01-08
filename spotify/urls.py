from django.urls import path
from .views import AuthURL, spotify_callback, IsAuthenticated
# from .views import Tokens

urlpatterns = [
    path('authurl', AuthURL.as_view()),
    # path('tokens', Tokens.as_view()),
    path('redirect', spotify_callback),
    path('isauth', IsAuthenticated.as_view()),
]