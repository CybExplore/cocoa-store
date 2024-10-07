# store/admin.py
from django.contrib import admin
from .models import Product, Cart, CartItem, Order, OrderItem

class ProductAdmin(admin.ModelAdmin):
    list_display = ('name', 'price', 'stock', 'created_at', 'updated_at')
    search_fields = ('name',)
    prepopulated_fields = {'slug': ('name',)}  # Automatically fills the slug based on the name
    list_filter = ('created_at', 'updated_at')

class CartItemInline(admin.TabularInline):
    model = CartItem
    extra = 1  # How many empty forms to display

class CartAdmin(admin.ModelAdmin):
    list_display = ('user', 'created_at', 'get_total_price', 'get_total_quantity')
    inlines = [CartItemInline]

class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 1

class OrderAdmin(admin.ModelAdmin):
    list_display = ('user', 'status', 'created_at', 'updated_at', 'get_total_price', 'locked')
    list_filter = ('status', 'locked', 'created_at', 'updated_at')
    inlines = [OrderItemInline]

# Register the models with their respective admins
admin.site.register(Product, ProductAdmin)
admin.site.register(Cart, CartAdmin)
admin.site.register(Order, OrderAdmin)
