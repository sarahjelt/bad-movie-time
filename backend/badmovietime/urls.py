from django.urls import path, include
from .views import current_user, UserList, MovieView

urlpatterns = [
    path('current_user/', current_user),
    path('users/', UserList.as_view()),
    # path('movies/<int:id', MovieView.detail, name='detail'),
]