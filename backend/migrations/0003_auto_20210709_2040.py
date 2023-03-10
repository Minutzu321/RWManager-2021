# Generated by Django 3.2 on 2021-07-09 17:40

from django.db import migrations, models
import django.utils.timezone


class Migration(migrations.Migration):

    dependencies = [
        ('backend', '0002_auto_20210612_1736'),
    ]

    operations = [
        migrations.CreateModel(
            name='CookieMeta',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('ip', models.GenericIPAddressField()),
                ('user_agent', models.CharField(max_length=400)),
                ('width', models.SmallIntegerField(blank=True)),
                ('height', models.SmallIntegerField(blank=True)),
                ('dpi', models.SmallIntegerField(blank=True)),
                ('ora_data', models.DateTimeField(default=django.utils.timezone.now)),
            ],
        ),
        migrations.CreateModel(
            name='Observatie',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('nume', models.CharField(max_length=50)),
                ('text', models.TextField()),
                ('ora_data', models.DateTimeField(default=django.utils.timezone.now)),
            ],
        ),
        migrations.CreateModel(
            name='Setari',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('prioritate', models.IntegerField(unique=True)),
                ('recrutari', models.BooleanField(default=False)),
            ],
        ),
        migrations.RemoveField(
            model_name='cookie',
            name='ip',
        ),
        migrations.AddField(
            model_name='user',
            name='online',
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name='cookie',
            name='metadate',
            field=models.ManyToManyField(blank=True, null=True, to='backend.CookieMeta'),
        ),
    ]
