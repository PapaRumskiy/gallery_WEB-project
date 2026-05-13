import './AdminInventory.css';

function InventoryTable({ items, loading, error, onView, onEdit, onDelete }) {
  if (loading) {
    return <div className="table-empty">Завантаження інвентарю...</div>;
  }

  if (error) {
    return <div className="table-empty table-empty--error">{error}</div>;
  }

  if (!items || items.length === 0) {
    return <div className="table-empty">Товарів не знайдено.</div>;
  }

  return (
    <div className="table-wrapper">
      <table className="inventory-table">
        <thead>
          <tr>
            <th>Назва</th>
            <th>Опис</th>
            <th>Фото</th>
            <th>Дії</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id}>
              <td>{item.inventory_name}</td>
              <td>{item.description || '—'}</td>
              <td>
                {item.photo ? (
                  <img className="item-image" src={item.photo} alt={item.inventory_name} />
                ) : (
                  <span className="image-placeholder">Немає фото</span>
                )}
              </td>
              <td>
                <div className="action-buttons">
                  <button type="button" className="button button--ghost" onClick={() => onView(item)}>
                    Переглянути
                  </button>
                  <button type="button" className="button button--ghost" onClick={() => onEdit(item)}>
                    Редагувати
                  </button>
                  <button type="button" className="button button--danger" onClick={() => onDelete(item)}>
                    Видалити
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default InventoryTable;
