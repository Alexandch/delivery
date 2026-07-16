from datetime import date

import json

from decimal import Decimal, InvalidOperation

import logging

import statistics

from django.db import transaction

from django.db.models import Sum, Count, F, ExpressionWrapper, DecimalField

from django.http import JsonResponse

from django.views.generic import ListView, DetailView

from django.contrib.auth.mixins import LoginRequiredMixin

from django.core.exceptions import PermissionDenied, ValidationError

from django.utils import timezone

from django.contrib.auth import logout

from django.contrib.auth import login

from django.shortcuts import redirect

from django.db.models import Q

import calendar

from django.contrib.auth.decorators import login_required

from django.contrib.admin.views.decorators import staff_member_required

from django.shortcuts import render, redirect, get_object_or_404

from django.views.decorators.http import require_GET, require_POST

from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger

from django.contrib import messages

import requests

from .models import FAQ, Article, Banner, CompanyInfo, Manufacturer, Partner, PickupPoint, PrivacyPolicy, Review, Vacancy, CartItem

from delivery_app.forms import ClientForm, CustomUserCreationForm, EmployeeForm, ReviewForm

from .models import Employee, Product, Order, OrderItem, Client, ProductType, PromoCode

from django.contrib.auth.forms import AuthenticationForm

from django.core.mail import send_mail

from django.core.cache import cache

from django.conf import settings

from .payments import card_brand, normalize_card_number, process_demo_payment



from delivery_app import models



                                

class ProductListView(ListView):

    model = Product

    template_name = 'delivery_app/product_list.html'

    context_object_name = 'products'

    

    def get_paginate_by(self, queryset):

        """Динамическое определение количества элементов на странице"""

        per_page = self.request.GET.get('per_page', 3)

        try:

            per_page = int(per_page)

            if per_page in [3, 6, 9, 12]:

                return per_page

        except (ValueError, TypeError):

            pass

        return 3



    def get_queryset(self):

        queryset = super().get_queryset()

        

        search_query = self.request.GET.get('search', '').strip()

        type_filter = self.request.GET.get('type', '').strip()

        sort_by = self.request.GET.get('sort', 'name').strip()

        

        if type_filter:

            queryset = queryset.filter(product_type__name=type_filter)

        

        if search_query:

            queryset = queryset.filter(

                Q(name__icontains=search_query) | 

                Q(description__icontains=search_query)

            )

        

        if sort_by in ['name', '-name', 'price', '-price', 'stock']:

            queryset = queryset.order_by(sort_by)

        else:

            queryset = queryset.order_by('name')

        

        return queryset



    def get_context_data(self, **kwargs):

        context = super().get_context_data(**kwargs)

        context.update({

            'product_types': ProductType.objects.all(),

            'current_date': timezone.now().strftime('%d/%m/%Y'),

            'timezone': 'Europe/Minsk',

            'calendar': calendar.monthcalendar(timezone.now().year, timezone.now().month),

            'search_query': self.request.GET.get('search', ''),

            'type_filter': self.request.GET.get('type', ''),

            'sort_by': self.request.GET.get('sort', 'name'),

            'per_page': self.get_paginate_by(self.get_queryset()),

        })

        return context



                                                             

class OrderDetailView(LoginRequiredMixin, DetailView):

    model = Order

    template_name = 'delivery_app/order_detail.html'

    context_object_name = 'order'



    def get_queryset(self):

        user = self.request.user

        if user.is_superuser:

            return Order.objects.all()

        if hasattr(user, 'client_profile'):

            return Order.objects.filter(client=user.client_profile)

        elif hasattr(user, 'employee_profile'):

            return Order.objects.filter(employee=user.employee_profile)

        return Order.objects.none()



    def dispatch(self, request, *args, **kwargs):

        try:

            response = super().dispatch(request, *args, **kwargs)

            order = self.get_object()

            user = request.user

            

                                                                                                      

            if user.is_superuser:

                return response

            if hasattr(user, 'client_profile') and order.client == user.client_profile:

                return response

            if hasattr(user, 'employee_profile') and order.employee == user.employee_profile:

                return response

            

            raise PermissionDenied("У вас нет прав для просмотра этого заказа.")

        except PermissionDenied:

                                         

            logger.warning(f"Permission denied for user {request.user} to access order {kwargs.get('pk')}")

            raise

        except Exception as e:

            logger.error(f"Error in OrderDetailView: {e}")

            raise



    def get_context_data(self, **kwargs):

        context = super().get_context_data(**kwargs)

        context['current_date'] = timezone.now().strftime('%d/%m/%Y')

        context['timezone'] = 'Europe/Minsk'

        context['calendar'] = calendar.monthcalendar(timezone.now().year, timezone.now().month)

        return context



    def handle_no_permission(self):

        raise PermissionDenied("У вас нет прав для просмотра этого заказа.")



class OrderListView(LoginRequiredMixin, ListView):

    model = Order

    template_name = 'delivery_app/order_list.html'

    context_object_name = 'orders'



    def get_queryset(self):

        user = self.request.user

        if user.is_superuser:

            return Order.objects.all()                                      

        try:

            employee = Employee.objects.get(user=user)

            return Order.objects.filter(employee=employee)                               

        except Employee.DoesNotExist:

            try:

                client = Client.objects.get(user=user)

                return Order.objects.filter(client=client)                            

            except Client.DoesNotExist:

                return Order.objects.none()



    def get_context_data(self, **kwargs):

        context = super().get_context_data(**kwargs)

        context['current_date'] = timezone.now().strftime('%d/%m/%Y')

        context['timezone'] = 'Europe/Minsk'

        context['calendar'] = calendar.monthcalendar(timezone.now().year, timezone.now().month)

        return context

    



