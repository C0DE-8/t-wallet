import { IoArrowBack, IoClose, IoScan } from 'react-icons/io5'

function MultiCoinWalletSection({
  walletName,
  secretPhrase,
  canRestore,
  onBack,
  onWalletNameChange,
  onWalletNameClear,
  onSecretPhraseChange,
  onPasteSecretPhrase,
  onRestoreWallet,
  onOpenSecretPhraseHelp,
}) {
  return (
    <main className="app-screen restore-screen">
      <FlowHeader
        title="Multi-coin wallet"
        onBack={onBack}
        action={
          <button className="icon-button" type="button" aria-label="Scan">
            <IoScan />
          </button>
        }
      />
      <section className="restore-form">
        <div className="restore-field">
          <label htmlFor="wallet-name">Wallet name</label>
          <div className="wallet-name-field">
            <input
              id="wallet-name"
              type="text"
              value={walletName}
              enterKeyHint="next"
              onChange={(event) => onWalletNameChange(event.target.value)}
            />
            <button
              className="wallet-name-clear"
              type="button"
              aria-label="Clear name"
              onClick={onWalletNameClear}
            >
              <IoClose aria-hidden="true" />
            </button>
          </div>
        </div>
        <div className="restore-field">
          <label htmlFor="secret-phrase">Secret phrase</label>
          <div className="secret-phrase-safe-box">
            <textarea
              id="secret-phrase"
              value={secretPhrase}
              spellCheck="false"
              autoCapitalize="none"
              autoComplete="off"
              autoCorrect="off"
              enterKeyHint="done"
              onChange={(event) => onSecretPhraseChange(event.target.value)}
            />
            <button type="button" onClick={onPasteSecretPhrase}>Paste</button>
          </div>
        </div>
        <p>Typically 12 (sometimes 18, 24) words separated by single spaces</p>
      </section>
      <section className="restore-actions">
        <button className="continue-button" type="button" disabled={!canRestore} onClick={onRestoreWallet}>
          Restore wallet
        </button>
        <button className="secret-help" type="button" onClick={onOpenSecretPhraseHelp}>
          What is a secret phrase?
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

export default MultiCoinWalletSection
