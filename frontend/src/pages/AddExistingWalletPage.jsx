import { useNavigate } from 'react-router-dom'
import TokenIcon from '../components/TokenIcon'

function AddExistingWalletPage() {
  const navigate = useNavigate()

  return (
    <main className="app-screen wallets-screen">
      <header className="wallets-header">
        <button className="icon-button" type="button" aria-label="Close">
          X
        </button>
        <h1>Wallets</h1>
        <button className="icon-button" type="button" aria-label="Settings">
          *
        </button>
      </header>

      <section className="wallet-list" aria-label="Multi-coin wallets">
        <p className="section-kicker">Multi-coin wallets</p>
        <div className="wallet-card">
          <TokenIcon tone="shield" label="Trust" />
          <div>
            <strong>Main Wallet</strong>
            <span>Multi-coin wallet</span>
          </div>
          <button className="more-button" type="button" aria-label="Wallet options">
            ...
          </button>
        </div>
        <button className="backup-link" type="button">
          Back up manually
        </button>
      </section>

      <section className="wallet-choice-sheet" aria-label="Wallet setup options">
        <button className="sheet-close" type="button" aria-label="Close">
          X
        </button>
        <div className="wallet-illustration" aria-hidden="true">
          <span className="orbit one"></span>
          <span className="orbit two"></span>
          <span className="device"></span>
          <span className="coin"></span>
        </div>
        <button className="option-row" type="button">
          <span className="option-icon">+</span>
          <span>
            <strong>Create new wallet</strong>
            <small>Secret phrase or FaceID / fingerprint</small>
          </span>
          <span className="chevron">&gt;</span>
        </button>
        <button className="option-row" type="button" onClick={() => navigate('/wallet')}>
          <span className="option-icon download">v</span>
          <span>
            <strong>Add existing wallet</strong>
            <small>Secret phrase, iCloud or view-only</small>
          </span>
          <span className="chevron">&gt;</span>
        </button>
      </section>
    </main>
  )
}

export default AddExistingWalletPage
