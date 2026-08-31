import { useNavigate } from 'react-router-dom'
import {
  IoChevronForward,
  IoClose,
  IoDownloadOutline,
  IoSettingsOutline,
  IoSparkles,
} from 'react-icons/io5'
import walletIllustration from '../../assets/icons/wallet.png'

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
