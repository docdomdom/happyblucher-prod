# Generated by Django 3.1.7 on 2022-03-26 09:15

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('builder', '0005_remove_armylist_faction'),
    ]

    operations = [
        migrations.AddField(
            model_name='armylist',
            name='faction',
            field=models.CharField(default='unknow', max_length=64),
        ),
    ]
