# Generated by Django 3.2 on 2021-09-09 12:02

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('backend', '0071_auto_20210909_1500'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='treasurehuntsettings',
            name='greu_1',
        ),
        migrations.RemoveField(
            model_name='treasurehuntsettings',
            name='greu_2',
        ),
        migrations.RemoveField(
            model_name='treasurehuntsettings',
            name='greu_3',
        ),
        migrations.RemoveField(
            model_name='treasurehuntsettings',
            name='greu_mentiune_1',
        ),
        migrations.RemoveField(
            model_name='treasurehuntsettings',
            name='greu_mentiune_2',
        ),
        migrations.RemoveField(
            model_name='treasurehuntsettings',
            name='mediu_1',
        ),
        migrations.RemoveField(
            model_name='treasurehuntsettings',
            name='mediu_2',
        ),
        migrations.RemoveField(
            model_name='treasurehuntsettings',
            name='mediu_3',
        ),
        migrations.RemoveField(
            model_name='treasurehuntsettings',
            name='mediu_mentiune_1',
        ),
        migrations.RemoveField(
            model_name='treasurehuntsettings',
            name='mediu_mentiune_2',
        ),
        migrations.RemoveField(
            model_name='treasurehuntsettings',
            name='tombola',
        ),
    ]