def home_view(request):

    latest_order = Order.objects.order_by('-date_ordered').first()

    context = {

        'latest_order': latest_order,

        'current_date': timezone.now().strftime('%d/%m/%Y'),

        'timezone': 'Europe/Minsk',

    }

    return render(request, 'delivery_app/home.html', context)



def custom_logout_view(request):

    logout(request)

    return redirect('home')                                          



def login_view(request):

    if request.method == 'POST':

        form = AuthenticationForm(request, data=request.POST)

        if form.is_valid():

            user = form.get_user()

            login(request, user)

            return redirect('delivery_app:home')

    else:

        form = AuthenticationForm()

    context = {

        'form': form,

        'current_date': timezone.now().strftime('%d/%m/%Y'),

        'timezone': 'Europe/Minsk',

    }

    return render(request, 'delivery_app/login.html', context)



def logout_view(request):

    if request.method == 'POST':

        logout(request)

        return redirect('delivery_app:home')

    return redirect('delivery_app:home')



@login_required

def create_order(request):

                                                          

    try:

        client = Client.objects.get(user=request.user)

    except Client.DoesNotExist:

        messages.error(request, "Клиентский профиль не найден. Обратитесь к администратору.")

        return redirect('delivery_app:home')



    products = Product.objects.all()                                   



    if request.method == 'POST':

                             

        order = Order.objects.create(client=client, status='Pending')



                                                         

        for product in products:

            quantity = request.POST.get(f'quantity_{product.id}', '0')

            try:

                quantity = float(quantity)

            except ValueError:

                quantity = 0



            if quantity > 0:

                                        

                OrderItem.objects.create(

                    order=order,

                    product=product,

                    quantity=quantity,

                    price=product.price                                              

                )



        if order.orderitem_set.exists():

            messages.success(request, "Заказ успешно создан!")

            return redirect('delivery_app:order_detail', pk=order.id)

        else:

            order.delete()                        

            messages.error(request, "Вы не выбрали ни одного товара.")

            return redirect('delivery_app:create_order')



                                                                                                             

    context = {

        'products': products,

        'current_date': timezone.now().strftime('%d/%m/%Y'),

        'timezone': 'Europe/Minsk',

        'calendar': calendar.monthcalendar(timezone.now().year, timezone.now().month),

    }

    return render(request, 'delivery_app/create_order.html', context)



@login_required

def edit_order(request, pk):

    order = get_object_or_404(Order, pk=pk)

                      

    user = request.user

    if not (user.is_superuser or (hasattr(user, 'employee') and order.employee == user.employee)):

        messages.error(request, "У вас нет прав для редактирования этого заказа.")

        return redirect('delivery_app:order_detail', pk=pk)



    products = Product.objects.all()



    if request.method == 'POST':

                          

        status = request.POST.get('status')

        if status in dict(Order.STATUS_CHOICES).keys():

            order.status = status

            order.save()



                                   

        order.orderitem_set.all().delete()                           

        for product in products:

            quantity = request.POST.get(f'quantity_{product.id}', '0')

            try:

                quantity = float(quantity)

            except ValueError:

                quantity = 0



            if quantity > 0:

                OrderItem.objects.create(

                    order=order,

                    product=product,

                    quantity=quantity,

                    price=product.price

                )



        messages.success(request, "Заказ успешно обновлен!")

        return redirect('delivery_app:order_detail', pk=pk)



    context = {

        'order': order,

        'products': products,

        'current_date': timezone.now().strftime('%d/%m/%Y'),

        'timezone': 'Europe/Minsk',

        'calendar': calendar.monthcalendar(timezone.now().year, timezone.now().month),

    }

    return render(request, 'delivery_app/edit_order.html', context)



@login_required

def add_to_cart(request, product_id):

    product = get_object_or_404(Product, id=product_id)

    if not request.user.is_authenticated:

        messages.error(request, "Пожалуйста, войдите, чтобы добавить товар в корзину.")

        return redirect('delivery_app:login')



    quantity = int(request.POST.get('quantity', 1))                                                

    if quantity < 1:

        messages.error(request, "Количество должно быть больше 0.")

        return redirect('delivery_app:product_list')



    cart_item, created = CartItem.objects.get_or_create(user=request.user, product=product)

    if created:

        cart_item.quantity = quantity

    else:

        cart_item.quantity += quantity

    cart_item.save()

    messages.success(request, f"{product.name} добавлен в корзину.")

    return redirect('delivery_app:cart')



@login_required

def cart(request):

    cart_items = CartItem.objects.filter(user=request.user)

    total_price = sum(item.total_price for item in cart_items)



    current_date = timezone.now()

    year = current_date.year

    month = current_date.month

    calendar_data = calendar.monthcalendar(year, month)



    context = {

        'cart_items': cart_items,

        'total_price': total_price,

        'current_date': current_date,

        'timezone': timezone.get_current_timezone_name(),

        'calendar': calendar_data,

    }

    return render(request, 'delivery_app/cart.html', context)



@login_required

def update_cart(request):

    if request.method == 'POST':

        cart_items = CartItem.objects.filter(user=request.user)

        for item in cart_items:

            quantity_key = f'quantity_{item.id}'

            if quantity_key in request.POST:

                try:

                    new_quantity = int(request.POST[quantity_key])

                    if new_quantity < 1:

                        messages.error(request, f"Количество для {item.product.name} должно быть больше 0.")

                        continue

                    item.quantity = new_quantity

                    item.save()

                except ValueError:

                    messages.error(request, f"Некорректное количество для {item.product.name}.")

        messages.success(request, "Корзина обновлена.")

    return redirect('delivery_app:cart')



@login_required

def remove_from_cart(request, item_id):

    item = get_object_or_404(CartItem, id=item_id, user=request.user)

    item.delete()

    messages.success(request, "Товар удалён из корзины.")

    return redirect('delivery_app:cart')



@login_required

