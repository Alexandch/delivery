from django.db import migrations


def normalize_employee_positions(apps, schema_editor):
    Employee = apps.get_model('delivery_app', 'Employee')
    Employee.objects.filter(position__iexact='order manager').update(
        position='Менеджер заказов'
    )


class Migration(migrations.Migration):
    dependencies = [
        ('delivery_app', '0023_employee_email_employee_first_name_and_more'),
    ]

    operations = [
        migrations.RunPython(
            normalize_employee_positions,
            migrations.RunPython.noop,
        ),
    ]
