/**
 * Inventory API Service
 * 
 * This service provides methods to interact with the Django REST Framework
 * Inventory API endpoints. Use this in your React components.
 * 
 * Place this file at: src/services/inventoryService.js
 */

const API_BASE = 'http://localhost:8000/api';

/**
 * Handle API response
 */
const handleResponse = async (response) => {
  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.error || data.message || 'API Error');
  }
  
  return data;
};

/**
 * Inventory Service
 */
export const inventoryService = {
  /**
   * GET /inventory
   * Get all inventory items with pagination
   */
  async getAll(page = 1) {
    const response = await fetch(`${API_BASE}/inventory/?page=${page}`);
    return handleResponse(response);
  },

  /**
   * GET /inventory/list_with_count
   * Get all items with total count
   */
  async getAllWithCount() {
    const response = await fetch(`${API_BASE}/inventory/list_with_count/`);
    return handleResponse(response);
  },

  /**
   * GET /inventory/:id
   * Get single inventory item by ID
   */
  async getById(id) {
    const response = await fetch(`${API_BASE}/inventory/${id}/`);
    return handleResponse(response);
  },

  /**
   * POST /register
   * Create new inventory item with image
   * 
   * @param {Object} data - Item data
   * @param {string} data.inventory_name - Item name (required)
   * @param {string} data.description - Item description (optional)
   * @param {File} data.photo - Image file (required)
   * 
   * @example
   * const formData = new FormData();
   * formData.append('inventory_name', 'My Item');
   * formData.append('description', 'Item desc');
   * formData.append('photo', fileInput.files[0]);
   * 
   * const result = await inventoryService.create(formData);
   */
  async create(formData) {
    const response = await fetch(`${API_BASE}/register/`, {
      method: 'POST',
      body: formData,
    });
    return handleResponse(response);
  },

  /**
   * POST /inventory
   * Alternative endpoint for creating inventory item
   * (same as /register)
   */
  async createViaInventory(formData) {
    const response = await fetch(`${API_BASE}/inventory/`, {
      method: 'POST',
      body: formData,
    });
    return handleResponse(response);
  },

  /**
   * PUT /inventory/:id
   * Update inventory item (text fields only)
   * 
   * @param {number} id - Item ID
   * @param {Object} data - Fields to update
   * @param {string} data.inventory_name - New name (optional)
   * @param {string} data.description - New description (optional)
   * 
   * @example
   * await inventoryService.update(1, {
   *   inventory_name: 'Updated Name',
   *   description: 'Updated description'
   * });
   */
  async update(id, data) {
    const response = await fetch(`${API_BASE}/inventory/${id}/`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },

  /**
   * PATCH /inventory/:id
   * Partial update of inventory item
   * 
   * @param {number} id - Item ID
   * @param {Object} data - Fields to update
   * 
   * @example
   * await inventoryService.partialUpdate(1, {
   *   inventory_name: 'New Name'
   * });
   */
  async partialUpdate(id, data) {
    const response = await fetch(`${API_BASE}/inventory/${id}/`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },

  /**
   * PUT /inventory/:id/photo
   * Update only the photo of an inventory item
   * 
   * @param {number} id - Item ID
   * @param {File} photoFile - New image file
   * 
   * @example
   * const formData = new FormData();
   * formData.append('photo', fileInput.files[0]);
   * await inventoryService.updatePhoto(1, formData);
   */
  async updatePhoto(id, formData) {
    const response = await fetch(`${API_BASE}/inventory/${id}/photo/`, {
      method: 'PUT',
      body: formData,
    });
    return handleResponse(response);
  },

  /**
   * DELETE /inventory/:id
   * Delete inventory item
   * 
   * @param {number} id - Item ID
   */
  async delete(id) {
    const response = await fetch(`${API_BASE}/inventory/${id}/`, {
      method: 'DELETE',
    });
    
    // DELETE returns 204 No Content with empty body
    if (!response.ok && response.status !== 204) {
      const data = await response.json();
      throw new Error(data.error || data.message || 'Delete failed');
    }
    
    return { success: true };
  },
};

/**
 * Helper function to create FormData for item creation
 * 
 * @example
 * const formData = createItemFormData({
 *   inventory_name: 'My Item',
 *   description: 'Description',
 *   photo: fileInput.files[0]
 * });
 * const result = await inventoryService.create(formData);
 */
export const createItemFormData = ({ inventory_name, description, photo }) => {
  const formData = new FormData();
  formData.append('inventory_name', inventory_name);
  if (description) {
    formData.append('description', description);
  }
  if (photo) {
    formData.append('photo', photo);
  }
  return formData;
};

/**
 * Helper function to create FormData for photo update
 * 
 * @example
 * const formData = createPhotoFormData(fileInput.files[0]);
 * await inventoryService.updatePhoto(1, formData);
 */
export const createPhotoFormData = (photoFile) => {
  const formData = new FormData();
  formData.append('photo', photoFile);
  return formData;
};

/**
 * Helper function to validate image file
 * 
 * @param {File} file - File to validate
 * @returns {Object} { valid: boolean, error?: string }
 */
export const validateImageFile = (file) => {
  const maxSize = 5 * 1024 * 1024; // 5MB
  const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

  if (!file) {
    return { valid: false, error: 'No file selected' };
  }

  if (file.size > maxSize) {
    return { valid: false, error: 'File size exceeds 5MB' };
  }

  if (!validTypes.includes(file.type)) {
    return { valid: false, error: 'Invalid image format. Allowed: JPEG, PNG, GIF, WebP' };
  }

  return { valid: true };
};

/**
 * Hook usage example (React):
 * 
 * import { useState, useEffect } from 'react';
 * import { inventoryService } from '../services/inventoryService';
 * 
 * export function useInventory() {
 *   const [items, setItems] = useState([]);
 *   const [loading, setLoading] = useState(true);
 *   const [error, setError] = useState(null);
 * 
 *   const loadItems = async () => {
 *     try {
 *       setLoading(true);
 *       const data = await inventoryService.getAll();
 *       setItems(data.results || data);
 *       setError(null);
 *     } catch (err) {
 *       setError(err.message);
 *     } finally {
 *       setLoading(false);
 *     }
 *   };
 * 
 *   useEffect(() => {
 *     loadItems();
 *   }, []);
 * 
 *   return { items, loading, error, refetch: loadItems };
 * }
 */
