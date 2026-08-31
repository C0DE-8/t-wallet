function ActionButton({ label, icon, active = false }) {
  return (
    <button className={`action-button ${active ? 'active' : ''}`} type="button">
      <span>{icon}</span>
      <strong>{label}</strong>
    </button>
  )
}

export default ActionButton
