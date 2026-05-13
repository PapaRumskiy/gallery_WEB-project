/**
 * React Hooks for Inventory API
 * Place this file at: src/hooks/useInventory.js
 */

import { useState, useEffect, useCallback } from 'react';
import { inventoryService } from '../services/inventoryService';

/**
 * Hook for fetching and managing inventory items
 * 
 * @returns {Object} {
 *   items: Array,
 *   loading: boolean,
 *   error: string | null,
 *   refetch: Function,
 *   totalCount: number
 * }
 * 
 * @example
 * const { items, loading, error, refetch } = useInventory();
 * 
 * if (loading) return <div>Loading...</div>;
 * if (error) return <div>Error: {error}</div>;
 * 
 * return (
 *   <ul>
 *     {items.map(item => (
 *       <li key={item.id}>{item.inventory_name}</li>
 *     ))}
 *   </ul>
 * );
 */
export function useInventory() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalCount, setTotalCount] = useState(0);

  const refetch = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await inventoryService.getAllWithCount();
      setItems(data.results || []);
      setTotalCount(data.count || 0);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { items, loading, error, refetch, totalCount };
}

/**
 * Hook for fetching a single inventory item
 * 
 * @param {number} id - Item ID
 * @returns {Object} { item, loading, error, refetch }
 * 
 * @example
 * const { item, loading, error } = useInventoryItem(1);
 */
export function useInventoryItem(id) {
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const refetch = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await inventoryService.getById(id);
      setItem(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (id) {
      refetch();
    }
  }, [id, refetch]);

  return { item, loading, error, refetch };
}

/**
 * Hook for creating a new inventory item
 * 
 * @returns {Object} {
 *   create: Function,
 *   loading: boolean,
 *   error: string | null,
 *   success: boolean
 * }
 * 
 * @example
 * const { create, loading, error, success } = useCreateInventory();
 * 
 * const handleCreate = async () => {
 *   await create({
 *     inventory_name: 'New Item',
 *     description: 'Description',
 *     photo: fileInput.files[0]
 *   });
 * };
 */
export function useCreateInventory() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const create = useCallback(async (data) => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(false);
      
      const formData = new FormData();
      formData.append('inventory_name', data.inventory_name);
      if (data.description) {
        formData.append('description', data.description);
      }
      if (data.photo) {
        formData.append('photo', data.photo);
      }
      
      const response = await inventoryService.create(formData);
      setSuccess(true);
      return response.data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { create, loading, error, success };
}

/**
 * Hook for updating an inventory item
 * 
 * @returns {Object} {
 *   update: Function,
 *   loading: boolean,
 *   error: string | null,
 *   success: boolean
 * }
 * 
 * @example
 * const { update, loading, error } = useUpdateInventory();
 * 
 * const handleUpdate = async () => {
 *   await update(itemId, {
 *     inventory_name: 'Updated Name',
 *     description: 'New description'
 *   });
 * };
 */
export function useUpdateInventory() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const update = useCallback(async (id, data) => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(false);
      
      const response = await inventoryService.update(id, data);
      setSuccess(true);
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { update, loading, error, success };
}

/**
 * Hook for updating inventory photo
 * 
 * @returns {Object} {
 *   updatePhoto: Function,
 *   loading: boolean,
 *   error: string | null,
 *   success: boolean
 * }
 * 
 * @example
 * const { updatePhoto, loading, error } = useUpdatePhoto();
 * 
 * const handlePhotoUpdate = async () => {
 *   const formData = new FormData();
 *   formData.append('photo', fileInput.files[0]);
 *   await updatePhoto(itemId, formData);
 * };
 */
export function useUpdatePhoto() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const updatePhoto = useCallback(async (id, formData) => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(false);
      
      const response = await inventoryService.updatePhoto(id, formData);
      setSuccess(true);
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { updatePhoto, loading, error, success };
}

/**
 * Hook for deleting an inventory item
 * 
 * @returns {Object} {
 *   delete: Function,
 *   loading: boolean,
 *   error: string | null,
 *   success: boolean
 * }
 * 
 * @example
 * const { delete: deleteItem, loading } = useDeleteInventory();
 * 
 * const handleDelete = async () => {
 *   await deleteItem(itemId);
 * };
 */
export function useDeleteInventory() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const deleteItem = useCallback(async (id) => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(false);
      
      await inventoryService.delete(id);
      setSuccess(true);
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { delete: deleteItem, loading, error, success };
}

/**
 * Composite hook for full inventory management
 * 
 * @returns {Object} Object with all inventory operations
 * 
 * @example
 * const {
 *   items, loading, error, refetch,
 *   createItem, updateItem, updatePhoto, deleteItem
 * } = useInventoryManagement();
 */
export function useInventoryManagement() {
  const inventory = useInventory();
  const createOps = useCreateInventory();
  const updateOps = useUpdateInventory();
  const photoOps = useUpdatePhoto();
  const deleteOps = useDeleteInventory();

  return {
    // Fetch operations
    items: inventory.items,
    loading: inventory.loading,
    error: inventory.error,
    refetch: inventory.refetch,
    
    // CRUD operations
    createItem: createOps.create,
    updateItem: updateOps.update,
    updatePhoto: photoOps.updatePhoto,
    deleteItem: deleteOps.delete,
    
    // Status flags
    isCreating: createOps.loading,
    isUpdating: updateOps.loading,
    isDeleting: deleteOps.loading,
  };
}
