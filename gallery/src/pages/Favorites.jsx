import { useEffect, useState } from 'react';
import { inventoryApi } from '../services/inventoryApi';
import { useFavorites } from '../hooks/useFavorites';
import FavoritesBar from '../components/FavoritesBar';
import InventoryGallery from '../components/InventoryGallery';
import InventoryQuickView from '../components/InventoryQuickView';
import '../components/Gallery.css';

function Favorites() {
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
        const allItems = response.results || [];
        setItems(allItems.filter((item) => favoriteIds.includes(item.id)));
      } catch (err) {
        setError(err.message || 'Неможливо завантажити улюблені');
      } finally {
        setLoading(false);
      }
    };

    loadItems();
  }, [favoriteIds]);

  return (
    <div className="gallery-page">
      <FavoritesBar
        title="Улюблені"
        subtitle="Переглядайте свої улюблені товари і редагуйте їх."
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
        emptyMessage={favoriteIds.length === 0 ? 'У вас ще немає улюблених. Позначайте товари у галереї серцем.' : 'Немає улюблених товарів.'}
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

export default Favorites;
