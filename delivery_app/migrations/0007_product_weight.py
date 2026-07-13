                                               



from decimal import Decimal

from django.db import migrations, models





class Migration(migrations.Migration):



    dependencies = [

        ('delivery_app', '0006_order_delivery_address'),

    ]



    operations = [

        migrations.AddField(

            model_name='product',

            name='weight',

            field=models.DecimalField(decimal_places=2, default=Decimal('1.00'), help_text='Вес в кг', max_digits=10),

        ),

    ]

