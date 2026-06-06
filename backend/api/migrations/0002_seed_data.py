from django.db import migrations

def seed_data(apps, schema_editor):
    Project = apps.get_model('api', 'Project')
    Certificate = apps.get_model('api', 'Certificate')
    TechStack = apps.get_model('api', 'TechStack')
    Comment = apps.get_model('api', 'Comment')

    # Seed Projects
    projects_data = [
        {
            'id': 1,
            'title': 'RAG Tabanlı Tarım & Hayvancılık Chatbotu',
            'description': 'Tarım ve hayvancılık sektörü için Retrieval-Augmented Generation (RAG) teknolojisi kullanılarak geliştirilmiş akıllı chatbot. Çiftçilere ve hayvancılara anlık bilgi desteği sağlar.',
            'image_url': 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=800&q=80',
            'live_url': 'https://github.com/Emirhan-Arikan',
            'order': 1
        },
        {
            'id': 2,
            'title': 'XAI ile Deprem Büyüklüğü Sınıflandırması',
            'description': 'Explainable AI (XAI) teknikleri kullanılarak deprem büyüklüklerinin sınıflandırılması ve tahmin sonuçlarının açıklanabilir hale getirilmesi projesi.',
            'image_url': 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&q=80',
            'live_url': 'https://github.com/Emirhan-Arikan',
            'order': 2
        },
        {
            'id': 3,
            'title': 'Machine Learning Portfolio',
            'description': 'PyTorch ve Scikit-learn kullanılarak geliştirilmiş çeşitli makine öğrenmesi projeleri. Veri analizi, model eğitimi ve tahmin sistemleri içerir.',
            'image_url': 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=800&q=80',
            'live_url': 'https://github.com/Emirhan-Arikan',
            'order': 3
        }
    ]
    for p in projects_data:
        Project.objects.update_or_create(
            id=p['id'],
            defaults={
                'title': p['title'],
                'description': p['description'],
                'image_url': p['image_url'],
                'live_url': p['live_url'],
                'order': p['order']
            }
        )

    # Seed Certificates
    certificates_data = [
        {
            'id': 1,
            'title': 'Python Programming Certificate',
            'image_url': 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&q=80',
            'order': 1
        },
        {
            'id': 2,
            'title': 'Machine Learning Specialization',
            'image_url': 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=800&q=80',
            'order': 2
        },
        {
            'id': 3,
            'title': 'Deep Learning with PyTorch',
            'image_url': 'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?w=800&q=80',
            'order': 3
        }
    ]
    for c in certificates_data:
        Certificate.objects.update_or_create(
            id=c['id'],
            defaults={
                'title': c['title'],
                'image_url': c['image_url'],
                'order': c['order']
            }
        )

    # Seed TechStack
    tech_stacks_data = [
        {'id': 1, 'name': 'Python', 'logo_url': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg', 'order': 1},
        {'id': 2, 'name': 'C', 'logo_url': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/c/c-original.svg', 'order': 2},
        {'id': 3, 'name': 'C++', 'logo_url': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/cplusplus/cplusplus-original.svg', 'order': 3},
        {'id': 4, 'name': 'Django', 'logo_url': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/django/django-plain.svg', 'order': 4},
        {'id': 5, 'name': 'PyTorch', 'logo_url': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/pytorch/pytorch-original.svg', 'order': 5},
        {'id': 6, 'name': 'Scikit-learn', 'logo_url': 'https://upload.wikimedia.org/wikipedia/commons/0/05/Scikit_learn_logo_small.svg', 'order': 6},
        {'id': 7, 'name': 'TensorFlow', 'logo_url': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tensorflow/tensorflow-original.svg', 'order': 7},
        {'id': 8, 'name': 'NumPy', 'logo_url': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/numpy/numpy-original.svg', 'order': 8},
        {'id': 9, 'name': 'Pandas', 'logo_url': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/pandas/pandas-original.svg', 'order': 9},
        {'id': 10, 'name': 'Git', 'logo_url': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg', 'order': 10},
    ]
    for t in tech_stacks_data:
        TechStack.objects.update_or_create(
            id=t['id'],
            defaults={
                'name': t['name'],
                'logo_url': t['logo_url'],
                'order': t['order']
            }
        )



    # Reset sequences for PostgreSQL
    from django.db import connection
    if connection.vendor == 'postgresql':
        api_app = apps.get_app_config('api')
        class DummyStyle:
            def __getattr__(self, name):
                return lambda x: x
        style = DummyStyle()
        sequence_sql = connection.ops.sequence_reset_sql(style, api_app.models.values())
        with connection.cursor() as cursor:
            for sql in sequence_sql:
                cursor.execute(sql)

def unseed_data(apps, schema_editor):
    pass

class Migration(migrations.Migration):

    dependencies = [
        ('api', '0001_initial'),
    ]

    operations = [
        migrations.RunPython(seed_data, unseed_data),
    ]
