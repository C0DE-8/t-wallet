function ActionButton({ label, icon, active = false, onClick }) {
  return (
    <button
      className={`action-button ${active ? 'active' : ''}`}
      type="button"
      onClick={() => onClick?.(label)}
    >
      <span>{icon}</span>
      <strong>{label}</strong>
    </button>
  )
}

export default ActionButton
