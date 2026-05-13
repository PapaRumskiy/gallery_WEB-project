import './Gallery.css';

function InventoryQuickView({ item, onClose, onToggleFavorite, isFavorite }) {
  return (
    <div className="quickview-backdrop" role="dialog" aria-modal="true">
      <div className="quickview-modal">
        <button type="button" className="quickview-close" onClick={onClose}>
          Закрити
        </button>

        <div className="quickview-image-wrapper">
          <button
            type="button"
            className={`favorite-button ${isFavorite ? 'favorite-button--active' : ''}`}
            onClick={(event) => {
              event.stopPropagation();
              onToggleFavorite();
            }}
            aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          >
            {isFavorite ? '❤️' : '🤍'}
          </button>

          {item.photo ? (
            <img className="quickview-image" src={item.photo} alt={item.inventory_name} />
          ) : (
            <div className="quickview-image-placeholder">Зображення недоступне</div>
          )}
        </div>

        <div className="quickview-content">
          <div className="quickview-header">
            <h2>{item.inventory_name}</h2>
          </div>
          <p>{item.description || 'Опис не надано.'}</p>
        </div>
      </div>
    </div>
  );
}

export default InventoryQuickView;
