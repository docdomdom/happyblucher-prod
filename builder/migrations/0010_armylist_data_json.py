# Generated by Django 3.1.7 on 2022-03-30 17:54

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('builder', '0009_auto_20220328_1103'),
    ]

    operations = [
        migrations.AddField(
            model_name='armylist',
            name='data_json',
            field=models.JSONField(default='hello world!'),
        ),
    ]
