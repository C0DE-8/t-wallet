import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  IoArrowBack,
  IoChevronForward,
  IoClose,
  IoDownloadOutline,
  IoInformation,
  IoKeyOutline,
  IoPencil,
  IoScan,
  IoSearch,
  IoSettingsOutline,
  IoShieldCheckmarkOutline,
  IoSparkles,
} from 'react-icons/io5'
import { SiBitcoin, SiCardano, SiDogecoin, SiEthereum, SiSolana } from 'react-icons/si'
import shieldIllustration from '../../assets/icons/shield.png'
import walletIllustration from '../../assets/icons/wallet.png'

const safetyChecks = [
  'Only you know this secret phrase.',
  'This secret phrase was NOT given to you by anyone, e.g. a company representative.',
  'If someone else has seen it, they can and will steal your funds.',
]

const networks = [
  { name: 'Bitcoin', icon: <SiBitcoin />, tone: 'orange' },
  { name: 'Ethereum', icon: <SiEthereum />, tone: 'blue' },
  { name: 'XRP', label: 'X', tone: 'dark' },
  { name: 'BNB Smart Chain', label: 'BNB', tone: 'yellow' },
  { name: 'Solana', icon: <SiSolana />, tone: 'violet' },
  { name: 'Dogecoin', icon: <SiDogecoin />, tone: 'gold' },
  { name: 'Cardano', icon: <SiCardano />, tone: 'blue' },
  { name: 'Tron', label: 'TRX', tone: 'red' },
  { name: 'Avalanche C-Chain', label: 'A', tone: 'red' },
]

function AddExistingWalletPage() {
  const navigate = useNavigate()
  const [step, setStep] = useState('wallets')
  const [showSafetySheet, setShowSafetySheet] = useState(false)
  const [checkedItems, setCheckedItems] = useState([])

  function openTrustWalletSite() {
    window.location.href = 'https://trustwallet.com/'
  }

  function toggleSafetyCheck(item) {
    setCheckedItems((items) => {
      return items.includes(item)
        ? items.filter((currentItem) => currentItem !== item)
        : [...items, item]
    })
  }

  function continueToNetworks() {
    setShowSafetySheet(false)
    setStep('network')
    setCheckedItems([])
  }

  function goBack() {
    if (showSafetySheet) {
      setShowSafetySheet(false)
      return
    }

    if (step === 'wallets') {
      return
    }

    if (step === 'add') {
      setStep('wallets')
      return
    }

    if (step === 'network') {
      setStep('add')
      return
    }

    setStep('network')
  }

  if (step === 'add') {
    return (
      <main className="app-screen add-wallet-screen">
        <FlowHeader title="Add existing wallet" onBack={goBack} />
        <section className="add-wallet-options">
          <h2>Most popular</h2>
          <button
            className="restore-option"
            type="button"
            onClick={() => setShowSafetySheet(true)}
          >
            <span className="restore-option-icon">
              <IoPencil />
            </span>
            <strong>Secret phrase</strong>
            <IoChevronForward className="chevron" />
          </button>
          <button className="restore-option" type="button">
            <span className="restore-option-icon">
              <IoKeyOutline />
            </span>
            <strong>Private key</strong>
            <IoChevronForward className="chevron" />
          </button>
          <button className="more-options" type="button">
            View more options
          </button>
        </section>

        {showSafetySheet && (
          <section className="secret-safety-backdrop" aria-label="Secret phrase safety">
            <div className="secret-safety-sheet">
              <button
                className="sheet-close"
                type="button"
                aria-label="Close"
                onClick={() => setShowSafetySheet(false)}
              >
                <IoClose />
              </button>
              <img
                className="safety-illustration"
                src={shieldIllustration}
                alt=""
              />
              <h2>Check your secret phrase is safe</h2>
              <div className="safety-checks">
                {safetyChecks.map((item) => (
                  <label className="safety-check" key={item}>
                    <input
                      type="checkbox"
                      checked={checkedItems.includes(item)}
                      onChange={() => toggleSafetyCheck(item)}
                    />
                    <span>{item}</span>
                  </label>
                ))}
              </div>
              <button
                className="continue-button"
                type="button"
                disabled={checkedItems.length !== safetyChecks.length}
                onClick={continueToNetworks}
              >
                Continue
              </button>
            </div>
          </section>
        )}
      </main>
    )
  }

  if (step === 'network') {
    return (
      <main className="app-screen network-screen">
        <FlowHeader
          title="Select network"
          onBack={goBack}
          action={
            <button className="icon-button muted" type="button" aria-label="Info">
              <IoInformation />
            </button>
          }
        />
        <div className="network-search">
          <IoSearch />
          <span>Search</span>
        </div>
        <button
          className="recommended-network"
          type="button"
          onClick={() => setStep('restore')}
        >
          <span className="recommended-network-badge">Recommended</span>
          <span className="multi-coin-icon">
            <IoShieldCheckmarkOutline />
          </span>
          <strong>Multi-coin wallet</strong>
          <IoChevronForward className="chevron" />
        </button>
        <section className="network-list">
          {networks.map((network) => (
            <button
              className="network-row"
              type="button"
              key={network.name}
              onClick={() => setStep('restore')}
            >
              <span className={`network-icon ${network.tone}`}>
                {network.icon || network.label}
              </span>
              <strong>{network.name}</strong>
              <IoChevronForward className="chevron" />
            </button>
          ))}
        </section>
      </main>
    )
  }

  if (step === 'restore') {
    return (
      <main className="app-screen restore-screen">
        <FlowHeader
          title="Multi-coin wallet"
          onBack={goBack}
          action={
            <button className="icon-button" type="button" aria-label="Scan">
              <IoScan />
            </button>
          }
        />
        <section className="restore-form">
          <label>
            <span>Wallet name</span>
            <div className="wallet-name-field">
              <input type="text" value="Main Wallet 1" readOnly />
              <IoClose className="wallet-name-clear" aria-hidden="true" />
            </div>
          </label>
          <label>
            <span>Secret phrase</span>
            <div className="secret-phrase-safe-box">
              <button type="button">Paste</button>
            </div>
          </label>
          <p>Typically 12 (sometimes 18, 24) words separated by single spaces</p>
        </section>
        <section className="restore-actions">
          <button className="continue-button" type="button" disabled onClick={() => navigate('/wallet')}>
            Restore wallet
          </button>
          <button className="secret-help" type="button" onClick={openTrustWalletSite}>
            What is a secret phrase?
          </button>
        </section>
      </main>
    )
  }

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
        <button className="option-row" type="button" onClick={openTrustWalletSite}>
          <span className="option-icon">
            <IoSparkles />
          </span>
          <span>
            <strong>Create new wallet</strong>
            <small>Secret phrase or FaceID / fingerprint</small>
          </span>
          <IoChevronForward className="chevron" />
        </button>
        <button className="option-row" type="button" onClick={() => setStep('add')}>
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

function FlowHeader({ title, onBack, action }) {
  return (
    <header className="flow-header">
      <button className="icon-button" type="button" aria-label="Back" onClick={onBack}>
        <IoArrowBack />
      </button>
      <h1>{title}</h1>
      {action || <span></span>}
    </header>
  )
}

export default AddExistingWalletPage
