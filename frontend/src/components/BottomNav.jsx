import { FiCompass, FiSearch, FiTrendingUp } from 'react-icons/fi'
import { IoInfinite, IoWallet } from 'react-icons/io5'

function BottomNav() {
  return (
    <nav className="bottom-nav" aria-label="Primary">
      <div className="nav-group">
        <button className="selected" type="button" aria-label="Wallet">
          <IoWallet />
        </button>
        <button type="button" aria-label="Markets">
          <FiTrendingUp />
        </button>
        <button type="button" aria-label="Swap">
          <IoInfinite />
        </button>
        <button type="button" aria-label="Explore">
          <FiCompass />
        </button>
      </div>
      <button className="search-fab" type="button" aria-label="Search">
        <FiSearch />
      </button>
    </nav>
  )
}

export default BottomNav
