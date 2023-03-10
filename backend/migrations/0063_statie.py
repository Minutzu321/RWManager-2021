# Generated by Django 3.2 on 2021-09-09 11:15

from django.db import migrations, models
import django.db.models.deletion
import uuid


class Migration(migrations.Migration):

    dependencies = [
        ('backend', '0062_delete_statie'),
    ]

    operations = [
        migrations.CreateModel(
            name='Statie',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('st_sid', models.UUIDField(default=uuid.uuid4, unique=True)),
                ('nume', models.CharField(max_length=400)),
                ('locatie', models.ForeignKey(blank=True, on_delete=django.db.models.deletion.CASCADE, to='backend.locatie')),
                ('useri', models.ManyToManyField(blank=True, related_name='useri', to='backend.User')),
            ],
        ),
    ]
