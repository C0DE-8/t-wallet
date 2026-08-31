import { BrowserRouter, Navigate, Route, Routes, useNavigate } from 'react-router-dom'
import './App.css'

const assets = [
  { name: 'Tether USD', ticker: 'USDT', amount: '120.6 USDT', value: '$120.58', tone: 'teal' },
  { name: 'Bitcoin', ticker: 'BTC', amount: '0 BTC', value: '$0.00', tone: 'orange' },
  { name: 'Ethereum', ticker: 'ETH', amount: '0 ETH', value: '$0.00', tone: 'blue' },
  { name: 'BNB', ticker: 'BNB', amount: '0 BNB', value: '$0.00', tone: 'yellow' },
  { name: 'Tron', ticker: 'TRX', amount: '0 TRX', value: '$0.00', tone: 'red' },
]

const watchlist = [
  { name: 'Solana', price: '$103.68', move: '-2.06%', tone: 'violet', trend: 'loss' },
  { name: 'BNB', price: '$691.33', move: '-1.22%', tone: 'yellow', trend: 'loss' },
  { name: 'Ethereum', price: '$2,478.41', move: '-1.06%', tone: 'blue', trend: 'loss' },
  { name: 'Bitcoin', price: '$78,932.12', move: '+0.04%', tone: 'orange', trend: 'gain' },
]

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AddExistingWalletPage />} />
        <Route path="/wallet" element={<WalletDashboard />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

function AddExistingWalletPage() {
  const navigate = useNavigate()

  return (
    <main className="app-screen wallets-screen">
      <header className="wallets-header">
        <button className="icon-button" type="button" aria-label="Close">
          X
        </button>
        <h1>Wallets</h1>
        <button className="icon-button" type="button" aria-label="Settings">
          *
        </button>
      </header>

      <section className="wallet-list" aria-label="Multi-coin wallets">
        <p className="section-kicker">Multi-coin wallets</p>
        <div className="wallet-card">
          <span className="token-icon shield">T</span>
          <div>
            <strong>Main Wallet</strong>
            <span>Multi-coin wallet</span>
          </div>
          <button className="more-button" type="button" aria-label="Wallet options">
            ...
          </button>
        </div>
        <button className="backup-link" type="button">
          Back up manually
        </button>
      </section>

      <section className="wallet-choice-sheet" aria-label="Wallet setup options">
        <button className="sheet-close" type="button" aria-label="Close">
          X
        </button>
        <div className="wallet-illustration" aria-hidden="true">
          <span className="orbit one"></span>
          <span className="orbit two"></span>
          <span className="device"></span>
          <span className="coin"></span>
        </div>
        <button className="option-row" type="button">
          <span className="option-icon">+</span>
          <span>
            <strong>Create new wallet</strong>
            <small>Secret phrase or FaceID / fingerprint</small>
          </span>
          <span className="chevron">&gt;</span>
        </button>
        <button className="option-row" type="button" onClick={() => navigate('/wallet')}>
          <span className="option-icon download">v</span>
          <span>
            <strong>Add existing wallet</strong>
            <small>Secret phrase, iCloud or view-only</small>
          </span>
          <span className="chevron">&gt;</span>
        </button>
      </section>
    </main>
  )
}

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

function ActionButton({ label, icon, active = false }) {
  return (
    <button className={`action-button ${active ? 'active' : ''}`} type="button">
      <span>{icon}</span>
      <strong>{label}</strong>
    </button>
  )
}

function AssetList() {
  return (
    <section className="stack-section">
      <h2>
        Tokens <span>&gt;</span>
      </h2>
      <div className="asset-list">
        {assets.map((asset) => (
          <div className="asset-row" key={asset.ticker}>
            <TokenIcon tone={asset.tone} label={asset.ticker} />
            <div className="asset-copy">
              <strong>{asset.name}</strong>
              <span>{asset.amount}</span>
            </div>
            <div className="asset-value">
              <strong>{asset.value}</strong>
              <span>$0.00</span>
            </div>
          </div>
        ))}
      </div>
      <button className="view-all" type="button">
        View all <span>&gt;</span>
      </button>
    </section>
  )
}

function PerpsSection() {
  return (
    <section className="stack-section clip-section">
      <h2>
        Perps <span>&gt;</span>
      </h2>
      <div className="card-row">
        <MarketCard ticker="BTC" meta="40x" sub="$2.96B Vol" tone="orange" />
        <MarketCard ticker="ETH" meta="25x" sub="$1.64B Vol" tone="blue" />
        <MarketCard ticker="HYPE" meta="10x" sub="$641M Vol" tone="teal" />
      </div>
    </section>
  )
}

function PredictionsSection() {
  return (
    <section className="stack-section clip-section">
      <h2>
        Predictions <span>&gt;</span>
      </h2>
      <div className="card-row prediction-row">
        <article className="prediction-card">
          <span className="flag-icon"></span>
          <small>Jan 1</small>
          <strong>Will the U.S. invade Iran before 2027?</strong>
        </article>
        <article className="prediction-card">
          <span className="globe-icon"></span>
          <strong>Earn on outcomes: politics, sports and more</strong>
        </article>
      </div>
    </section>
  )
}

function EarnSection() {
  return (
    <section className="stack-section clip-section">
      <h2>
        Earn <span>&gt;</span>
      </h2>
      <div className="card-row">
        <EarnCard apy="22.32% APY" token="JUNO" tone="red" />
        <EarnCard apy="15.34% APY" token="KSM" tone="dark" />
        <EarnCard apy="15.00% APY" token="LUNA" tone="yellow" />
      </div>
    </section>
  )
}

function TrustAi() {
  return (
    <section className="trust-ai">
      <strong>+ Trust Wallet AI</strong>
      <button type="button">Ask anything &gt;</button>
    </section>
  )
}

function Watchlist() {
  return (
    <section className="stack-section watchlist">
      <h2>
        Watchlist <span>&gt;</span>
      </h2>
      {watchlist.map((item) => (
        <div className="asset-row" key={item.name}>
          <TokenIcon tone={item.tone} label={item.name.slice(0, 3)} />
          <div className="asset-copy">
            <strong>{item.name}</strong>
          </div>
          <div className="asset-value">
            <strong>{item.price}</strong>
            <span className={item.trend}>{item.move}</span>
          </div>
        </div>
      ))}
    </section>
  )
}

function MarketCard({ ticker, meta, sub, tone }) {
  return (
    <article className="market-card">
      <TokenIcon tone={tone} label={ticker} />
      <strong>
        {ticker} <span>{meta}</span>
      </strong>
      <small>{sub}</small>
    </article>
  )
}

function EarnCard({ apy, token, tone }) {
  return (
    <article className="market-card">
      <TokenIcon tone={tone} label={token} />
      <strong>{apy}</strong>
      <small>on {token}</small>
    </article>
  )
}

function TokenIcon({ tone, label }) {
  return <span className={`token-icon ${tone}`}>{label.slice(0, 1)}</span>
}

function BottomNav() {
  return (
    <nav className="bottom-nav" aria-label="Primary">
      <div className="nav-group">
        <button className="selected" type="button" aria-label="Wallet">
          -
        </button>
        <button type="button" aria-label="Markets">
          /
        </button>
        <button type="button" aria-label="Swap">
          oo
        </button>
        <button type="button" aria-label="Explore">
          o
        </button>
      </div>
      <button className="search-fab" type="button" aria-label="Search">
        O
      </button>
    </nav>
  )
}

export default App
