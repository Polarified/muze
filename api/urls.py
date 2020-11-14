from django.urls import path
from .views import CreateRoomView, ListRoomView

urlpatterns = [
    path("create", CreateRoomView.as_view()),
    path("list", ListRoomView.as_view()),
]