def checkout(request):

    try:

        client = Client.objects.get(user=request.user)

    except Client.DoesNotExist:

        logger.error(f"Клиентский профиль для {request.user.username} не найден")

        messages.error(request, "Клиентский профиль не найден. Обратитесь к администратору.")

        return redirect('delivery_app:home')



    cart_items = CartItem.objects.filter(user=request.user)

    if not cart_items.exists():

        logger.warning(f"Корзина пуста для {request.user.username}")

        messages.error(request, "Корзина пуста.")

        return redirect('delivery_app:cart')



    promo_code = None

    selected_delivery_method = request.POST.get('delivery_method', 'pickup') if request.method == 'POST' else 'pickup'

    selected_pickup_point = request.POST.get('pickup_point', '') if request.method == 'POST' else ''

    delivery_address = request.POST.get('delivery_address', '') if request.method == 'POST' else client.address if hasattr(client, 'address') else ''

    selected_payment_method = request.POST.get('payment_method', 'cash') if request.method == 'POST' else 'cash'

    promo_code_input = request.POST.get('promo_code', '').strip() if request.method == 'POST' else ''



    if request.method == 'POST':

        pickup_point_id = request.POST.get('pickup_point')

        delivery_method = request.POST.get('delivery_method', 'pickup')

        delivery_address = request.POST.get('delivery_address', '').strip()

        payment_method = request.POST.get('payment_method', 'cash')

        pickup_point = None



        if delivery_method not in dict(Order.DELIVERY_METHODS):

            messages.error(request, 'Выбран неизвестный способ доставки.')

            return redirect('delivery_app:checkout')

        if payment_method not in dict(Order.PAYMENT_METHODS):

            messages.error(request, 'Выбран неизвестный способ оплаты.')

            return redirect('delivery_app:checkout')

        if delivery_method == 'pickup' and pickup_point_id:

            pickup_point = get_object_or_404(PickupPoint, id=pickup_point_id)

        elif delivery_method == 'pickup' and not pickup_point_id:

            messages.error(request, "Выберите точку самовывоза для способа доставки 'Самовывоз'.")

            return redirect('delivery_app:checkout')

        elif delivery_method == 'courier' and not delivery_address:

            messages.error(request, "Укажите адрес доставки для способа доставки 'Курьер'.")

            return redirect('delivery_app:checkout')



        if promo_code_input:

            try:

                promo_code = PromoCode.objects.get(code__iexact=promo_code_input)

                if not promo_code.is_valid():

                    messages.error(request, "Промокод недействителен или истёк.")

                    return redirect('delivery_app:checkout')

            except PromoCode.DoesNotExist:

                messages.error(request, "Промокод не найден.")

                return redirect('delivery_app:checkout')



        with transaction.atomic():

            locked_cart = list(

                CartItem.objects.select_for_update().filter(user=request.user).select_related('product')

            )

            if not locked_cart:

                messages.error(request, 'Корзина уже пуста.')

                return redirect('delivery_app:cart')

            products = {

                product.id: product

                for product in Product.objects.select_for_update().filter(

                    id__in=[item.product_id for item in locked_cart]

                )

            }

            for cart_item in locked_cart:

                product = products[cart_item.product_id]

                if product.stock < cart_item.quantity:

                    messages.error(

                        request,

                        f"Недостаточно товара «{product.name}»: доступно {product.stock}.",

                    )

                    return redirect('delivery_app:checkout')



            total_weight = sum(

                products[item.product_id].weight * Decimal(item.quantity)

                for item in locked_cart

            )

            delivery_cost = Decimal('0.00')

            if delivery_method == 'courier':

                delivery_cost = Decimal('5.00') + total_weight * Decimal('2.00')



            order = Order.objects.create(

                client=client,

                employee=None,

                status='Pending',

                pickup_point=pickup_point,

                delivery_method=delivery_method,

                delivery_cost=delivery_cost,

                delivery_address=delivery_address if delivery_method == 'courier' else '',

                payment_method=payment_method,

                promocode=promo_code,

            )

            for cart_item in locked_cart:

                product = products[cart_item.product_id]

                OrderItem.objects.create(

                    order=order,

                    product=product,

                    quantity=cart_item.quantity,

                    price=product.price,

                )

                product.stock -= cart_item.quantity

                product.save(update_fields=['stock'])

            CartItem.objects.filter(id__in=[item.id for item in locked_cart]).delete()



        logger.info('Создан заказ #%s для клиента %s', order.id, client.user.username)

        if payment_method == 'card':

            return redirect('delivery_app:payment_page', order_id=order.id)



        message = f"Заказ #{order.id} создан. Оплата — при получении."

        if promo_code:

            message += f" Применён промокод {promo_code.code}."

        messages.success(request, message)

        return redirect('delivery_app:order_detail', pk=order.id)



    cart_items_list = [

        {

            'product': item.product,

            'quantity': item.quantity,

            'total': item.product.price * Decimal(item.quantity)

        }

        for item in cart_items

    ]

    total = sum(item['total'] for item in cart_items_list)



    context = {

        'cart_items': cart_items_list,

        'pickup_points': PickupPoint.objects.all(),

        'total': total,

        'current_date': timezone.now().strftime('%d/%m/%Y'),

        'timezone': 'Europe/Minsk',

        'calendar': calendar.monthcalendar(timezone.now().year, timezone.now().month),

        'delivery_methods': Order.DELIVERY_METHODS,

        'selected_delivery_method': selected_delivery_method,

        'selected_pickup_point': selected_pickup_point,

        'delivery_address': delivery_address,

        'payment_methods': Order.PAYMENT_METHODS,

        'selected_payment_method': selected_payment_method,

        'promo_code_input': promo_code_input,

    }

    return render(request, 'delivery_app/checkout.html', context)



@login_required

