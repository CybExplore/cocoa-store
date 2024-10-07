<<<<<<< HEAD
# store/views.py

from rest_framework import generics
from .models import Product, Category, Cart, CartItem, Order, OrderItem
from .serializers import ProductSerializer, CategorySerializer, CartSerializer, OrderSerializer
from rest_framework.permissions import AllowAny

# Category Views
class CategoryList(generics.ListCreateAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer

class CategoryDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer

# Product Views
class ProductList(generics.ListCreateAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [AllowAny]  # Allow any user to access this view

class ProductDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [AllowAny]  # Allow any user to access this view

# Cart Views
class CartList(generics.ListCreateAPIView):
    queryset = Cart.objects.all()
    serializer_class = CartSerializer

class CartDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Cart.objects.all()
    serializer_class = CartSerializer

# Order Views
class OrderList(generics.ListCreateAPIView):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer

class OrderDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer
=======
from rest_framework import viewsets, status, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Product, Cart, CartItem, Order, OrderItem
from .serializers import ProductSerializer, CartSerializer, OrderSerializer
from django.shortcuts import get_object_or_404

class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    lookup_field = 'slug'  # Lookup products by slug

    def get_queryset(self):
        # You can add search and filter logic here if needed
        return Product.objects.all()

class CartViewSet(viewsets.ModelViewSet):
    queryset = Cart.objects.all()
    serializer_class = CartSerializer
    permission_classes = [permissions.IsAuthenticated]

    def retrieve(self, request):
        cart = get_object_or_404(Cart, user=request.user)
        serializer = self.get_serializer(cart)

        total_price = sum(item.get_total_price() for item in cart.items.all())
        total_quantity = sum(item.quantity for item in cart.items.all())
        data = {
            'cart': serializer.data,
            'total_price': total_price,
            'total_quantity': total_quantity
        }
        return Response(data)

    @action(detail=False, methods=['post'])
    def add_to_cart(self, request):
        """Add an item to the cart."""
        user = request.user
        product_id = request.data.get('product_id')
        quantity = request.data.get('quantity', 1)

        product = get_object_or_404(Product, id=product_id)

        if quantity <= 0:
            return Response({"error": "Quantity must be greater than 0"}, status=status.HTTP_400_BAD_REQUEST)
        
        if quantity > product.stock:
            return Response({"error": "Not enough stock available"}, status=status.HTTP_400_BAD_REQUEST)

        cart, _ = Cart.objects.get_or_create(user=user)  # Create cart if it doesn't exist
        cart_item, created = CartItem.objects.get_or_create(cart=cart, product=product)

        if created:
            cart_item.quantity = quantity
        else:
            cart_item.quantity += quantity

        cart_item.save()
        return Response({"message": "Item added to cart"}, status=status.HTTP_201_CREATED)

    @action(detail=False, methods=['post'])
    def remove_from_cart(self, request):
        """Remove an item from the cart."""
        user = request.user
        product_id = request.data.get('product_id')

        cart = get_object_or_404(Cart, user=user)
        product = get_object_or_404(Product, id=product_id)

        cart_item = get_object_or_404(CartItem, cart=cart, product=product)
        cart_item.delete()

        return Response({"message": "Item removed from cart"}, status=status.HTTP_204_NO_CONTENT)

    @action(detail=False, methods=['post'])
    def clear_cart(self, request):
        """Clear the cart for the user."""
        cart = get_object_or_404(Cart, user=request.user)
        cart.items.all().delete()
        return Response({"message": "Cart cleared"}, status=status.HTTP_204_NO_CONTENT)

class OrderViewSet(viewsets.ModelViewSet):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated]  # Ensure the user is authenticated

    def get_queryset(self):
        # Only allow users to view their own orders
        return Order.objects.filter(user=self.request.user)

    @action(detail=False, methods=['post'])
    def create_order(self, request):
        """Create an order from the user's cart."""
        cart = get_object_or_404(Cart, user=request.user)

        # Check if the cart is empty
        if cart.items.count() == 0:
            return Response({"message": "Cart is empty"}, status=status.HTTP_400_BAD_REQUEST)

        # Create an order for the user
        order = Order.objects.create(user=request.user)

        # Create order items from the cart items
        for item in cart.items.all():
            OrderItem.objects.create(
                order=order,
                product=item.product,
                quantity=item.quantity,
                price_at_purchase=item.product.price
            )

        # Clear the cart after the order is placed
        cart.items.all().delete()

        serializer = OrderSerializer(order)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    @action(detail=True, methods=['post'])
    def cancel_order(self, request, pk=None):
        """Cancel an existing order."""
        order = get_object_or_404(Order, pk=pk, user=request.user)

        # Only allow cancellation for pending orders
        if order.status == 'pending':
            order.status = 'canceled'
            order.save()
            return Response({"message": "Order canceled"}, status=status.HTTP_200_OK)
        return Response({"message": "Order cannot be canceled"}, status=status.HTTP_400_BAD_REQUEST)
>>>>>>> 4a3366c (Initial commit)
