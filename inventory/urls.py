from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import InventoryViewSet, register_inventory

# Router for standard CRUD operations
router = DefaultRouter()
router.register(r'inventory', InventoryViewSet, basename='inventory')

urlpatterns = [
    # ViewSet routes
    # GET    /api/inventory/              - List all items
    # POST   /api/inventory/              - Create item (alternative to /register)
    # GET    /api/inventory/{id}/         - Get single item
    # PUT    /api/inventory/{id}/         - Update item text fields
    # DELETE /api/inventory/{id}/         - Delete item
    # PUT    /api/inventory/{id}/photo/   - Update photo only
    # GET    /api/inventory/list_with_count/ - List with count
    path('', include(router.urls)),
    
    # Custom endpoint for item creation
    # POST   /api/register/               - Create inventory item
    path('register/', register_inventory, name='register-inventory'),
]
