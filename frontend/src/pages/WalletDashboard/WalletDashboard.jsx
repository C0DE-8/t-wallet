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
import { assets } from '../../data/walletData'
import {
  formatCurrency,
  formatPercent,
  getUsdChange,
  getUsdRate,
  useCryptoRates,
} from '../../hooks/useCryptoRates'

function WalletDashboard() {
  const { rates, status } = useCryptoRates()
  const [hideBalances, setHideBalances] = useState(() => {
    return window.localStorage.getItem('trust-wallet-hide-balances') === 'true'
  })
  const portfolio = assets.reduce(
    (summary, asset) => {
      const price = getUsdRate(rates, asset.coingeckoId)
      const change = getUsdChange(rates, asset.coingeckoId)

      if (!Number.isFinite(price)) return summary

      const value = asset.quantity * price
      const previousValue = Number.isFinite(change)
        ? value / (1 + change / 100)
        : value

      return {
        value: summary.value + value,
        previousValue: summary.previousValue + previousValue,
      }
    },
    { value: 0, previousValue: 0 },
  )
  const portfolioChange = portfolio.value - portfolio.previousValue
  const portfolioChangePercent = portfolio.previousValue > 0
    ? (portfolioChange / portfolio.previousValue) * 100
    : 0
  const ratesLabel = status === 'error' ? 'Rates unavailable' : 'Live rates'
  const portfolioChangeLabel = `${formatCurrency(portfolioChange)} (${formatPercent(portfolioChangePercent)}) · ${ratesLabel}`

  function toggleBalances() {
    setHideBalances((isHidden) => {
      const nextValue = !isHidden
      window.localStorage.setItem('trust-wallet-hide-balances', String(nextValue))

      return nextValue
    })
  }

  return (
    <main className="app-screen dashboard-screen">
      <div className="dashboard-content">
        <header className="top-bar">
          <button
            className="balance-pill"
            type="button"
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

        <button
          className="portfolio"
          type="button"
          onClick={toggleBalances}
          aria-label={hideBalances ? 'Show balances' : 'Hide balances'}
        >
          <p className="portfolio-value">{hideBalances ? '*****' : formatCurrency(portfolio.value)}</p>
          <p className="portfolio-change">{hideBalances ? '*****' : portfolioChangeLabel}</p>
        </button>

        <section className="quick-actions" aria-label="Wallet actions">
          <ActionButton label="Send" icon={<FiArrowUpRight />} />
          <ActionButton label="Receive" icon={<FiArrowDown />} />
          <ActionButton label="Swap" icon={<IoSwapHorizontal />} active />
          <ActionButton label="Buy" icon={<FiPlus />} />
        </section>

        <AssetList hideBalances={hideBalances} rates={rates} />
        <PerpsSection />
        <PredictionsSection />
        <EarnSection />
        <TrustAi />
        <Watchlist rates={rates} status={status} />
      </div>

      <BottomNav />
    </main>
  )
}

export default WalletDashboard
