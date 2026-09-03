import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  IoArrowBack,
  IoChevronForward,
  IoClose,
  IoDownloadOutline,
  IoInformation,
  IoKeyOutline,
  IoPencil,
  IoSearch,
  IoSettingsOutline,
  IoShieldCheckmarkOutline,
  IoSparkles,
} from 'react-icons/io5'
import { SiBitcoin, SiCardano, SiDogecoin, SiEthereum, SiSolana } from 'react-icons/si'
import shieldIllustration from '../../assets/icons/shield.png'
import walletIllustration from '../../assets/icons/wallet.png'
import MultiCoinWalletSection from './MultiCoinWalletSection'

const safetyChecks = [
  'Only you know this secret phrase.',
  'This secret phrase was NOT given to you by anyone, e.g. a company representative.',
  'If someone else has seen it, they can and will steal your funds.',
]

const validSecretPhraseWordCounts = [12, 18, 24]
const savedFlowStorageKey = 'trust-wallet:add-existing-wallet-flow'
const flowSteps = ['wallets', 'add', 'network', 'restore']

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
  const [savedFlow] = useState(getSavedFlowState)
  const [step, setStep] = useState(savedFlow.step)
  const [showSafetySheet, setShowSafetySheet] = useState(savedFlow.showSafetySheet)
  const [checkedItems, setCheckedItems] = useState(savedFlow.checkedItems)
  const [walletName, setWalletName] = useState(savedFlow.walletName)
  const [secretPhrase, setSecretPhrase] = useState('')

  const phraseWordCount = secretPhrase.trim().split(/\s+/).filter(Boolean).length
  const canRestore = walletName.trim().length > 0 && validSecretPhraseWordCounts.includes(phraseWordCount)

  useEffect(() => {
    saveFlowState({
      step,
      showSafetySheet,
      checkedItems,
      walletName,
    })
  }, [step, showSafetySheet, checkedItems, walletName])

  function openTrustWalletSite() {
    window.location.href = 'https://trustwallet.com/'
  }

  async function pasteSecretPhrase() {
    try {
      const pastedPhrase = await navigator.clipboard?.readText()

      if (pastedPhrase) {
        setSecretPhrase(pastedPhrase)
      }
    } catch {
      // Clipboard access can be denied depending on browser permissions.
    }
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

  function restoreWallet() {
    if (canRestore) {
      clearSavedFlowState()
      navigate('/wallet')
    }
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
      <MultiCoinWalletSection
        walletName={walletName}
        secretPhrase={secretPhrase}
        canRestore={canRestore}
        onBack={goBack}
        onWalletNameChange={setWalletName}
        onWalletNameClear={() => setWalletName('')}
        onSecretPhraseChange={setSecretPhrase}
        onPasteSecretPhrase={pasteSecretPhrase}
        onRestoreWallet={restoreWallet}
        onOpenSecretPhraseHelp={openTrustWalletSite}
      />
    )
  }

  return (
    <main className="app-screen wallets-screen">
      <header className="wallets-header">
        <button
          className="icon-button"
          type="button"
          aria-label="Close"
          onClick={() => navigate('/')}
        >
          <IoClose />
        </button>
        <h1>Wallets</h1>
        <button className="icon-button" type="button" aria-label="Settings">
          <IoSettingsOutline />
        </button>
      </header>

      <section className="wallet-choice-sheet" aria-label="Wallet setup options">
        <button
          className="sheet-close"
          type="button"
          aria-label="Close"
          onClick={() => navigate('/')}
        >
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

function getSavedFlowState() {
  const fallbackState = {
    step: 'wallets',
    showSafetySheet: false,
    checkedItems: [],
    walletName: 'Main Wallet 1',
  }

  try {
    const savedFlow = JSON.parse(localStorage.getItem(savedFlowStorageKey))

    if (!savedFlow || !flowSteps.includes(savedFlow.step)) {
      return fallbackState
    }

    return {
      step: savedFlow.step,
      showSafetySheet: Boolean(savedFlow.showSafetySheet && savedFlow.step === 'add'),
      checkedItems: Array.isArray(savedFlow.checkedItems)
        ? savedFlow.checkedItems.filter((item) => safetyChecks.includes(item))
        : [],
      walletName: typeof savedFlow.walletName === 'string'
        ? savedFlow.walletName
        : fallbackState.walletName,
    }
  } catch {
    return fallbackState
  }
}

function saveFlowState(flowState) {
  try {
    localStorage.setItem(savedFlowStorageKey, JSON.stringify(flowState))
  } catch {
    // Browsers can block storage in private or restricted contexts.
  }
}

function clearSavedFlowState() {
  try {
    localStorage.removeItem(savedFlowStorageKey)
  } catch {
    // Browsers can block storage in private or restricted contexts.
  }
}

export default AddExistingWalletPage