def payment_page(request, order_id):

    order = get_object_or_404(Order, id=order_id, client__user=request.user)

    if order.payment_method != 'card':

        messages.info(request, 'Для этого заказа выбрана оплата при получении.')

        return redirect('delivery_app:order_detail', pk=order.id)

    if order.payment_status == 'paid':

        messages.info(request, 'Этот заказ уже оплачен.')

        return redirect('delivery_app:order_detail', pk=order.id)



    entered_brand = ''

    if request.method == 'POST':

        card_number = request.POST.get('card_number', '')

        expiry_date = request.POST.get('expiry_date', '')

        cvv = request.POST.get('cvv', '')

        entered_brand = card_brand(normalize_card_number(card_number))



        if settings.PAYMENT_PROVIDER != 'demo':

            messages.error(request, 'Платёжный провайдер не настроен. Выберите оплату при получении.')

            return redirect('delivery_app:order_detail', pk=order.id)



        result = process_demo_payment(

            card_number=card_number,

            expiry_date=expiry_date,

            cvv=cvv,

            amount=order.total_cost,

        )

        if result.success:

            order.payment_status = 'paid'

            order.payment_id = result.payment_id

            order.save(update_fields=['payment_status', 'payment_id'])

            messages.success(request, 'Оплата прошла успешно. Реквизиты карты не сохранялись.')

            return redirect('delivery_app:order_detail', pk=order.id)

        order.payment_status = 'failed'

        order.save(update_fields=['payment_status'])

        messages.error(request, result.error)

    

    context = {

        'order': order,

        'current_date': timezone.now().strftime('%d/%m/%Y'),

        'timezone': 'Europe/Minsk',

        'payment_provider': settings.PAYMENT_PROVIDER,

        'entered_brand': entered_brand,

    }

    return render(request, 'delivery_app/payment.html', context)



@login_required

def profile(request):

    try:

        client = Client.objects.get(user=request.user)

    except Client.DoesNotExist:

        client = Client(user=request.user)



    country_info = None

    try:

        country_response = requests.get('https://restcountries.com/v3.1/name/Belarus', timeout=2)

        country_info = country_response.json()[0]

    except:

        pass



    if request.method == 'POST':

        form = ClientForm(request.POST, instance=client, user=request.user)

        if form.is_valid():

            form.save()

            messages.success(request, "Профиль успешно обновлен!")

            return redirect('delivery_app:profile')

    else:

        form = ClientForm(instance=client, user=request.user)



    context = {

        'form': form,

        'country_info': country_info,

        'current_date': timezone.now().strftime('%d/%m/%Y'),

        'timezone': 'Europe/Minsk',

        'calendar': calendar.monthcalendar(timezone.now().year, timezone.now().month),

    }

    return render(request, 'delivery_app/profile.html', context)



logger = logging.getLogger('delivery_app')



@login_required

def employee_panel(request):

    logger.debug(f"Запрос на панель сотрудника от {request.user.username}")

    employee = Employee.objects.filter(user=request.user).first()

    if not request.user.is_superuser and employee is None:

        logger.info("Пользователь %s запросил панель без прав сотрудника", request.user.username)

        messages.error(request, "У вас нет прав доступа к панели сотрудников.")

        return redirect('delivery_app:home')



                                                                                       

    if request.user.is_superuser:

        orders = Order.objects.all()

        logger.debug("Суперпользователь: отображаются все заказы")

    else:

        orders = Order.objects.filter(employee=employee)

        logger.debug(f"Обычный сотрудник: отображаются только заказы сотрудника {employee}")



    status_filter = request.GET.get('status_filter')

    date_filter = request.GET.get('date_filter')

    type_filter = request.GET.get('type_filter')

    delivery_method_filter = request.GET.get('delivery_method_filter')



    if status_filter:

        orders = orders.filter(status=status_filter)

    if date_filter:

        orders = orders.filter(date_ordered__date=date_filter)

    if type_filter:

        orders = orders.filter(orderitem__product__product_type__name=type_filter)

    if delivery_method_filter:

        orders = orders.filter(delivery_method=delivery_method_filter)

    orders = orders.order_by('-date_ordered')

    logger.debug(f"Найдено заказов после фильтрации: {orders.count()}")



    orders_with_total = []

    for order in orders:

        total = sum(Decimal(str(item.price)) * Decimal(str(item.quantity)) for item in order.orderitem_set.all())

        orders_with_total.append({'order': order, 'total_cost': total})

        logger.debug(f"Заказ #{order.id} с общей стоимостью: {total}")



    total_orders = len(orders_with_total)

    status_counts = {status: len([o for o in orders_with_total if o['order'].status == status]) for status, _ in Order.STATUS_CHOICES}



    clients_alpha = Client.objects.order_by('user__username')

    total_sales = sum(o['total_cost'] for o in orders_with_total) or Decimal('0')

    logger.debug(f"Общая выручка: {total_sales}")



    sales = [o['total_cost'] for o in orders_with_total if o['total_cost']]

    sales_mean = statistics.mean(sales) if sales else Decimal('0')

    sales_median = statistics.median(sales) if sales else Decimal('0')

    sales_mode = statistics.mode(sales) if sales else Decimal('0')



    ages = []

    today = timezone.now().date()

    for client in Client.objects.exclude(date_of_birth__isnull=True):

        age = today.year - client.date_of_birth.year - ((today.month, today.day) < (client.date_of_birth.month, client.date_of_birth.day))

        if age >= 18:

            ages.append(age)

    age_mean = statistics.mean(ages) if ages else 0

    age_median = statistics.median(ages) if ages else 0



    popular_types = ProductType.objects.annotate(

        order_count=Count('products__order_items')

    ).order_by('-order_count')



    profit_by_type = ProductType.objects.annotate(

        total_profit=Sum(

            ExpressionWrapper(

                F('products__order_items__price') * F('products__order_items__quantity'),

                output_field=DecimalField()

            )

        )

    ).order_by('-total_profit')



    if request.method == 'POST':

        action = request.POST.get('action')

        if action == 'update':

            order_id = request.POST.get('order_id')

            status = request.POST.get('status')

            date_delivered = request.POST.get('date_delivered')

            allowed_orders = Order.objects.all() if request.user.is_superuser else Order.objects.filter(employee=employee)

            order = get_object_or_404(allowed_orders, id=order_id)

            old_status = order.status

            if status in dict(Order.STATUS_CHOICES).keys():

                order.status = status

            if date_delivered:

                order.date_delivered = date_delivered

            order.save()

            logger.debug(f"Статус заказа #{order_id} обновлён на {status}")

            messages.success(request, f"Статус заказа #{order_id} обновлен!")



            if old_status != status:

                subject = f'Статус вашего заказа #{order.id} изменён'

                message = f'Уважаемый(ая) {order.client.user.username},\n\nСтатус вашего заказа изменён с "{old_status}" на "{status}".\n\nДетали заказа можно посмотреть здесь: {request.build_absolute_uri(order.get_absolute_url())}\n\nС уважением,\nКоманда магазина'

                send_mail(

                    subject=subject,

                    message=message,

                    from_email=settings.DEFAULT_FROM_EMAIL,

                    recipient_list=[order.client.user.email],

                    fail_silently=True,

                )

                logger.debug(f"Email отправлен клиенту {order.client.user.email}")



        elif action == 'assign' and request.user.is_superuser:

            order_id = request.POST.get('order_id')

            employee_id = request.POST.get('employee_id')

            order = get_object_or_404(Order, id=order_id)

            order.employee = get_object_or_404(Employee, id=employee_id)

            order.save()

            logger.debug(f"Сотрудник #{employee_id} назначен на заказ #{order_id}")

            messages.success(request, f"Сотрудник назначен на заказ #{order_id}!")



        return redirect('delivery_app:employee_panel')



    employees = Employee.objects.all()

    clients = Client.objects.all()

    context = {

        'orders': orders_with_total,

        'employees': employees,

        'total_orders': total_orders,

        'status_counts': status_counts,

        'clients': clients,

        'clients_alpha': clients_alpha,

        'total_sales': total_sales,

        'sales_mean': sales_mean,

        'sales_median': sales_median,

        'sales_mode': sales_mode,

        'age_mean': age_mean,

        'age_median': age_median,

        'popular_types': popular_types,

        'profit_by_type': profit_by_type,

        'current_date': timezone.now().strftime('%d/%m/%Y'),

        'timezone': 'Europe/Minsk',

        'calendar': calendar.monthcalendar(timezone.now().year, timezone.now().month),

        'status_choices': Order.STATUS_CHOICES,

        'delivery_methods': Order.DELIVERY_METHODS,

        'product_types': ProductType.objects.all(),

    }

    return render(request, 'delivery_app/employee_panel.html', context)



