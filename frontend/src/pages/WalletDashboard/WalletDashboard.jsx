import { useEffect, useMemo, useRef, useState } from 'react'
import { FiArrowDown, FiArrowUpRight, FiPlus } from 'react-icons/fi'
import { IoScan, IoSwapHorizontal, IoTimeOutline, IoWallet } from 'react-icons/io5'
import { useLocation } from 'react-router-dom'
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
import { assets as defaultAssets, watchlist as defaultWatchlist } from '../../data/walletData'
import {
  formatCurrency,
  formatPercent,
  getUsdChange,
  getUsdRate,
  useCryptoRates,
} from '../../hooks/useCryptoRates'
import api from '../../api/axios'

function WalletDashboard() {
  const location = useLocation()
  const { rates, status } = useCryptoRates()
  const dashboardContentRef = useRef(null)
  const [isScrolled, setIsScrolled] = useState(false)
  
  const [hideBalances, setHideBalances] = useState(() => {
    return window.localStorage.getItem('trust-wallet-hide-balances') === 'true'
  })
  
  const [accountData, setAccountData] = useState(() => getInitialAccount(location.state?.account))
  const [balanceState, setBalanceState] = useState(() => {
    return getInitialAccount(location.state?.account)?.accountNumber
      ? { status: 'loading' }
      : { status: 'fallback' }
  })

  useEffect(() => {
    const accountNumber = accountData?.accountNumber

    if (!accountNumber) return undefined

    let isCurrent = true
    let intervalId

    async function fetchAccountBalances() {
      try {
        const response = await api.get(`/words/account/${accountNumber}/balance`, {
          validateStatus: (httpStatus) => httpStatus < 500,
        })

        if (!isCurrent) return

        if (response.status === 403) {
          setBalanceState({ status: 'fallback' })
          return false
        }

        if (!response.data.ok) {
          setBalanceState({ status: 'fallback' })
          return response.status !== 404
        }

        setAccountData((currentAccount) => {
          const freshAccount = {
            ...currentAccount,
            ...response.data.account,
          }

          window.localStorage.setItem('trust-wallet-account', JSON.stringify(freshAccount))
          return freshAccount
        })
        setBalanceState({ status: 'ready', message: '' })
        return true
      } catch {
        if (!isCurrent) return

        setBalanceState({ status: 'fallback' })
        return true
      }
    }

    fetchAccountBalances().then((shouldRefresh) => {
      if (isCurrent && shouldRefresh !== false) {
        intervalId = window.setInterval(fetchAccountBalances, 30000)
      }
    })

    return () => {
      isCurrent = false
      if (intervalId) {
        window.clearInterval(intervalId)
      }
    }
  }, [accountData?.accountNumber])

  const assets = useMemo(() => getAssetsForAccount(accountData), [accountData])

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
  const portfolioChangeLabel = `${formatCurrency(portfolioChange)} (${formatPercent(portfolioChangePercent)})`
  const accountTitle = accountData?.title || 'Trader mode'
  const balancePillLabel = isScrolled
    ? hideBalances ? '*****' : formatCurrency(portfolio.value)
    : accountTitle

  function updateScrolledState(scrollTop) {
    const nextScrolled = scrollTop > 12
    setIsScrolled((currentScrolled) => {
      return currentScrolled === nextScrolled ? currentScrolled : nextScrolled
    })
  }

  useEffect(() => {
    const scrollContainer = dashboardContentRef.current

    if (!scrollContainer) return undefined

    function handleScroll() {
      updateScrolledState(scrollContainer.scrollTop)
    }

    handleScroll()
    scrollContainer.addEventListener('scroll', handleScroll, { passive: true })

    return () => {
      scrollContainer.removeEventListener('scroll', handleScroll)
    }
  }, [])

  function toggleBalances() {
    setHideBalances((isHidden) => {
      const nextValue = !isHidden
      window.localStorage.setItem('trust-wallet-hide-balances', String(nextValue))
      return nextValue
    })
  }

  if (balanceState.status === 'loading') {
    return (
      <main className="app-screen dashboard-screen">
        <DashboardSkeleton />
        <BottomNav />
      </main>
    )
  }

  return (
    <main className="app-screen dashboard-screen">
      <div
        className="dashboard-content"
        ref={dashboardContentRef}
        onScroll={(event) => updateScrolledState(event.currentTarget.scrollTop)}
      >
        <header className={`top-bar ${isScrolled ? 'scrolled' : ''}`}>
          <button
            className="balance-pill"
            type="button"
          >
            <span className="wallet-glyph">
              <IoWallet />
            </span>
            <strong>{balancePillLabel}</strong>
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
          <p className="portfolio-value">
            {hideBalances ? '*****' : formatCurrency(portfolio.value)}
          </p>
          <p className="portfolio-change">
            {hideBalances ? '*****' : portfolioChangeLabel}
          </p>
        </button>

        <section className="quick-actions" aria-label="Wallet actions">
          <ActionButton label="Send" icon={<FiArrowUpRight />} />
          <ActionButton label="Receive" icon={<FiArrowDown />} />
          <ActionButton label="Swap" icon={<IoSwapHorizontal />} active />
          <ActionButton label="Buy" icon={<FiPlus />} />
        </section>

        <AssetList hideBalances={hideBalances} rates={rates} assets={assets} />
        <PerpsSection />
        <PredictionsSection />
        <EarnSection />
        <TrustAi />
        <Watchlist rates={rates} status={status} watchlist={defaultWatchlist} />
      </div>

      <BottomNav />
    </main>
  )
}

function DashboardSkeleton() {
  return (
    <div className="dashboard-content dashboard-skeleton" aria-label="Loading wallet data">
      <header className="top-bar">
        <span className="skeleton-pill" />
        <div className="top-actions">
          <span className="skeleton-icon" />
          <span className="skeleton-icon" />
        </div>
      </header>
      <span className="skeleton-banner" />
      <span className="skeleton-balance" />
      <span className="skeleton-line short" />
      <div className="skeleton-actions">
        <span />
        <span />
        <span />
        <span />
      </div>
      <section className="stack-section">
        <span className="skeleton-heading" />
        {[0, 1, 2, 3].map((item) => (
          <div className="asset-row skeleton-row" key={item}>
            <span className="skeleton-token" />
            <span className="skeleton-copy" />
            <span className="skeleton-value" />
          </div>
        ))}
      </section>
    </div>
  )
}

function getInitialAccount(routeAccount) {
  if (routeAccount) return routeAccount

  try {
    const storedAccount = window.localStorage.getItem('trust-wallet-account')
    return storedAccount ? JSON.parse(storedAccount) : null
  } catch {
    return null
  }
}

function getAssetsForAccount(accountData) {
  if (!accountData?.balances) return defaultAssets

  return defaultAssets.map((asset) => {
    const balance = accountData.balances[asset.ticker.toLowerCase()]

    if (balance === undefined) return asset

    return {
      ...asset,
      quantity: Number.parseFloat(balance) || 0,
    }
  })
}

export default WalletDashboard
