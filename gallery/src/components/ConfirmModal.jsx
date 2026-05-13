import './AdminInventory.css';

function ConfirmModal({ title, message, confirmLabel, cancelLabel, loading, onConfirm, onCancel }) {
  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true">
      <div className="modal-card modal-card--small">
        <div className="modal-header">
          <div>
            <h2>{title}</h2>
            <p>{message}</p>
          </div>
        </div>

        <div className="modal-actions">
          <button
            type="button"
            className="button button--danger"
            onClick={onConfirm}
            disabled={loading}
          >
            {loading ? 'Видалення...' : confirmLabel}
          </button>
          <button type="button" className="button button--ghost" onClick={onCancel} disabled={loading}>
            {cancelLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmModal;
