from django.db import models
from django.contrib.auth.models import User

# Create your models here.
class Movie(models.Model):
  title = models.CharField(max_length=120)
  description = models.TextField()
  completed = models.BooleanField(default=False)
  poster = models.CharField(max_length=500)
  user_shelf = models.ManyToManyField(User, blank=True)


  def _str_(self):
    return self.title