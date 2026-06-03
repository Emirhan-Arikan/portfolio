from django.db import migrations

def seed_blog_data(apps, schema_editor):
    BlogPost = apps.get_model('blog', 'BlogPost')

    # Seed Blogs
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
    for b in blogs_data:
        BlogPost.objects.update_or_create(
            id=b['id'],
            defaults={
                'title': b['title'],
                'summary': b['summary'],
                'content': b['content'],
                'image_url': b['image_url'],
                'tags': b['tags'],
                'slug': b['slug']
            }
        )

    # Reset sequences for PostgreSQL
    from django.db import connection
    if connection.vendor == 'postgresql':
        blog_app = apps.get_app_config('blog')
        class DummyStyle:
            def __getattr__(self, name):
                return lambda x: x
        style = DummyStyle()
        sequence_sql = connection.ops.sequence_reset_sql(style, blog_app.models.values())
        with connection.cursor() as cursor:
            for sql in sequence_sql:
                cursor.execute(sql)

def unseed_blog_data(apps, schema_editor):
    pass

class Migration(migrations.Migration):

    dependencies = [
        ('blog', '0001_initial'),
    ]

    operations = [
        migrations.RunPython(seed_blog_data, unseed_blog_data),
    ]
