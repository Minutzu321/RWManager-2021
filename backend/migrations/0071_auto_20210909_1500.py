# Generated by Django 3.2 on 2021-09-09 12:00

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('backend', '0070_auto_20210909_1459'),
    ]

    operations = [
        migrations.AddField(
            model_name='treasurehuntsettings',
            name='inceput',
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name='treasurehuntsettings',
            name='terminat',
            field=models.BooleanField(default=False),
        ),
    ]
