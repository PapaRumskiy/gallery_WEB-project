import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api';
const MEDIA_HOST = 'http://localhost:8000';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    Accept: 'application/json',
  },
  timeout: 15000,
});

const buildError = (error) => {
  if (axios.isAxiosError(error) && error.response) {
    const responseData = error.response.data || {};
    const message = responseData.error || responseData.message || 'API request failed';
    const err = new Error(message);
    err.status = error.response.status;
    if (responseData.details) {
      err.details = responseData.details;
    }
    return err;
  }

  return error instanceof Error ? error : new Error(String(error));
};

const ensureAbsoluteImageUrl = (photoUrl) => {
  if (!photoUrl || typeof photoUrl !== 'string') {
    return photoUrl;
  }

  if (photoUrl.startsWith('http://') || photoUrl.startsWith('https://')) {
    return photoUrl;
  }

  if (photoUrl.startsWith('/')) {
    return `${MEDIA_HOST}${photoUrl}`;
  }

  return photoUrl;
};

const normalizeInventoryItem = (item) => {
  if (!item || typeof item !== 'object') {
    return item;
  }

  return {
    ...item,
    photo: ensureAbsoluteImageUrl(item.photo),
  };
};

const normalizeListResponse = (data) => {
  if (data && Array.isArray(data.results)) {
    return {
      ...data,
      results: data.results.map(normalizeInventoryItem),
    };
  }

  if (Array.isArray(data)) {
    return data.map(normalizeInventoryItem);
  }

  return data;
};

export const inventoryApi = {
  async getAll(params = {}) {
    try {
      const response = await apiClient.get('/inventory/', { params });
      return normalizeListResponse(response.data);
    } catch (error) {
      throw buildError(error);
    }
  },

  async getById(id) {
    try {
      const response = await apiClient.get(`/inventory/${id}/`);
      return normalizeInventoryItem(response.data);
    } catch (error) {
      throw buildError(error);
    }
  },

  async create(formData) {
    if (!(formData instanceof FormData)) {
      throw new Error('create() requires a FormData instance');
    }

    try {
      const response = await apiClient.post('/register/', formData);
      const result = response.data?.data ?? response.data;
      return normalizeInventoryItem(result);
    } catch (error) {
      throw buildError(error);
    }
  },

  async update(id, data) {
    try {
      const response = await apiClient.put(`/inventory/${id}/`, data);
      return normalizeInventoryItem(response.data);
    } catch (error) {
      throw buildError(error);
    }
  },

  async updatePhoto(id, formData) {
    if (!(formData instanceof FormData)) {
      throw new Error('updatePhoto() requires a FormData instance');
    }

    try {
      const response = await apiClient.put(`/inventory/${id}/photo/`, formData);
      return normalizeInventoryItem(response.data);
    } catch (error) {
      throw buildError(error);
    }
  },

  async delete(id) {
    try {
      const response = await apiClient.delete(`/inventory/${id}/`);
      if (response.status === 204) {
        return { success: true };
      }
      return response.data;
    } catch (error) {
      throw buildError(error);
    }
  },
};

export const createInventoryFormData = ({ inventory_name, description, photo }) => {
  const formData = new FormData();
  formData.append('inventory_name', inventory_name);

  if (description !== undefined && description !== null) {
    formData.append('description', description);
  }

  if (photo) {
    formData.append('photo', photo);
  }

  return formData;
};

export const createPhotoFormData = (photo) => {
  const formData = new FormData();
  formData.append('photo', photo);
  return formData;
};
