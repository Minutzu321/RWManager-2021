# Generated by Django 3.2 on 2021-08-25 21:08

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('backend', '0019_alter_indiciu_poza'),
    ]

    operations = [
        migrations.AlterField(
            model_name='locatie',
            name='lat',
            field=models.CharField(max_length=100),
        ),
        migrations.AlterField(
            model_name='locatie',
            name='lon',
            field=models.CharField(max_length=100),
        ),
    ]