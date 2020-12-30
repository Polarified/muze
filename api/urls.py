from django.urls import path
from .views import CreateRoomView, ListRoomView, GetRoomView, JoinRoomView, UserInRoomView

urlpatterns = [
    path("create", CreateRoomView.as_view()),
    path("list", ListRoomView.as_view()),
    path("get", GetRoomView.as_view()),
    path("join", JoinRoomView.as_view()),
    path("user", UserInRoomView.as_view()),
]
