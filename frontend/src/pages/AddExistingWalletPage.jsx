import { useNavigate } from 'react-router-dom'
import { BsThreeDotsVertical } from 'react-icons/bs'
import {
  IoChevronForward,
  IoClose,
  IoDownloadOutline,
  IoSettingsOutline,
  IoSparkles,
} from 'react-icons/io5'
import TokenIcon from '../components/TokenIcon'
import walletIllustration from '../assets/icons/wallet.png'

function AddExistingWalletPage() {
  const navigate = useNavigate()

  return (
    <main className="app-screen wallets-screen">
      <header className="wallets-header">
        <button className="icon-button" type="button" aria-label="Close">
          <IoClose />
        </button>
        <h1>Wallets</h1>
        <button className="icon-button" type="button" aria-label="Settings">
          <IoSettingsOutline />
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
            <BsThreeDotsVertical />
          </button>
        </div>
        <button className="backup-link" type="button">
          Back up manually
        </button>
      </section>

      <section className="wallet-choice-sheet" aria-label="Wallet setup options">
        <button className="sheet-close" type="button" aria-label="Close">
          <IoClose />
        </button>
        <img className="wallet-illustration" src={walletIllustration} alt="" />
        <button className="option-row" type="button">
          <span className="option-icon">
            <IoSparkles />
          </span>
          <span>
            <strong>Create new wallet</strong>
            <small>Secret phrase or FaceID / fingerprint</small>
          </span>
          <IoChevronForward className="chevron" />
        </button>
        <button className="option-row" type="button" onClick={() => navigate('/wallet')}>
          <span className="option-icon download">
            <IoDownloadOutline />
          </span>
          <span>
            <strong>Add existing wallet</strong>
            <small>Secret phrase, iCloud or view-only</small>
          </span>
          <IoChevronForward className="chevron" />
        </button>
      </section>
    </main>
  )
}

export default AddExistingWalletPage
