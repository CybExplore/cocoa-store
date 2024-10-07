from django.db import models
from django.utils.text import slugify
from django.contrib.auth.models import User
from decimal import Decimal


class Product(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    stock = models.PositiveIntegerField()
    slug = models.SlugField(unique=True, blank=True)
    image = models.ImageField(upload_to='static/products/', blank=True, null=True)  # Product image field (optional)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name


class Cart(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Cart - {self.user.username}"

    # Total cart price calculated dynamically
    def get_total_price(self):
        return sum(item.get_total_price() for item in self.items.all())

    # Get total item count in the cart
    def get_total_quantity(self):
        return sum(item.quantity for item in self.items.all())


class CartItem(models.Model):
    cart = models.ForeignKey(Cart, related_name='items', on_delete=models.CASCADE)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(default=1)

    def __str__(self):
        return f"{self.product.name} (x{self.quantity})"

    # Total price for the cart item
    def get_total_price(self):
        return self.product.price * self.quantity

    # Automatically decrease stock when an item is added to the cart
    def save(self, *args, **kwargs):
        if self.pk is None:  # Ensure this only happens when a new item is added
            if self.product.stock < self.quantity:
                raise ValueError("Not enough stock available for this product")
            self.product.stock -= self.quantity
            self.product.save()
        super().save(*args, **kwargs)

    # Restore stock if the item is removed from the cart
    def delete(self, *args, **kwargs):
        self.product.stock += self.quantity
        self.product.save()
        super().delete(*args, **kwargs)


ORDER_STATUS_CHOICES = [
    ('pending', 'Pending'),
    ('completed', 'Completed'),
    ('canceled', 'Canceled'),
]


class Order(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    status = models.CharField(max_length=50, choices=ORDER_STATUS_CHOICES, default='pending')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    locked = models.BooleanField(default=False)  # Added field to lock the order after confirmation

    def __str__(self):
        return f"Order {self.id} - {self.user.username}"

    # Total price calculated from the order items
    def get_total_price(self):
        return sum(item.get_total_price() for item in self.items.all())

    # Lock the order after it's finalized
    def lock_order(self):
        self.locked = True
        self.save()

    # Override save to prevent modification of locked orders
    def save(self, *args, **kwargs):
        if self.locked:
            raise ValueError("Cannot modify a locked order")
        super().save(*args, **kwargs)


class OrderItem(models.Model):
    order = models.ForeignKey(Order, related_name='items', on_delete=models.CASCADE)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField()
    price_at_purchase = models.DecimalField(max_digits=10, decimal_places=2)  # Store the product price at the time of purchase

    def __str__(self):
        return f"{self.product.name} (x{self.quantity})"

    # Total price for the order item
    def get_total_price(self):
        return self.price_at_purchase * self.quantity

    # Override save to record product price at purchase
    def save(self, *args, **kwargs):
        if self.pk is None:  # Only set price_at_purchase when the item is first created
            self.price_at_purchase = self.product.price
        super().save(*args, **kwargs)
