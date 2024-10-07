from rest_framework import viewsets, status, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from store.models import Product, Cart, CartItem, Order, OrderItem
from store.serializers import ProductSerializer, CartSerializer, OrderSerializer
from django.shortcuts import get_object_or_404

class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    lookup_field = 'slug'  # Lookup products by slug

    def get_queryset(self):
        # You can add search and filter logic here if needed
        return super().get_queryset()  # Using the default queryset

class CartViewSet(viewsets.ModelViewSet):
    queryset = Cart.objects.all()
    serializer_class = CartSerializer
    permission_classes = [permissions.IsAuthenticated]

    def retrieve(self, request, *args, **kwargs):
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

        cart_item.quantity += quantity  # Increment quantity
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
        
        return Response({"error": "Order cannot be canceled"}, status=status.HTTP_400_BAD_REQUEST)
