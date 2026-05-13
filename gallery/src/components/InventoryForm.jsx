import { useEffect, useState } from 'react';
import './AdminInventory.css';

function InventoryForm({ initialData, includePhoto, loading, error, submitLabel, onSubmit, onCancel }) {
  const [inventoryName, setInventoryName] = useState(initialData.inventory_name || '');
  const [description, setDescription] = useState(initialData.description || '');
  const [photo, setPhoto] = useState(null);
  const [localError, setLocalError] = useState(null);

  useEffect(() => {
    setInventoryName(initialData.inventory_name || '');
    setDescription(initialData.description || '');
    setPhoto(null);
    setLocalError(null);
  }, [initialData]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLocalError(null);

    if (!inventoryName.trim()) {
      setLocalError(`Назва обов'язкова`);
      return;
    }

    try {
      if (includePhoto) {
        const formData = new FormData();
        formData.append('inventory_name', inventoryName.trim());
        formData.append('description', description.trim());
        if (photo) {
          formData.append('photo', photo);
        }
        await onSubmit(formData);
      } else {
        await onSubmit({ inventory_name: inventoryName.trim(), description: description.trim() });
      }
    } catch (submitError) {
      setLocalError(submitError.message || 'Save failed');
    }
  };

  return (
    <form className="inventory-form" onSubmit={handleSubmit}>
      <label className="field-label">
        Назва
        <input
          value={inventoryName}
          onChange={(event) => setInventoryName(event.target.value)}
          placeholder="Введіть назву товара"
          disabled={loading}
        />
      </label>

      <label className="field-label">
        Опис
        <textarea
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          placeholder="Введіть короткий опис"
          rows={4}
          disabled={loading}
        />
      </label>

      {includePhoto && (
        <label className="field-label">
          Фото
          <input
            type="file"
            accept="image/*"
            onChange={(event) => setPhoto(event.target.files?.[0] ?? null)}
            disabled={loading}
          />
        </label>
      )}

      {(localError || error) && (
        <div className="form-error">{localError || error}</div>
      )}

      <div className="form-actions">
        <button className="button button--primary" type="submit" disabled={loading}>
          {loading ? 'Збереження...' : submitLabel}
        </button>
        {onCancel && (
          <button className="button button--ghost" type="button" onClick={onCancel} disabled={loading}>
            Скасувати
          </button>
        )}
      </div>
    </form>
  );
}

export default InventoryForm;
