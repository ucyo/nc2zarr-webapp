# Generated by Django 4.0.3 on 2022-04-23 10:23

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('db', '0004_jsonworkflowjob_status'),
    ]

    operations = [
        migrations.AlterField(
            model_name='jsonworkflowjob',
            name='status',
            field=models.CharField(max_length=30, null=True),
        ),
    ]
