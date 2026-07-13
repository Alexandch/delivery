                       

from django.test import TestCase, SimpleTestCase, Client as TestClient

from django.contrib.auth.models import User

from django.urls import reverse

from django.utils import timezone

from django.core.exceptions import ValidationError

from decimal import Decimal

from datetime import date, timedelta

import re



from .models import (

    Employee, Client, ProductType, Manufacturer, Product, PickupPoint, PromoCode,

    Order, OrderItem, CartItem, CompanyInfo, Article, FAQ, Vacancy, Review

)

from .models import validate_age, validate_phone

from .payments import passes_luhn, process_demo_payment, validate_expiry





class PaymentValidationTests(SimpleTestCase):

    def test_luhn_validation(self):

        self.assertTrue(passes_luhn('4242424242424242'))

        self.assertFalse(passes_luhn('4242424242424241'))



    def test_expired_card_is_rejected(self):

        self.assertFalse(validate_expiry('01/20'))

        self.assertFalse(validate_expiry('13/99'))



    def test_demo_payment_does_not_return_card_data(self):

        result = process_demo_payment(

            card_number='4242 4242 4242 4242',

            expiry_date='12/99',

            cvv='123',

            amount=Decimal('10.00'),

        )

        self.assertTrue(result.success)

        self.assertTrue(result.payment_id.startswith('demo_'))

        self.assertNotIn('4242', result.payment_id)



class ModelTests(TestCase):

    def setUp(self):

                                        

        self.user = User.objects.create_user(username='testuser', password='testpass123')

        self.employee_user = User.objects.create_user(username='employee', password='emppass123')

        self.client_user = User.objects.create_user(username='client', password='clientpass123')



                            

        self.employee = Employee.objects.create(

            user=self.employee_user,

            date_of_birth=date(1990, 1, 1),

            position='Manager'

        )



                         

        self.test_client = Client.objects.create(

            user=self.client_user,

            phone='+375 (29) 123-45-67',

            address='Minsk, Test St. 1',

            date_of_birth=date(2000, 1, 1)

        )



                                              

        self.product_type = ProductType.objects.create(name='Fruits')

        self.manufacturer = Manufacturer.objects.create(name='Test Manufacturer', country='Belarus')



                         

        self.product = Product.objects.create(

            name='Apple',

            price=Decimal('1.99'),

            unit_of_measurement='kg',

            product_type=self.product_type,

            manufacturer=self.manufacturer,

            weight=Decimal('1.00'),

            stock=100

        )



                                  

        self.pickup_point = PickupPoint.objects.create(

            name='Minsk Pickup',

            address='Minsk, Pickup St. 1',

            working_hours='10:00-18:00'

        )



                          

        self.promocode = PromoCode.objects.create(

            code='TEST10',

            discount=Decimal('10.00'),

            valid_from=timezone.now() - timedelta(days=1),

            valid_to=timezone.now() + timedelta(days=1),

            active=True

        )

        self.promocode.applicable_products.add(self.product)



    def test_validate_age_under_18(self):

        """Тест валидатора возраста: должен отклонять пользователей младше 18 лет"""

        under_18_date = date.today() - timedelta(days=17 * 365)

        with self.assertRaises(ValidationError):

            validate_age(under_18_date)



    def test_validate_age_over_18(self):

        """Тест валидатора возраста: должен принимать пользователей старше 18 лет"""

        over_18_date = date(2000, 1, 1)

        try:

            validate_age(over_18_date)

        except ValidationError:

            self.fail("validate_age() raised ValidationError unexpectedly!")



    def test_validate_phone_correct_format(self):

        """Тест валидатора телефона: корректный формат"""

        valid_phone = '+375 (29) 123-45-67'

        try:

            validate_phone(valid_phone)

        except ValidationError:

            self.fail("validate_phone() raised ValidationError unexpectedly!")



    def test_validate_phone_incorrect_format(self):

        """Тест валидатора телефона: некорректный формат"""

        invalid_phone = '123456789'

        with self.assertRaises(ValidationError):

            validate_phone(invalid_phone)



    def test_order_total_cost_with_promocode(self):

        """Тест расчёта общей стоимости заказа с промокодом"""

        order = Order.objects.create(

            client=self.test_client,

            employee=self.employee,

            pickup_point=self.pickup_point,

            status='Pending',

            delivery_cost=Decimal('0.00'),

            delivery_method='pickup',

            promocode=self.promocode

        )

        OrderItem.objects.create(

            order=order,

            product=self.product,

            quantity=Decimal('2.00'),

            price=self.product.price

        )

                                            

                                                                            

                                

        expected_total = Decimal('3.58')

        self.assertEqual(order.total_cost, expected_total)



    def test_promocode_is_valid(self):

        """Тест проверки валидности промокода"""

        self.assertTrue(self.promocode.is_valid())



    def test_promocode_expired(self):

        """Тест просроченного промокода"""

        expired_promocode = PromoCode.objects.create(

            code='EXPIRED',

            discount=Decimal('5.00'),

            valid_from=timezone.now() - timedelta(days=10),

            valid_to=timezone.now() - timedelta(days=1),

            active=True

        )

        self.assertFalse(expired_promocode.is_valid())



    def test_promocode_only_discounts_applicable_products(self):

        other_product = Product.objects.create(

            name='Bread', price=Decimal('10.00'), unit_of_measurement='pieces',

            product_type=self.product_type, stock=10,

        )

        order = Order.objects.create(client=self.test_client, promocode=self.promocode)

        OrderItem.objects.create(order=order, product=self.product, quantity=2, price=self.product.price)

        OrderItem.objects.create(order=order, product=other_product, quantity=1, price=other_product.price)

        self.assertEqual(order.total_cost, Decimal('13.58'))



