# Generated by Django 5.1.1 on 2024-10-04 06:48

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('store', '0002_category_cart_cartitem_product_category_order_and_more'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='product',
            name='category',
        ),
    ]