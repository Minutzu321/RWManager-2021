# Generated by Django 3.2 on 2021-09-06 20:41

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('backend', '0035_auto_20210906_2340'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='rezervare',
            name='sid',
        ),
    ]