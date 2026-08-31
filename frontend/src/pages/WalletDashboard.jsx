import ActionButton from '../components/ActionButton'
import AssetList from '../components/AssetList'
import BottomNav from '../components/BottomNav'
import { EarnSection, PerpsSection, PredictionsSection } from '../components/MarketSections'
import TrustAi from '../components/TrustAi'
import Watchlist from '../components/Watchlist'

function WalletDashboard() {
  return (
    <main className="app-screen dashboard-screen">
      <div className="dashboard-content">
        <header className="top-bar">
          <button className="balance-pill" type="button">
            <span className="wallet-glyph"></span>
            <strong>trader mode</strong>
          </button>
          <div className="top-actions">
            <button className="icon-button" type="button" aria-label="History">
              @
            </button>
            <button className="icon-button" type="button" aria-label="Scan">
              []
            </button>
          </div>
        </header>

        <section className="promo-card">
          <span className="hyper-icon">oo</span>
          <div>
            <strong>Explore Hyperliquid: 200+ markets live</strong>
            <span>Explore now</span>
          </div>
        </section>

        <section className="portfolio">
          <p className="portfolio-value">$120.58</p>
          <p className="portfolio-change">$0.00 (0.00%)</p>
        </section>

        <section className="quick-actions" aria-label="Wallet actions">
          <ActionButton label="Send" icon="/" />
          <ActionButton label="Receive" icon="v" />
          <ActionButton label="Swap" icon="~" active />
          <ActionButton label="Buy" icon="+" />
        </section>

        <AssetList />
        <PerpsSection />
        <PredictionsSection />
        <EarnSection />
        <TrustAi />
        <Watchlist />
      </div>

      <BottomNav />
    </main>
  )
}

export default WalletDashboard
