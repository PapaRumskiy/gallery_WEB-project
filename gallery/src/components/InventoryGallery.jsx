import InventoryCard from './InventoryCard';

function InventoryGallery({ items, loading, error, favoriteIds, onToggleFavorite, onCardClick, emptyMessage }) {
  if (loading) {
    return (
      <div className="gallery-grid gallery-grid--loading">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="card card--skeleton">
            <div className="card-image-skeleton"></div>
            <div className="card-text-skeleton"></div>
            <div className="card-text-skeleton short"></div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return <div className="gallery-empty gallery-empty--error">{error}</div>;
  }

  if (!items || items.length === 0) {
    return <div className="gallery-empty">{emptyMessage || 'Немає елементів у галереї.'}</div>;
  }

  return (
    <div className="gallery-grid">
      {items.map((item) => (
        <InventoryCard
          key={item.id}
          item={item}
          isFavorite={favoriteIds.includes(item.id)}
          onToggleFavorite={() => onToggleFavorite(item.id)}
          onClick={() => onCardClick(item)}
        />
      ))}
    </div>
  );
}

export default InventoryGallery;
