# Generated by Django 3.1.7 on 2022-03-30 18:19

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('builder', '0010_armylist_data_json'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='armylist',
            name='data_json',
        ),
    ]
