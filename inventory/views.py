from rest_framework import viewsets, status
from rest_framework.decorators import action, api_view
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from django.shortcuts import get_object_or_404
from .models import Inventory
from .serializers import InventorySerializer, InventoryPhotoSerializer


class InventoryViewSet(viewsets.ModelViewSet):
    """
    Complete API for Inventory management
    
    Provides CRUD operations and custom actions for photo updates
    """
    queryset = Inventory.objects.all()
    serializer_class = InventorySerializer
    parser_classes = (MultiPartParser, FormParser)

    def get_queryset(self):
        """Get all inventory items ordered by creation date"""
        return Inventory.objects.all().order_by('-created_at')

    def create(self, request, *args, **kwargs):
        """Create new inventory item with multipart form data"""
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(
                serializer.data,
                status=status.HTTP_201_CREATED
            )
        return Response(
            {'error': 'Validation failed', 'details': serializer.errors},
            status=status.HTTP_400_BAD_REQUEST
        )

    def update(self, request, *args, **kwargs):
        """Update inventory item (text fields only)"""
        instance = self.get_object()
        
        # Only allow updating specific fields
        data = {}
        if 'inventory_name' in request.data:
            data['inventory_name'] = request.data.get('inventory_name')
        if 'description' in request.data:
            data['description'] = request.data.get('description')
        
        if not data:
            return Response(
                {'error': 'Provide at least inventory_name or description'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        serializer = self.get_serializer(instance, data=data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        
        return Response(
            {'error': 'Validation failed', 'details': serializer.errors},
            status=status.HTTP_400_BAD_REQUEST
        )

    def destroy(self, request, *args, **kwargs):
        """Delete inventory item"""
        instance = self.get_object()
        instance.delete()
        return Response(
            {'message': 'Inventory item deleted successfully'},
            status=status.HTTP_204_NO_CONTENT
        )

    @action(detail=True, methods=['put'], parser_classes=(MultiPartParser, FormParser))
    def photo(self, request, pk=None):
        """Update only the photo field"""
        instance = self.get_object()
        
        if 'photo' not in request.FILES:
            return Response(
                {'error': 'photo field is required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        serializer = InventoryPhotoSerializer(instance, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        
        return Response(
            {'error': 'Validation failed', 'details': serializer.errors},
            status=status.HTTP_400_BAD_REQUEST
        )

    @action(detail=False, methods=['get'])
    def list_with_count(self, request):
        """Get all items with total count"""
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        return Response({
            'count': queryset.count(),
            'results': serializer.data
        })


@api_view(['POST'])
def register_inventory(request):
    """
    Create new inventory item
    Endpoint: POST /register
    
    Accept: multipart/form-data
    Required fields: inventory_name, photo
    Optional fields: description
    """
    if request.method == 'POST':
        serializer = InventorySerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(
                {
                    'message': 'Inventory item created successfully',
                    'data': serializer.data
                },
                status=status.HTTP_201_CREATED
            )
        return Response(
            {
                'error': 'Failed to create inventory item',
                'details': serializer.errors
            },
            status=status.HTTP_400_BAD_REQUEST
        )

