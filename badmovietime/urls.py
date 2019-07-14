from django.urls import path, include
from . import views
from .views import current_user, UserList, MovieView

urlpatterns = [
    path('current_user/', current_user),
    path('users/', UserList.as_view()),
]