@staff_member_required

def employee_statistics(request):

    orders = Order.objects.select_related('client').prefetch_related('orderitem_set__product').order_by('-date_ordered')

    orders_with_total = []

    total_sales = Decimal('0')

    for order in orders:

        total = sum(Decimal(str(item.price)) * Decimal(str(item.quantity)) for item in order.orderitem_set.all())

        total += order.delivery_cost

        orders_with_total.append({'order': order, 'total': total})

        total_sales += total



    total_orders = len(orders_with_total)

    average_order = (total_sales / total_orders) if total_orders else Decimal('0')

    delivered_orders = sum(1 for item in orders_with_total if item['order'].status == 'Delivered')

    paid_orders = sum(1 for item in orders_with_total if item['order'].payment_status == 'paid')

    delivery_revenue = sum((item['order'].delivery_cost for item in orders_with_total), Decimal('0'))



    status_labels = dict(Order.STATUS_CHOICES)

    status_breakdown = []

    for status, label in Order.STATUS_CHOICES:

        count = sum(1 for item in orders_with_total if item['order'].status == status)

        status_breakdown.append({

            'status': status,

            'label': label,

            'count': count,

            'percent': round(count * 100 / total_orders) if total_orders else 0,

        })



    payment_labels = dict(Order._meta.get_field('payment_status').choices)

    payment_breakdown = []

    for status, label in payment_labels.items():

        count = sum(1 for item in orders_with_total if item['order'].payment_status == status)

        payment_breakdown.append({

            'status': status,

            'label': label,

            'count': count,

            'percent': round(count * 100 / total_orders) if total_orders else 0,

        })



    delivery_breakdown = []

    for method, label in Order.DELIVERY_METHODS:

        method_orders = [item for item in orders_with_total if item['order'].delivery_method == method]

        delivery_breakdown.append({

            'method': method,

            'label': label,

            'count': len(method_orders),

            'revenue': sum((item['total'] for item in method_orders), Decimal('0')),

        })



    top_products = OrderItem.objects.values('product__name').annotate(

        quantity_sold=Sum('quantity'),

        revenue=Sum(

            ExpressionWrapper(

                F('price') * F('quantity'),

                output_field=DecimalField(max_digits=12, decimal_places=2),

            )

        ),

    ).order_by('-revenue')[:8]



    context = {

        'total_orders': total_orders,

        'total_sales': total_sales,

        'average_order': average_order,

        'delivered_orders': delivered_orders,

        'paid_orders': paid_orders,

        'delivery_revenue': delivery_revenue,

        'status_breakdown': status_breakdown,

        'payment_breakdown': payment_breakdown,

        'delivery_breakdown': delivery_breakdown,

        'top_products': top_products,

        'recent_orders': orders_with_total[:8],

        'current_date': timezone.now().strftime('%d/%m/%Y'),

        'timezone': 'Europe/Minsk',

    }

    return render(request, 'delivery_app/employee_statistics.html', context)



