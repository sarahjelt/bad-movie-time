# Generated by Django 2.2.3 on 2019-07-07 03:05

from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('badmovietime', '0007_auto_20190707_0300'),
    ]

    operations = [
        migrations.AlterField(
            model_name='movie',
            name='user_shelf',
            field=models.ManyToManyField(blank=True, to=settings.AUTH_USER_MODEL),
        ),
    ]