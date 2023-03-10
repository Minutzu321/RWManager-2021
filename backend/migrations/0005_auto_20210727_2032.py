# Generated by Django 3.2 on 2021-07-27 17:32

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('backend', '0004_auto_20210709_2213'),
    ]

    operations = [
        migrations.CreateModel(
            name='GeoTrack',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('ip', models.GenericIPAddressField()),
                ('tara', models.CharField(max_length=10)),
                ('oras', models.CharField(max_length=20)),
                ('regiune', models.CharField(max_length=20)),
                ('loc', models.CharField(max_length=40)),
            ],
        ),
        migrations.AddField(
            model_name='setari',
            name='cache',
            field=models.BooleanField(default=True),
        ),
    ]