def register(request):

    if request.method == 'POST':

        form = CustomUserCreationForm(request.POST)

        if form.is_valid():

            user = form.save()

            

                                    

            date_of_birth = form.cleaned_data['date_of_birth']

            today = date.today()

            age = today.year - date_of_birth.year - ((today.month, today.day) < (date_of_birth.month, date_of_birth.day))

            day_of_week = calendar.day_name[date_of_birth.weekday()]

            

                             

            client = Client.objects.create(

                user=user,

                phone='+375 (29) 123-45-67',                         

                address='Не указан',                         

                date_of_birth=date_of_birth

            )

            

                                                

            if age >= 18:

                messages.success(request, f"Регистрация успешна! Вы родились в {day_of_week}.")

            else:

                messages.warning(request, f"Вам {age} лет. Для использования сайта требуется разрешение родителей.")

            

            login(request, user)

            return redirect('delivery_app:home')

    else:

        form = CustomUserCreationForm()



    context = {

        'form': form,

        'current_date': timezone.now().strftime('%d/%m/%Y'),

        'timezone': 'Europe/Minsk',

        'calendar': calendar.monthcalendar(timezone.now().year, timezone.now().month),

    }

    return render(request, 'delivery_app/register.html', context)



@staff_member_required

def employee_products(request):

    if request.method == 'POST':

        action = request.POST.get('action')

        try:

            if action == 'update_product':

                product_id = request.POST.get('product_id')

                product = get_object_or_404(Product, id=product_id) if product_id else Product(stock=0)

                product.name = request.POST.get('name', '').strip()

                product.price = Decimal(request.POST.get('price', ''))

                product.unit_of_measurement = request.POST.get('unit_of_measurement', '')

                product.product_type = get_object_or_404(ProductType, id=request.POST.get('product_type'))

                manufacturer_id = request.POST.get('manufacturer')

                product.manufacturer = get_object_or_404(Manufacturer, id=manufacturer_id) if manufacturer_id else None

                product.full_clean()

                product.save()

                messages.success(request, 'Товар обновлён.' if product_id else 'Товар добавлен.')

            elif action == 'update_product_type':

                product_type_id = request.POST.get('product_type_id')

                product_type = get_object_or_404(ProductType, id=product_type_id) if product_type_id else ProductType()

                product_type.name = request.POST.get('name', '').strip()

                product_type.full_clean()

                product_type.save()

                messages.success(request, 'Тип товара обновлён.' if product_type_id else 'Тип товара добавлен.')

            else:

                messages.error(request, 'Неизвестное действие.')

        except (InvalidOperation, ValidationError, ValueError, TypeError):

            messages.error(request, 'Проверьте заполнение полей и числовые значения.')

        return redirect('delivery_app:employee_products')



    products = Product.objects.all()

    product_types = ProductType.objects.all()

    manufacturers = Manufacturer.objects.all()

    context = {

        'products': products,

        'product_types': product_types,

        'manufacturers': manufacturers,

        'current_date': timezone.now().strftime('%d/%m/%Y'),

        'timezone': 'Europe/Minsk',

        'calendar': calendar.monthcalendar(timezone.now().year, timezone.now().month),

    }

    return render(request, 'delivery_app/employee_products.html', context)



logger = logging.getLogger('delivery_app')

def home_view(request):

    weather_data = cache.get('home_weather')

    exchange_data = cache.get('home_exchange')



    if not weather_data:

        weather_data = {

            'city': 'Минск',

            'temperature': 20,

            'description': 'данные временно недоступны',

            'source': 'резервное значение',

            'is_fallback': True,

        }

        weather_codes = {

            0: 'ясно',

            1: 'преимущественно ясно',

            2: 'переменная облачность',

            3: 'пасмурно',

            45: 'туман',

            48: 'изморозь',

            51: 'слабая морось',

            53: 'морось',

            55: 'сильная морось',

            61: 'слабый дождь',

            63: 'дождь',

            65: 'сильный дождь',

            71: 'слабый снег',

            73: 'снег',

            75: 'сильный снег',

            80: 'кратковременный дождь',

            81: 'ливень',

            82: 'сильный ливень',

            95: 'гроза',

        }

        try:

            weather_response = requests.get(

                'https://api.open-meteo.com/v1/forecast',

                params={

                    'latitude': '53.9006',

                    'longitude': '27.5590',

                    'current_weather': 'true',

                    'timezone': 'Europe/Minsk',

                },

                timeout=3,

            )

            weather_response.raise_for_status()

            weather_json = weather_response.json()

            current_weather = weather_json.get('current_weather') or {}

            temperature = current_weather.get('temperature')

            weather_code = current_weather.get('weathercode')

            if temperature is not None:

                weather_data = {

                    'city': 'Минск',

                    'temperature': round(Decimal(str(temperature)), 1),

                    'description': weather_codes.get(weather_code, 'погода обновлена'),

                    'source': 'Open-Meteo',

                    'is_fallback': False,

                }

                cache.set('home_weather', weather_data, 900)

        except (requests.RequestException, ValueError, TypeError, InvalidOperation):

            logger.warning('Weather data fallback is used', exc_info=True)



    if not exchange_data:

        exchange_data = {

            'usd': Decimal('3.30'),

            'eur': Decimal('3.60'),

            'source': 'резервное значение',

            'is_fallback': True,

        }

        try:

            exchange_response = requests.get(

                'https://api.nbrb.by/exrates/rates',

                params={'periodicity': 0},

                timeout=3,

            )

            exchange_response.raise_for_status()

            rates = exchange_response.json()

            rates_by_code = {item.get('Cur_Abbreviation'): item for item in rates}

            usd = rates_by_code.get('USD')

            eur = rates_by_code.get('EUR')

            if usd and eur:

                exchange_data = {

                    'usd': (Decimal(str(usd['Cur_OfficialRate'])) / Decimal(str(usd.get('Cur_Scale', 1)))).quantize(Decimal('0.0001')),

                    'eur': (Decimal(str(eur['Cur_OfficialRate'])) / Decimal(str(eur.get('Cur_Scale', 1)))).quantize(Decimal('0.0001')),

                    'source': 'НБРБ',

                    'is_fallback': False,

                }

                cache.set('home_exchange', exchange_data, 900)

        except (requests.RequestException, ValueError, TypeError, KeyError, InvalidOperation):

            logger.warning('Exchange data fallback is used', exc_info=True)

    

    latest_articles = list(Article.objects.order_by('-published_date')[:3])
    latest_article = latest_articles[0] if latest_articles else None

    partners = Partner.objects.all()

    banners = Banner.objects.filter(is_active=True)[:3]                      

    products = Product.objects.filter(stock__gt=0)[:4]                       

    company_info = CompanyInfo.objects.first()



                   

    current_date = timezone.now()

    year = current_date.year

    month = current_date.month

    calendar.setfirstweekday(calendar.MONDAY)

    calendar_data = calendar.monthcalendar(year, month)

    logger.debug(f"Calendar data: {calendar_data}")



    context = {

        'company_info': company_info,

        'current_date': current_date,

        'timezone': timezone.get_current_timezone_name(),

        'calendar': calendar_data,

        'weather_data': weather_data,

        'exchange_data': exchange_data,

        'banners': banners,

        'products': products,

        'latest_article': latest_article,

        'latest_articles': latest_articles,

        'partners': partners,

    }

    return render(request, 'delivery_app/home.html', context)



