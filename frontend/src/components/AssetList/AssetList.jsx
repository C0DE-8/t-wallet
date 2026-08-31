import { assets } from '../../data/walletData'
import TokenIcon from '../TokenIcon/TokenIcon'

function AssetList({ hideBalances }) {
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
              <span>{hideBalances ? '*****' : asset.amount}</span>
            </div>
            <div className="asset-value">
              <strong>{hideBalances ? '*****' : asset.value}</strong>
              <span>{hideBalances ? '*****' : '$0.00'}</span>
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

export default AssetList
