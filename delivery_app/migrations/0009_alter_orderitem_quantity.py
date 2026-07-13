                                               



from django.db import migrations, models





class Migration(migrations.Migration):



    dependencies = [

        ('delivery_app', '0008_article_companyinfo_faq_vacancy_employee_photo_and_more'),

    ]



    operations = [

        migrations.AlterField(

            model_name='orderitem',

            name='quantity',

            field=models.DecimalField(decimal_places=2, max_digits=10),

        ),

    ]

