// A single resource listing, rendered as a rounded equipment card.
const TYPE_EMOJI = {
  tractor: '🚜',
  harvester: '🌾',
  pump: '💧',
  rotavator: '⚙️',
  trailer: '🛻',
  service: '🔧',
};

export default function ResourceCard({ resource, onBook, showBook = true }) {
  return (
    <div className="equipment-card">
      <div className="equipment-card-media">
        <span className="equipment-card-tag">{resource.type}</span>
        {TYPE_EMOJI[resource.type] || '🧰'}
      </div>
      <div className="equipment-card-body">
        <div className="equipment-card-title">{resource.type}</div>
        <div className="equipment-card-meta">
          {resource.provider_name}{resource.provider_region ? ` · ${resource.provider_region}` : ''}
        </div>
        {resource.description && <p className="equipment-card-desc">{resource.description}</p>}
        <div className="equipment-card-price">
          <span>₹{resource.usage_charge}<span style={{ fontWeight: 400, color: 'var(--ink-soft)' }}>/day</span></span>
          {resource.times_booked > 0 && (
            <span className="helper-text" style={{ fontSize: '0.76rem' }}>{resource.times_booked}× booked</span>
          )}
        </div>
      </div>
      {showBook && (
        <div className="equipment-card-footer">
          <button type="button" className="btn btn-primary btn-block btn-sm" onClick={() => onBook(resource)}>
            Book now
          </button>
        </div>
      )}
    </div>
  );
}
