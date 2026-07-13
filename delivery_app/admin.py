from django.contrib import admin

from .models import FAQ, Article, Banner, CompanyInfo, Employee, Client, Manufacturer, Partner, PrivacyPolicy, ProductType, Product, Order, OrderItem, PromoCode, PickupPoint, Review, Vacancy



                             

@admin.register(Employee)

class EmployeeAdmin(admin.ModelAdmin):

    list_display = ('get_full_name', 'position', 'email', 'phone', 'user', 'date_of_birth')  

    list_display_links = ('get_full_name',)

    search_fields = ('first_name', 'last_name', 'middle_name', 'email', 'position', 'phone', 'user__username')

    list_filter = ('position',)

    list_per_page = 20

                                              

    fieldsets = (

        ('Основная информация', {

            'fields': ('user', 'position', 'photo')

        }),

        ('Персональные данные', {

            'fields': (

                ('first_name', 'last_name', 'middle_name'),

                'date_of_birth',

                ('phone', 'email')

            )

        }),

    )

    def get_full_name(self, obj):

        return obj.get_full_name()

    get_full_name.short_description = 'ФИО'

    get_full_name.admin_order_field = 'last_name'                          



                           

@admin.register(Client)

class ClientAdmin(admin.ModelAdmin):

    list_display = ('user', 'phone', 'date_of_birth')

    search_fields = ('user__username', 'phone')

    list_filter = ('date_of_birth',)



                                

@admin.register(ProductType)

class ProductTypeAdmin(admin.ModelAdmin):

    list_display = ('name',)

    search_fields = ('name',)



                            

@admin.register(Product)

class ProductAdmin(admin.ModelAdmin):

    list_display = ('name', 'price', 'unit_of_measurement', 'product_type', 'stock')

    search_fields = ('name',)

    list_filter = ('product_type', 'unit_of_measurement')

    fields = ('name', 'price', 'unit_of_measurement', 'product_type', 'description', 'manufacturer', 'weight', 'stock', 'image')                   



                                             

class OrderItemInline(admin.TabularInline):

    model = OrderItem

    extra = 1



                          

@admin.register(Order)

class OrderAdmin(admin.ModelAdmin):

    list_display = ('id', 'client', 'employee', 'date_ordered', 'status', 'total_cost', 'pickup_point', 'delivery_cost', 'delivery_method')

    search_fields = ('client__user__username', 'employee__user__username')

    list_filter = ('status', 'date_ordered', 'pickup_point', 'delivery_method')

    inlines = [OrderItemInline]



    def total_cost(self, obj):

        return sum(item.price * item.quantity for item in obj.orderitem_set.all())



                              

@admin.register(OrderItem)

class OrderItemAdmin(admin.ModelAdmin):

    list_display = ('order', 'product', 'quantity', 'price')

    search_fields = ('product__name',)

    list_filter = ('order',)



                              

@admin.register(PromoCode)

class PromoCodeAdmin(admin.ModelAdmin):

    list_display = ('code', 'discount', 'valid_from', 'valid_to', 'active')

    search_fields = ('code',)

    list_filter = ('active', 'valid_from', 'valid_to')

    list_editable = ('discount', 'active')



                                

@admin.register(PickupPoint)

class PickupPointAdmin(admin.ModelAdmin):

    list_display = ('name', 'address', 'working_hours')

    search_fields = ('name', 'address')

    list_filter = ('name',)



@admin.register(Manufacturer)

class ManufacturerAdmin(admin.ModelAdmin):

    list_display = ('name', 'country')

    search_fields = ('name',)    



                                

@admin.register(CompanyInfo)

class CompanyInfoAdmin(admin.ModelAdmin):

    list_display = ('name',)

    fieldsets = (

        ('Основная информация', {

            'fields': ('name', 'description', 'logo', 'video_url')

        }),

        ('История', {

            'fields': ('history', 'history_by_years')

        }),

        ('Документы', {

            'fields': ('requisites', 'certificate')

        }),

    )



                            

@admin.register(Article)

class ArticleAdmin(admin.ModelAdmin):

    list_display = ('title', 'summary', 'published_date')

    search_fields = ('title', 'summary')

    list_filter = ('published_date',)

    list_editable = ('summary',)                             



                        

@admin.register(FAQ)

class FAQAdmin(admin.ModelAdmin):

    list_display = ('question', 'answer', 'added_date')

    search_fields = ('question', 'answer')

    list_filter = ('added_date',)

    list_editable = ('answer',)                             



                            

@admin.register(Vacancy)

class VacancyAdmin(admin.ModelAdmin):

    list_display = ('title', 'description', 'created_date')

    search_fields = ('title', 'description')

    list_filter = ('created_date',)

    list_editable = ('description',)                             



                           

@admin.register(Review)

class ReviewAdmin(admin.ModelAdmin):

    list_display = ('user', 'rating', 'text', 'created_date')

    search_fields = ('user__username', 'text')

    list_filter = ('rating', 'created_date')

    list_editable = ('rating', 'text')                             



@admin.register(Banner)

class BannerAdmin(admin.ModelAdmin):

    list_display = ('title', 'is_active', 'created_at')

    list_filter = ('is_active', 'created_at')

    list_editable = ('is_active',)    



@admin.register(Partner)

class PartnerAdmin(admin.ModelAdmin):

    list_display = ('name', 'website')

    search_fields = ('name', 'website')



@admin.register(PrivacyPolicy)

class PrivacyPolicyAdmin(admin.ModelAdmin):

    list_display = ('title', 'order', 'is_active', 'last_updated')

    list_editable = ('order', 'is_active')

    list_filter = ('is_active',)    
