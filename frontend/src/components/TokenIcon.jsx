function TokenIcon({ tone, label }) {
  return <span className={`token-icon ${tone}`}>{label.slice(0, 1)}</span>
}

export default TokenIcon
