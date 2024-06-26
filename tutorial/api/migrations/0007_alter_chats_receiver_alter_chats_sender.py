# Generated by Django 5.0.3 on 2024-03-27 08:07

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0006_alter_chats_receiver_alter_chats_sender'),
    ]

    operations = [
        migrations.AlterField(
            model_name='chats',
            name='receiver',
            field=models.ForeignKey(on_delete=django.db.models.deletion.DO_NOTHING, related_name='msgReceiver', to=settings.AUTH_USER_MODEL, to_field='username'),
        ),
        migrations.AlterField(
            model_name='chats',
            name='sender',
            field=models.ForeignKey(on_delete=django.db.models.deletion.DO_NOTHING, related_name='msgSender', to=settings.AUTH_USER_MODEL, to_field='username'),
        ),
    ]
