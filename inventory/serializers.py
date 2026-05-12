from rest_framework import serializers
from .models import Inventory


class InventorySerializer(serializers.ModelSerializer):
    """Serializer for complete Inventory model"""
    class Meta:
        model = Inventory
        fields = ['id', 'inventory_name', 'description', 'photo', 'created_at', 'updated_at']
        read_only_fields = ['created_at', 'updated_at']
        extra_kwargs = {
            'inventory_name': {
                'required': True,
                'error_messages': {
                    'required': 'inventory_name is required',
                    'blank': 'inventory_name cannot be empty'
                }
            },
            'photo': {
                'required': True,
                'error_messages': {
                    'required': 'photo file is required',
                    'invalid': 'photo must be a valid image file'
                }
            },
            'description': {
                'required': False,
                'allow_blank': True
            }
        }

    def validate_inventory_name(self, value):
        """Validate inventory_name field"""
        if not value or not value.strip():
            raise serializers.ValidationError('inventory_name cannot be empty')
        if len(value) > 255:
            raise serializers.ValidationError('inventory_name cannot exceed 255 characters')
        return value

    def validate_description(self, value):
        """Validate description field"""
        if value and len(value) > 1000:
            raise serializers.ValidationError('description cannot exceed 1000 characters')
        return value

    def validate_photo(self, value):
        """Validate photo file"""
        if value:
            # Check file size (max 5MB)
            if value.size > 5 * 1024 * 1024:
                raise serializers.ValidationError('Photo file size cannot exceed 5MB')
            
            # Check file type
            valid_types = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
            if value.content_type not in valid_types:
                raise serializers.ValidationError('Invalid image format. Allowed: JPEG, PNG, GIF, WebP')
        
        return value


class InventoryPhotoSerializer(serializers.ModelSerializer):
    """Serializer for photo-only updates"""
    class Meta:
        model = Inventory
        fields = ['id', 'photo']
        
    def validate_photo(self, value):
        """Validate photo file"""
        if value:
            # Check file size (max 5MB)
            if value.size > 5 * 1024 * 1024:
                raise serializers.ValidationError('Photo file size cannot exceed 5MB')
            
            # Check file type
            valid_types = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
            if value.content_type not in valid_types:
                raise serializers.ValidationError('Invalid image format. Allowed: JPEG, PNG, GIF, WebP')
        
        return value