def about(request):

    company_info = CompanyInfo.objects.first()

    context = {

        'company_info': company_info,

        'current_date': timezone.now().strftime('%d/%m/%Y'),

        'timezone': 'Europe/Minsk',

    }

    return render(request, 'delivery_app/about.html', context)



def news(request):

    articles = Article.objects.order_by('-published_date')

    context = {

        'articles': articles,

        'current_date': timezone.now().strftime('%d/%m/%Y'),

        'timezone': 'Europe/Minsk',

    }

    return render(request, 'delivery_app/news.html', context)



def news_detail(request, pk):

    article = get_object_or_404(Article, pk=pk)

    return render(request, 'delivery_app/news_detail.html', {'article': article})



def faq(request):

    faqs = FAQ.objects.order_by('-added_date')

    context = {

        'faqs': faqs,

        'current_date': timezone.now().strftime('%d/%m/%Y'),

        'timezone': 'Europe/Minsk',

    }

    return render(request, 'delivery_app/faq.html', context)



def contacts(request):

    employees = Employee.objects.all()

    context = {

        'employees': employees,

        'current_date': timezone.now().strftime('%d/%m/%Y'),

        'timezone': 'Europe/Minsk',

    }

    return render(request, 'delivery_app/contacts.html', context)



def privacy_policy(request):

    sections = PrivacyPolicy.objects.filter(is_active=True).order_by('order')

    context = {

        'sections': sections,

        'current_date': timezone.now().strftime('%d/%m/%Y'),

        'timezone': 'Europe/Minsk',

    }

    return render(request, 'delivery_app/privacy_policy.html', context)



def vacancies(request):

    vacancies = Vacancy.objects.order_by('-created_date')

    context = {

        'vacancies': vacancies,

        'current_date': timezone.now().strftime('%d/%m/%Y'),

        'timezone': 'Europe/Minsk',

    }

    return render(request, 'delivery_app/vacancies.html', context)



@login_required

def add_review(request):

    if request.method == 'POST':

        form = ReviewForm(request.POST)

        if form.is_valid():

            review = form.save(commit=False)

            review.user = request.user

            review.save()

            messages.success(request, "Отзыв добавлен!")

            return redirect('delivery_app:reviews')

    else:

        form = ReviewForm()

    return render(request, 'delivery_app/add_review.html', {'form': form})



def reviews(request):

    reviews = Review.objects.order_by('-created_date')

    context = {

        'reviews': reviews,

        'current_date': timezone.now().strftime('%d/%m/%Y'),

        'timezone': 'Europe/Minsk',

    }

    return render(request, 'delivery_app/reviews.html', context)



def promocodes(request):

    active_promocodes = PromoCode.objects.filter(valid_to__gte=timezone.now())

    archived_promocodes = PromoCode.objects.filter(valid_to__lt=timezone.now())

    context = {

        'active_promocodes': active_promocodes,

        'archived_promocodes': archived_promocodes,

        'current_date': timezone.now().strftime('%d/%m/%Y'),

        'timezone': 'Europe/Minsk',

    }

    return render(request, 'delivery_app/promocodes.html', context)



def product_list(request):

                                        

    products = Product.objects.all()

    product_types = ProductType.objects.all()



                                            

    search_query = request.GET.get('search', '').strip()

    type_filter = request.GET.get('type', '').strip()

    sort_by = request.GET.get('sort', 'name').strip()

    

                                  

    page_number = request.GET.get('page', 1)

    per_page = request.GET.get('per_page', 3)



                        

    if type_filter:

        products = products.filter(product_type__name=type_filter)



    if search_query:

        products = products.filter(

            Q(name__icontains=search_query) | 

            Q(description__icontains=search_query)

        )



                

    if sort_by in ['name', '-name', 'price', '-price', 'stock']:

        products = products.order_by(sort_by)

    else:

        products = products.order_by('name')



               

    try:

        per_page = int(per_page)

        if per_page not in [3, 6, 9, 12]:

            per_page = 3

    except (ValueError, TypeError):

        per_page = 3



    paginator = Paginator(products, per_page)

    

    try:

        page_number = int(page_number)

        products_page = paginator.page(page_number)

    except (PageNotAnInteger, ValueError):

        products_page = paginator.page(1)

    except EmptyPage:

        products_page = paginator.page(paginator.num_pages)



    context = {

        'products': products_page,               

        'product_types': product_types,

        'search_query': search_query,

        'type_filter': type_filter,

        'sort_by': sort_by,

        'paginator': paginator,                       

        'per_page': per_page,                                  

    }

    

    return render(request, 'delivery_app/product_list.html', context)



