function BottomNav() {
  return (
    <nav className="bottom-nav" aria-label="Primary">
      <div className="nav-group">
        <button className="selected" type="button" aria-label="Wallet">
          -
        </button>
        <button type="button" aria-label="Markets">
          /
        </button>
        <button type="button" aria-label="Swap">
          oo
        </button>
        <button type="button" aria-label="Explore">
          o
        </button>
      </div>
      <button className="search-fab" type="button" aria-label="Search">
        O
      </button>
    </nav>
  )
}

export default BottomNav
