from django.urls import path, include, re_path
from . import views
from .views import current_user, UserList, MovieView

urlpatterns = [
    path('current_user/', current_user),
    path('users/', UserList.as_view()),
    # re_path(r'', views.catchall),
    # path('movies/<int:id', MovieView.detail, name='detail'),
]