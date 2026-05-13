function InventoryCard({ item, isFavorite, onToggleFavorite, onClick }) {
  return (
    <article className="inventory-card" onClick={onClick} role="button" tabIndex={0}>
      <div className="card-image-wrapper">
        <button
          type="button"
          className={`favorite-button ${isFavorite ? 'favorite-button--active' : ''}`}
          onClick={(event) => {
            event.stopPropagation();
            onToggleFavorite();
          }}
          aria-label={isFavorite ? 'Видали з улюблених' : 'Додати до улюблених'}
        >
          {isFavorite ? '❤️' : '🤍'}
        </button>

        {item.photo ? (
          <img className="card-image" src={item.photo} alt={item.inventory_name} />
        ) : (
          <div className="card-image-placeholder">Нема зображення</div>
        )}
      </div>

      <div className="card-content">
        <h3>{item.inventory_name}</h3>
        <p>{item.description || 'Нема опису.'}</p>
      </div>
    </article>
  );
}

export default InventoryCard;
