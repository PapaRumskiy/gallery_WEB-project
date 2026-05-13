import { useEffect, useState } from 'react';
import { inventoryApi } from '../services/inventoryApi';
import InventoryTable from './InventoryTable';
import InventoryForm from './InventoryForm';
import InventoryDetails from './InventoryDetails';
import ConfirmModal from './ConfirmModal';
import './AdminInventory.css';

function AdminInventory() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [detailsItem, setDetailsItem] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [statusMessage, setStatusMessage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [photoUpdating, setPhotoUpdating] = useState(false);
  const [photoError, setPhotoError] = useState(null);
  const [photoFile, setPhotoFile] = useState(null);

  const getAllInventory = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await inventoryApi.getAll();
      setItems(data.results || data || []);
    } catch (err) {
      setError(err.message || 'Неможливо завантажити інвентар');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllInventory();
  }, []);

  const clearSelection = () => {
    setSelectedItem(null);
    setPhotoFile(null);
    setPhotoError(null);
    setPhotoUpdating(false);
  };

  const handleCreate = async (formData) => {
    try {
      setIsSubmitting(true);
      setStatusMessage(null);
      const item = await inventoryApi.create(formData);
      setItems((current) => [item, ...current]);
      setStatusMessage('Товар додано');
      return item;
    } catch (err) {
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (item) => {
    setSelectedItem(item);
    setDetailsItem(null);
    setStatusMessage(null);
  };

  const handleView = (item) => {
    setDetailsItem(item);
    setSelectedItem(null);
    setStatusMessage(null);
  };

  const handleDelete = (item) => {
    setDeleteTarget(item);
    setStatusMessage(null);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) {
      return;
    }

    try {
      setIsSubmitting(true);
      await inventoryApi.delete(deleteTarget.id);
      setItems((current) => current.filter((item) => item.id !== deleteTarget.id));
      setStatusMessage('Товар видалено');
      setDeleteTarget(null);
    } catch (err) {
      setError(err.message || 'Delete failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateText = async (data) => {
    if (!selectedItem) {
      throw new Error('Не вибрано товар');
    }

    try {
      setIsSubmitting(true);
      setStatusMessage(null);
      const updated = await inventoryApi.update(selectedItem.id, data);
      setItems((current) => current.map((item) => (item.id === updated.id ? updated : item)));
      setSelectedItem(updated);
      setStatusMessage('Текст товара оновлено');
      return updated;
    } catch (err) {
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdatePhoto = async () => {
    if (!selectedItem) {
      setPhotoError('Виберіть товар для оновлення фото');
      return;
    }

    if (!photoFile) {
      setPhotoError('Виберіть файл фото');
      return;
    }

    try {
      setPhotoError(null);
      setPhotoUpdating(true);
      setStatusMessage(null);
      const formData = new FormData();
      formData.append('photo', photoFile);
      const updated = await inventoryApi.updatePhoto(selectedItem.id, formData);
      setItems((current) => current.map((item) => (item.id === updated.id ? updated : item)));
      setSelectedItem(updated);
      setPhotoFile(null);
      setStatusMessage('Фото товара оновлено');
      return updated;
    } catch (err) {
      setPhotoError(err.message || 'Фейл оновлення фото');
      throw err;
    } finally {
      setPhotoUpdating(false);
    }
  };

  const activeItem = selectedItem;

  return (
    <main className="admin-inventory">
      <header className="admin-header">
        <div>
          <h1>Адмін</h1>
          <p>Додавайте товари, завантажуйте фото та оновлюйте товари.</p>
        </div>
      </header>

      <section className="admin-summary">
        <div className="summary-card">
          <span>Всього товарів</span>
          <strong>{items.length}</strong>
        </div>
        <div className="summary-card summary-card--status">
          <span>Статус</span>
          <strong>{loading ? 'Завантаження' : error ? 'Помилка' : 'Готово'}</strong>
        </div>
      </section>

      <section className="admin-grid">
        <section className="admin-panel admin-panel--form">
          <div className="panel-header">
            <h2>{selectedItem ? 'Редагувати Інвентар' : 'Додати Інвентар'}</h2>
            {selectedItem && (
              <button type="button" className="button button--ghost" onClick={clearSelection}>
                Очистити вибір
              </button>
            )}
          </div>

          <InventoryForm
            key={selectedItem ? selectedItem.id : 'new'}
            initialData={selectedItem || { inventory_name: '', description: '' }}
            includePhoto={!selectedItem}
            loading={isSubmitting}
            error={null}
            submitLabel={selectedItem ? 'Оновити текст' : 'Додати товар'}
            onCancel={selectedItem ? clearSelection : undefined}
            onSubmit={selectedItem ? handleUpdateText : handleCreate}
          />

          {selectedItem && (
            <div className="photo-update-card">
              <h3>Оновити зображення</h3>
              <label className="field-label" htmlFor="photoUpload">
                Виберіть нове фото
              </label>
              <input
                id="photoUpload"
                type="file"
                accept="image/*"
                onChange={(event) => {
                  setPhotoError(null);
                  setPhotoFile(event.target.files?.[0] ?? null);
                }}
              />
              {photoError && <div className="form-error">{photoError}</div>}
              <button
                type="button"
                className="button button--secondary"
                onClick={handleUpdatePhoto}
                disabled={photoUpdating}
              >
                {photoUpdating ? 'Оновлення фото...' : 'Оновити фото'}
              </button>
            </div>
          )}

          {statusMessage && <div className="status-message">{statusMessage}</div>}
          {error && <div className="form-error">{error}</div>}
        </section>

        <section className="admin-panel admin-panel--table">
          <div className="panel-header">
            <h2>Список інвентарю</h2>
            <span className="small-text">Клікніть дію, щоб переглянути, редагувати або видалити.</span>
          </div>

          <InventoryTable
            items={items}
            loading={loading}
            error={error}
            onView={handleView}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </section>
      </section>

      {detailsItem && (
        <InventoryDetails item={detailsItem} onClose={() => setDetailsItem(null)} />
      )}

      {deleteTarget && (
        <ConfirmModal
          title="Confirm delete"
          message={`Delete inventory item “${deleteTarget.inventory_name}”? Це не можна скасувати.`}
          confirmLabel="Delete"
          cancelLabel="Cancel"
          loading={isSubmitting}
          onConfirm={handleDeleteConfirm}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </main>
  );
}

export default AdminInventory;