def product_detail(request, product_id):

    product = get_object_or_404(Product, id=product_id)

    context = {

        'product': product,

        'current_date': timezone.now().strftime('%d/%m/%Y'),

        'timezone': 'Europe/Minsk',

    }

    return render(request, 'delivery_app/product_detail.html', context)



@staff_member_required

def employee_management(request):

    employees = Employee.objects.all()

    query = request.GET.get('q', '').strip()

    

                      

    employees = Employee.objects.all().order_by('-id')

    

                                                       

    if query:

        employees = employees.filter(

            Q(first_name__icontains=query) |

            Q(last_name__icontains=query) |

            Q(middle_name__icontains=query) |

            Q(position__icontains=query) |

            Q(phone__icontains=query) |

            Q(email__icontains=query)

        )

                                                      

    selected_employees_str = request.GET.get('selected_employees', '')

    if selected_employees_str:

        try:

            selected_employees = [int(id) for id in selected_employees_str.split(',') if id]

        except ValueError:

            selected_employees = []

    else:

        selected_employees = []

    

                                          

    paginator = Paginator(employees, 3)

    page_number = request.GET.get('page')

    page_obj = paginator.get_page(page_number)

    

                                         

    employees_data = []

    for employee in employees:

        employee_data = {

            'id': employee.id,

            'fio': employee.get_full_name(),

            'photo': employee.photo.url if employee.photo else '',

            'description': employee.position,

            'phone': employee.phone,

            'email': employee.email,

        }

        employees_data.append(employee_data)

    

    context = {

        'current_date': timezone.now().strftime('%d/%m/%Y'),

        'page_obj': page_obj,                                     

        'selected_employees': selected_employees,                                  

        'employees_json': json.dumps(employees_data),

    }

    return render(request, 'delivery_app/employee_management.html', context)



@staff_member_required

@require_POST

def add_employee_api(request):

    try:

            data = json.loads(request.body)

            

                                             

            form_data = {

                'first_name': data.get('first_name', '').strip(),

                'last_name': data.get('last_name', '').strip(),

                'middle_name': data.get('middle_name', '').strip(),

                'position': data.get('position', '').strip(),

                'phone': data.get('phone', '').strip(),

                'email': data.get('email', '').strip(),

            }

            

                                            

            form = EmployeeForm(form_data)

            

            if form.is_valid():

                                                                

                employee = form.save(commit=False)

                

                                                            

                if data.get('photo_url', '').strip():

                    return JsonResponse({

                        'success': False,

                        'error': 'Загрузка фото по внешней ссылке отключена из соображений безопасности.'

                    }, status=400)

                

                                           

                employee.save()

                

                return JsonResponse({

                    'success': True,

                    'employee': {

                        'id': employee.id,

                        'fio': employee.get_full_name(),

                        'photo': employee.photo.url if employee.photo else '',

                        'description': employee.position,

                        'phone': employee.phone,

                        'email': employee.email,

                    }

                })

            else:

                                                   

                errors = {}

                for field, error_list in form.errors.items():

                    errors[field] = [str(error) for error in error_list]

                

                return JsonResponse({

                    'success': False,

                    'error': 'Ошибки валидации формы',

                    'field_errors': errors

                }, status=400)

            

    except (ValueError, TypeError, json.JSONDecodeError):

        return JsonResponse({'success': False, 'error': 'Некорректные данные запроса.'}, status=400)



@staff_member_required

@require_GET

def employees_json(request):

    try:

        employees = Employee.objects.all()

        employees_data = []

        

        for employee in employees:

            employee_data = {

                'id': employee.id,

                'fio': employee.get_full_name(),

                'photo': employee.photo.url if employee.photo else '',

                'description': employee.position,

                'phone': employee.phone,

                'email': employee.email,

            }

            employees_data.append(employee_data)

        

        return JsonResponse(employees_data, safe=False)

        

    except Exception as e:

        return JsonResponse({'error': str(e)}, status=500)



@staff_member_required

@require_GET

def search_employees_api(request):

    if request.method == 'GET':

        query = request.GET.get('q', '').strip()

        page = int(request.GET.get('page', 1))

        page_size = 3                                                 

        

                          

        employees = Employee.objects.all().order_by('-id')

        

                                                           

        if query:

            employees = employees.filter(

                Q(first_name__icontains=query) |

                Q(last_name__icontains=query) |

                Q(middle_name__icontains=query) |

                Q(position__icontains=query) |

                Q(phone__icontains=query) |

                Q(email__icontains=query)

            )

        

                                          

        paginator = Paginator(employees, page_size)

        try:

            page_obj = paginator.page(page)

        except PageNotAnInteger:

            page_obj = paginator.page(1)

        except EmptyPage:

            page_obj = paginator.page(paginator.num_pages)

        

                                          

        employees_data = []

        for employee in page_obj:

            employees_data.append({

                'id': employee.id,

                'fio': employee.get_full_name(),

                'photo': employee.photo.url if employee.photo else '',

                'description': employee.position,

                'phone': employee.phone,

                'email': employee.email,

            })

        

        return JsonResponse({

            'employees': employees_data,

            'total_count': employees.count(),

            'query': query,

            'pagination': {

                'current_page': page_obj.number,

                'total_pages': paginator.num_pages,

                'has_previous': page_obj.has_previous(),

                'has_next': page_obj.has_next(),

                'page_size': page_size

            }

        })

    

    return JsonResponse({'error': 'Method not allowed'}, status=405)
