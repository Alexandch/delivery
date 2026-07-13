                                               



from django.db import migrations, models





class Migration(migrations.Migration):



    dependencies = [

        ('delivery_app', '0009_alter_orderitem_quantity'),

    ]



    operations = [

        migrations.AddField(

            model_name='product',

            name='description',

            field=models.TextField(blank=True),

        ),

    ]

