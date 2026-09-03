import { watchlist } from '../../data/walletData'
import { formatCurrency, formatPercent, getUsdChange, getUsdRate } from '../../hooks/useCryptoRates'
import TokenIcon from '../TokenIcon/TokenIcon'

function Watchlist({ rates, status }) {
  return (
    <section className="stack-section watchlist">
      <h2>
        Watchlist <span>&gt;</span>
      </h2>
      {watchlist.map((item) => {
        const price = getUsdRate(rates, item.coingeckoId)
        const move = getUsdChange(rates, item.coingeckoId)
        const trend = move >= 0 ? 'gain' : 'loss'
        const hasLiveRate = Number.isFinite(price)

        return (
          <div className="asset-row" key={item.name}>
            <TokenIcon tone={item.tone} label={item.ticker} />
            <div className="asset-copy">
              <strong>{item.name}</strong>
            </div>
            <div className="asset-value">
              <strong>{hasLiveRate ? formatCurrency(price) : 'Loading...'}</strong>
              <span className={trend}>
                {hasLiveRate ? formatPercent(move) : status === 'error' ? 'Unavailable' : 'Live rate'}
              </span>
            </div>
          </div>
        )
      })}
    </section>
  )
}

export default Watchlist
