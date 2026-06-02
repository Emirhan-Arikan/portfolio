from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from api.models import Project, Certificate, TechStack, Comment
from blog.models import BlogPost

class Command(BaseCommand):
    help = 'Seeds initial portfolio projects, certificates, tech stacks, blog posts, and creates a superuser.'

    def handle(self, *args, **options):
        self.stdout.write('Seeding database...')

        # 1. Superuser
        if not User.objects.filter(is_superuser=True).exists():
            User.objects.create_superuser('admin', 'admin@example.com', 'adminpassword123')
            self.stdout.write(self.style.SUCCESS('Superuser "admin" with password "adminpassword123" created successfully.'))
        else:
            self.stdout.write('Superuser already exists.')

        # 2. Projects
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

        for p_data in projects_data:
            Project.objects.update_or_create(
                id=p_data['id'],
                defaults={
                    'title': p_data['title'],
                    'description': p_data['description'],
                    'image_url': p_data['image_url'],
                    'live_url': p_data['live_url'],
                    'order': p_data['order']
                }
            )
        self.stdout.write(self.style.SUCCESS(f'Seeded {len(projects_data)} projects.'))

        # 3. Certificates
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

        for c_data in certificates_data:
            Certificate.objects.update_or_create(
                id=c_data['id'],
                defaults={
                    'title': c_data['title'],
                    'image_url': c_data['image_url'],
                    'order': c_data['order']
                }
            )
        self.stdout.write(self.style.SUCCESS(f'Seeded {len(certificates_data)} certificates.'))

        # 4. Tech Stack
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

        for t_data in tech_stacks_data:
            TechStack.objects.update_or_create(
                id=t_data['id'],
                defaults={
                    'name': t_data['name'],
                    'logo_url': t_data['logo_url'],
                    'order': t_data['order']
                }
            )
        self.stdout.write(self.style.SUCCESS(f'Seeded {len(tech_stacks_data)} tech stacks.'))

        # 5. Seed default blog posts
        blogs_data = [
            {
                'id': 1,
                'title': 'Yapay Zeka ve Akıllı Tarım Uygulamaları',
                'summary': 'RAG chatbotları ve veri analitiği ile modern tarımda verimliliği artırma yolları. Tarımsal üretim süreçlerinin optimize edilmesi.',
                'content': 'Modern tarımda verimlilik, veri analitiği ve yapay zeka entegrasyonu ile yepyeni bir seviyeye ulaşıyor. Özellikle RAG (Retrieval-Augmented Generation) tabanlı tarım chatbotları, çiftçilerin ekim, sulama, gübreleme ve hastalık teşhisi gibi kritik konularda anında bilimsel verilere dayalı yanıtlar almasını sağlıyor. Toprak sensörlerinden gelen nem, pH ve sıcaklık verileri derin öğrenme modelleriyle analiz edilerek hasat dönemleri en doğru şekilde tahmin edilebiliyor. Akıllı tarım teknolojileri, su ve gübre tasarrufu sağlarken rekolteyi maksimum seviyeye çıkarmaya yardımcı oluyor.',
                'image_url': 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=800&q=80',
                'tags': 'teknoloji,tarim',
                'slug': 'yapay-zeka-ve-akilli-tarim-uygulamalari'
            },
            {
                'id': 2,
                'title': 'WiFi Sinyalleri ile Duvar Arkasını Görmek',
                'summary': 'WiFi sinyallerinin yansıması ve faz değişimlerini analiz ederek duvar arkasındaki nesnelerin ve insanların 3 boyutlu görüntülerini elde etme teknolojisi.',
                'content': 'WiFi sinyalleri sadece internete bağlanmamızı sağlamakla kalmıyor, aynı zamanda ortamdaki fiziksel nesnelerin konumunu saptamak için de kullanılabiliyor. MIMO (Multiple-Input Multiple-Output) anten teknolojisi ve gelişmiş sinyal işleme algoritmaları sayesinde, duvarın arkasından sızan WiFi dalgalarının faz değişimleri ve genlik yansımaları ölçülüyor. Bu yansımalar derin öğrenme ve yapay sinir ağları ile eğitilmiş bilgisayarlı görü modellerine beslenerek, duvarın arkasında hareket eden insanların 3 boyutlu duruş iskeletleri (pose estimation) elde edilebiliyor. Bu teknoloji, arama-kurtarma çalışmalarında enkaz altındaki kişilerin yerini saptamaktan ev içi güvenlik ve sağlık izleme sistemlerine kadar geniş bir yelpazede devrim yaratma potansiyeline sahip.',
                'image_url': 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800&q=80',
                'tags': 'teknoloji,wifi',
                'slug': 'wifi-sinyalleri-ile-duvar-arkasini-gormek'
            },
            {
                'id': 3,
                'title': 'Makine Öğrenmesi Modellerinde Açıklanabilirlik (XAI)',
                'summary': 'Yapay zeka modellerinin karar alma süreçlerini anlamak ve tahminlerini şeffaf hale getirmek için kullanılan XAI yöntemleri.',
                'content': 'Derin öğrenme modelleri genellikle birer \'kara kutu\' (black box) olarak çalışır; girdi girilir ve bir tahmin üretilir, ancak modelin neden bu kararı verdiği anlaşılması zordur. Açıklanabilir Yapay Zeka (XAI - Explainable AI) teknikleri, bu karar alma süreçlerini görünür kılarak modellerin güvenilirliğini artırmayı hedefler. SHAP (SHapley Additive exPlanations) ve LIME (Local Interpretable Model-agnostic Explanations) gibi yöntemler, her bir girdinin tahmin üzerindeki ağırlığını matematiksel olarak hesaplar. Bu şeffaflık, tıp teşhis sistemleri, finansal kredi onayları ve deprem büyüklüğü sınıflandırması gibi kritik alanlarda yapay zekanın güvenle kullanılabilmesi için hayati önem taşır.',
                'image_url': 'https://images.unsplash.com/photo-1507146426996-ef05306b995a?w=800&q=80',
                'tags': 'teknoloji,makine-ogrenmesi',
                'slug': 'makine-ogrenmesinde-aciklanabilirlik'
            }
        ]

        for b_data in blogs_data:
            BlogPost.objects.update_or_create(
                id=b_data['id'],
                defaults={
                    'title': b_data['title'],
                    'summary': b_data['summary'],
                    'content': b_data['content'],
                    'image_url': b_data['image_url'],
                    'tags': b_data['tags'],
                    'slug': b_data['slug']
                }
            )
        self.stdout.write(self.style.SUCCESS(f'Seeded {len(blogs_data)} blog posts.'))

        # 6. Seed a default comment if empty
        if not Comment.objects.exists():
            Comment.objects.create(
                name='John Doe',
                comment='Great portfolio! Love the design and animations.',
                likes=5,
                is_pinned=True
            )
            self.stdout.write(self.style.SUCCESS('Seeded default comment.'))

        self.stdout.write(self.style.SUCCESS('Database seeding finished successfully!'))
