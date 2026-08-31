import TokenIcon from './TokenIcon'

export function PerpsSection() {
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

export function PredictionsSection() {
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

export function EarnSection() {
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