class ViewTests(TestCase):

    def setUp(self):

        self.test_client = TestClient()

                               

        self.superuser = User.objects.create_superuser(username='admin', password='adminpass123')

        self.employee_user = User.objects.create_user(username='employee', password='emppass123')

        self.client_user = User.objects.create_user(username='client', password='clientpass123')



                            

        self.employee = Employee.objects.create(

            user=self.employee_user,

            date_of_birth=date(1990, 1, 1),

            position='Manager'

        )



                         

        self.test_client_model = Client.objects.create(

            user=self.client_user,

            phone='+375 (29) 123-45-67',

            address='Minsk, Test St. 1',

            date_of_birth=date(2000, 1, 1)

        )



                                        

        self.product_type = ProductType.objects.create(name='Fruits')

        self.product = Product.objects.create(

            name='Apple',

            price=Decimal('1.99'),

            unit_of_measurement='kg',

            product_type=self.product_type,

            stock=100

        )



                                  

        self.pickup_point = PickupPoint.objects.create(

            name='Minsk Pickup',

            address='Minsk, Pickup St. 1',

            working_hours='10:00-18:00'

        )



                       

        self.order = Order.objects.create(

            client=self.test_client_model,

            employee=self.employee,

            pickup_point=self.pickup_point,

            status='Pending',

            delivery_cost=Decimal('0.00'),

            delivery_method='pickup'

        )

        OrderItem.objects.create(

            order=self.order,

            product=self.product,

            quantity=Decimal('2.00'),

            price=self.product.price

        )



    def test_employee_panel_superuser_access(self):

        """Тест доступа суперпользователя к панели сотрудника"""

        self.test_client.login(username='admin', password='adminpass123')

                                                        

        Employee.objects.create(

            user=self.superuser,

            date_of_birth=date(1990, 1, 1),

            position='Admin'

        )

        response = self.test_client.get(reverse('delivery_app:employee_panel'))

        self.assertEqual(response.status_code, 200)

                                                                   

        self.assertGreaterEqual(len(response.context['orders']), 1)



    def test_employee_panel_employee_access(self):

        """Тест доступа обычного сотрудника к панели сотрудника"""

        self.test_client.login(username='employee', password='emppass123')

        response = self.test_client.get(reverse('delivery_app:employee_panel'))

        self.assertEqual(response.status_code, 200)

                                                           

        self.assertEqual(len(response.context['orders']), 1)



    def test_employee_panel_no_access(self):

        """Тест доступа клиента к панели сотрудника"""

        self.test_client.login(username='client', password='clientpass123')

        response = self.test_client.get(reverse('delivery_app:employee_panel'))

        self.assertRedirects(response, reverse('delivery_app:home'))



    def test_order_list_view_client(self):

        """Тест доступа клиента к списку заказов"""

        self.test_client.login(username='client', password='clientpass123')

        response = self.test_client.get(reverse('delivery_app:order_list'))

        self.assertEqual(response.status_code, 200)

        self.assertEqual(len(response.context['orders']), 1)



    def test_order_detail_view_employee(self):

        """Тест доступа сотрудника к деталям заказа"""

        self.test_client.login(username='employee', password='emppass123')

        response = self.test_client.get(reverse('delivery_app:order_detail', args=[self.order.id]))

        self.assertEqual(response.status_code, 200)

        self.assertEqual(response.context['order'], self.order)



    def test_login_view_redirect(self):

        """Тест перенаправления неавторизованного пользователя на страницу логина"""

        response = self.test_client.get(reverse('delivery_app:add_to_cart', args=[self.product.id]), follow=True)

        self.assertRedirects(response, f"{reverse('login')}?next={reverse('delivery_app:add_to_cart', args=[self.product.id])}")



    def test_superuser_can_view_order_without_employee_profile(self):

        self.test_client.login(username='admin', password='adminpass123')

        response = self.test_client.get(reverse('delivery_app:order_detail', args=[self.order.id]))

        self.assertEqual(response.status_code, 200)



    def test_employee_management_requires_staff(self):

        self.test_client.login(username='client', password='clientpass123')

        response = self.test_client.get(reverse('delivery_app:employee_management'))

        self.assertEqual(response.status_code, 302)

        self.assertIn('/admin/login/', response.url)



    def test_valid_card_payment_marks_order_paid(self):

        self.order.payment_method = 'card'

        self.order.save(update_fields=['payment_method'])

        self.test_client.login(username='client', password='clientpass123')

        response = self.test_client.post(

            reverse('delivery_app:payment_page', args=[self.order.id]),

            {'card_number': '4242 4242 4242 4242', 'expiry_date': '12/99', 'cvv': '123'},

        )

        self.assertRedirects(response, reverse('delivery_app:order_detail', args=[self.order.id]))

        self.order.refresh_from_db()

        self.assertEqual(self.order.payment_status, 'paid')

        self.assertTrue(self.order.payment_id.startswith('demo_'))



    def test_invalid_card_payment_can_be_retried(self):

        self.order.payment_method = 'card'

        self.order.save(update_fields=['payment_method'])

        self.test_client.login(username='client', password='clientpass123')

        response = self.test_client.post(

            reverse('delivery_app:payment_page', args=[self.order.id]),

            {'card_number': '4242 4242 4242 4241', 'expiry_date': '12/99', 'cvv': '123'},

        )

        self.assertEqual(response.status_code, 200)

        self.order.refresh_from_db()

        self.assertEqual(self.order.payment_status, 'failed')



    def test_superuser_admin_pages_render(self):

        self.test_client.login(username='admin', password='adminpass123')

        self.assertEqual(self.test_client.get(reverse('delivery_app:employee_products')).status_code, 200)

        self.assertEqual(self.test_client.get(reverse('delivery_app:employee_management')).status_code, 200)



    def test_checkout_creates_order_with_original_prices(self):

        CartItem.objects.create(user=self.client_user, product=self.product, quantity=2)

        self.test_client.login(username='client', password='clientpass123')

        response = self.test_client.post(reverse('delivery_app:checkout'), {

            'delivery_method': 'pickup',

            'pickup_point': self.pickup_point.id,

            'payment_method': 'cash',

        })

        created_order = Order.objects.filter(client=self.test_client_model).latest('id')

        self.assertRedirects(response, reverse('delivery_app:order_detail', args=[created_order.id]))

        self.assertEqual(created_order.orderitem_set.get().price, self.product.price)

        self.product.refresh_from_db()

        self.assertEqual(self.product.stock, 98)

        self.assertFalse(CartItem.objects.filter(user=self.client_user).exists())



class CartTests(TestCase):

    def setUp(self):

        self.test_client = TestClient()

        self.user = User.objects.create_user(username='testuser', password='testpass123')

        self.product_type = ProductType.objects.create(name='Fruits')

        self.product = Product.objects.create(

            name='Apple',

            price=Decimal('1.99'),

            unit_of_measurement='kg',

            product_type=self.product_type,

            stock=100

        )



    def test_add_to_cart(self):

        """Тест добавления товара в корзину"""

        self.test_client.login(username='testuser', password='testpass123')

        response = self.test_client.post(reverse('delivery_app:add_to_cart', args=[self.product.id]), {'quantity': 2})

        self.assertEqual(response.status_code, 302)

        cart_item = CartItem.objects.get(user=self.user, product=self.product)

        self.assertEqual(cart_item.quantity, 2)

        self.assertEqual(cart_item.total_price, Decimal('3.98'))

