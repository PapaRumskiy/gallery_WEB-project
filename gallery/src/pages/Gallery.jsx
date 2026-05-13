import { useEffect, useState } from 'react';
import { inventoryApi } from '../services/inventoryApi';
import { useFavorites } from '../hooks/useFavorites';
import FavoritesBar from '../components/FavoritesBar';
import InventoryGallery from '../components/InventoryGallery';
import InventoryQuickView from '../components/InventoryQuickView';
import '../components/Gallery.css';

function Gallery() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const { favoriteIds, toggleFavorite, clearFavorites, isFavorite } = useFavorites();

  useEffect(() => {
    const loadItems = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await inventoryApi.getAll();
        setItems(response.results || []);
      } catch (err) {
        setError(err.message || 'Неможливо завантажити товари галереї');
      } finally {
        setLoading(false);
      }
    };

    loadItems();
  }, []);

  return (
    <div className="gallery-page">
      <FavoritesBar
        title="Галерея"
        subtitle="Переглядайте товари і вибирайте шо хочете змінити."
        count={favoriteIds.length}
        onClear={clearFavorites}
      />

      <InventoryGallery
        items={items}
        loading={loading}
        error={error}
        favoriteIds={favoriteIds}
        onToggleFavorite={toggleFavorite}
        onCardClick={setSelectedItem}
      />

      {selectedItem && (
        <InventoryQuickView
          item={selectedItem}
          isFavorite={isFavorite(selectedItem.id)}
          onClose={() => setSelectedItem(null)}
          onToggleFavorite={() => toggleFavorite(selectedItem.id)}
        />
      )}
    </div>
  );
}

export default Gallery;
