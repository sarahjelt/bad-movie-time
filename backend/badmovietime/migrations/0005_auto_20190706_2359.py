# Generated by Django 2.2.3 on 2019-07-06 23:59

from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('badmovietime', '0004_auto_20190706_2314'),
    ]

    operations = [
        migrations.AlterField(
            model_name='movie',
            name='user_shelf',
            field=models.ManyToManyField(to=settings.AUTH_USER_MODEL),
        ),
    ]
