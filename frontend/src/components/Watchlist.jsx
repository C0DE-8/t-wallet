import { watchlist } from '../data/walletData'
import TokenIcon from './TokenIcon'

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

export default Watchlist
