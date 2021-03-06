from django.shortcuts import render

# Create your views here.
from django.shortcuts import render
from django.http import HttpResponseRedirect
from django.contrib.auth.models import User
from rest_framework import viewsets, permissions, status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.views import APIView
from .serializers import MovieSerializer, UserSerializer, UserSerializerWithToken
from .models import Movie

class MovieView(viewsets.ModelViewSet):
  serializer_class = MovieSerializer
  queryset = Movie.objects.all()

@api_view(['GET'])
def current_user(request):
  """ Determine current user by token, return data """

  serializer = UserSerializer(request.user)
  return Response(serializer.data)

class UserList(APIView):
  """ Create new user """
  permission_classes = (permissions.AllowAny,)

  def post(self, request, format=None):
    serializer = UserSerializerWithToken(data=request.data)
    if serializer.is_valid():
      serializer.save()
      return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.data, status=status.HTTP_400_BAD_REQUEST)