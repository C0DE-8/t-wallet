import { useState } from 'react'
import { FiArrowDown, FiArrowUpRight, FiPlus } from 'react-icons/fi'
import { IoScan, IoSwapHorizontal, IoTimeOutline, IoWallet } from 'react-icons/io5'
import ActionButton from '../../components/ActionButton/ActionButton'
import AssetList from '../../components/AssetList/AssetList'
import BottomNav from '../../components/BottomNav/BottomNav'
import {
  EarnSection,
  PerpsSection,
  PredictionsSection,
} from '../../components/MarketSections/MarketSections'
import PromoSlider from '../../components/PromoSlider/PromoSlider'
import TrustAi from '../../components/TrustAi/TrustAi'
import Watchlist from '../../components/Watchlist/Watchlist'

function WalletDashboard() {
  const [hideBalances, setHideBalances] = useState(true)

  return (
    <main className="app-screen dashboard-screen">
      <div className="dashboard-content">
        <header className="top-bar">
          <button
            className="balance-pill"
            type="button"
            onClick={() => setHideBalances((isHidden) => !isHidden)}
            aria-label={hideBalances ? 'Show balances' : 'Hide balances'}
          >
            <span className="wallet-glyph">
              <IoWallet />
            </span>
            <strong>Trader mode</strong>
          </button>
          <div className="top-actions">
            <button className="icon-button" type="button" aria-label="History">
              <IoTimeOutline />
            </button>
            <button className="icon-button" type="button" aria-label="Scan">
              <IoScan />
            </button>
          </div>
        </header>

        <PromoSlider />

        <section className="portfolio">
          <p className="portfolio-value">{hideBalances ? '*****' : '$120.58'}</p>
          <p className="portfolio-change">{hideBalances ? '*****' : '$0.00 (0.00%)'}</p>
        </section>

        <section className="quick-actions" aria-label="Wallet actions">
          <ActionButton label="Send" icon={<FiArrowUpRight />} />
          <ActionButton label="Receive" icon={<FiArrowDown />} />
          <ActionButton label="Swap" icon={<IoSwapHorizontal />} active />
          <ActionButton label="Buy" icon={<FiPlus />} />
        </section>

        <AssetList hideBalances={hideBalances} />
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
