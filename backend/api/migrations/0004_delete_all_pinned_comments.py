from django.db import migrations

def delete_all_pinned_comments(apps, schema_editor):
    Comment = apps.get_model('api', 'Comment')
    Comment.objects.filter(is_pinned=True).delete()

def reverse_delete_all_pinned_comments(apps, schema_editor):
    pass

class Migration(migrations.Migration):

    dependencies = [
        ('api', '0003_delete_pinned_comment'),
    ]

    operations = [
        migrations.RunPython(delete_all_pinned_comments, reverse_delete_all_pinned_comments),
    ]
