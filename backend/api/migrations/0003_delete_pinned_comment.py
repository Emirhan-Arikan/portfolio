from django.db import migrations

def delete_pinned_comment(apps, schema_editor):
    Comment = apps.get_model('api', 'Comment')
    Comment.objects.filter(name='John Doe', is_pinned=True).delete()

def reverse_delete_pinned_comment(apps, schema_editor):
    pass

class Migration(migrations.Migration):

    dependencies = [
        ('api', '0002_seed_data'),
    ]

    operations = [
        migrations.RunPython(delete_pinned_comment, reverse_delete_pinned_comment),
    ]
