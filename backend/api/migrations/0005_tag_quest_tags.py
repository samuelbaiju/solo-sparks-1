# Generated by Django 5.2.3 on 2025-06-22 09:09

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0004_remove_reflection_audio_url_and_more'),
    ]

    operations = [
        migrations.CreateModel(
            name='Tag',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=50, unique=True)),
            ],
        ),
        migrations.AddField(
            model_name='quest',
            name='tags',
            field=models.ManyToManyField(blank=True, to='api.tag'),
        ),
    ]
