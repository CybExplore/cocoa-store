<<<<<<< HEAD
# store/urls.py

from django.urls import path
from store.views import CategoryList, CategoryDetail, ProductList, ProductDetail, CartList, CartDetail, OrderList, OrderDetail

urlpatterns = [
    path('products/', ProductList.as_view(), name='product-list'),
    path('products/<slug:slug>/', ProductDetail.as_view(), name='product-detail'),
    path('categories/', CategoryList.as_view(), name='category-list'),
    path('categories/<int:pk>/', CategoryDetail.as_view(), name='category-detail'),
    path('carts/', CartList.as_view(), name='cart-list'),
    path('carts/<int:pk>/', CartDetail.as_view(), name='cart-detail'),
    path('orders/', OrderList.as_view(), name='order-list'),
    path('orders/<int:pk>/', OrderDetail.as_view(), name='order-detail'),
=======
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from store.views import ProductViewSet, CartViewSet, OrderViewSet

router = DefaultRouter()
router.register(r'products', ProductViewSet, basename='products')
router.register(r'cart', CartViewSet, basename='cart')
router.register(r'orders', OrderViewSet, basename='orders')

urlpatterns = [
    path('', include(router.urls)),  # Include all the router-based URLs
>>>>>>> 4a3366c (Initial commit)
]
