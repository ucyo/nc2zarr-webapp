# Generated by Django 4.0.4 on 2022-06-27 16:35

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('db', '0016_rename_uniquetimes_completeconversion_unique_times'),
    ]

    operations = [
        migrations.AddField(
            model_name='completeconversion',
            name='remove_existing_folder',
            field=models.BooleanField(default=False),
        ),
    ]
