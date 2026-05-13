import { Link } from 'react-router-dom';
import './Gallery.css';

function FavoritesBar({ title, subtitle, count, onClear }) {
  return (
    <section className="favorites-bar">
      <div>
        <p className="favorites-label">{title}</p>
        <h1>{subtitle}</h1>
      </div>

      <div className="favorites-actions">
        <span className="favorites-count">{count} улюблен{count === 1 ? 'е' : 'их'}</span>
        <Link className="button button--ghost" to="/favorites">
          Переглянути улюблені
        </Link>
        <button
          type="button"
          className="button button--secondary"
          onClick={onClear}
          disabled={count === 0}
        >
          Очистити улюблені
        </button>
      </div>
    </section>
  );
}

export default FavoritesBar;
