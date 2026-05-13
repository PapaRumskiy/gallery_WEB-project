import './AdminInventory.css';

function InventoryDetails({ item, onClose }) {
  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true">
      <div className="modal-card">
        <div className="modal-header">
          <div>
            <h2>Деталі</h2>
            <p>Можете подивитисє на вибране</p>
          </div>
          <button type="button" className="button button--ghost" onClick={onClose}>
            Закрити
          </button>
        </div>

        <div className="detail-grid">
          <div className="detail-row">
            <span className="detail-label">Назва</span>
            <span>{item.inventory_name}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Опис</span>
            <span>{item.description || 'Опис не надано'}</span>
          </div>
          <div className="detail-row detail-row--image">
            <span className="detail-label">Фото</span>
            {item.photo ? (
              <img className="detail-image" src={item.photo} alt={item.inventory_name} />
            ) : (
              <span className="image-placeholder">Зображення недоступне</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default InventoryDetails;
