# Generated by Django 3.2 on 2021-08-27 19:10

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('backend', '0023_punct_sid'),
    ]

    operations = [
        migrations.AddField(
            model_name='punct',
            name='ocupat',
            field=models.BooleanField(default=False),
        ),
    ]
