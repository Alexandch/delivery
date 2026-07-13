                                               



from django.db import migrations, models





class Migration(migrations.Migration):



    dependencies = [

        ('delivery_app', '0017_partner'),

    ]



    operations = [

        migrations.AddField(

            model_name='order',

            name='payment_method',

            field=models.CharField(choices=[('card', 'Банковская карта'), ('cash', 'Наличные при получении')], default='cash', max_length=20),

        ),

    ]

