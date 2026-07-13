                                               



from django.db import migrations, models





class Migration(migrations.Migration):



    dependencies = [

        ('delivery_app', '0016_employee_phone'),

    ]



    operations = [

        migrations.CreateModel(

            name='Partner',

            fields=[

                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),

                ('name', models.CharField(max_length=100)),

                ('logo', models.ImageField(blank=True, null=True, upload_to='partners/')),

                ('website', models.URLField()),

                ('description', models.TextField(blank=True)),

            ],

        ),

    ]

