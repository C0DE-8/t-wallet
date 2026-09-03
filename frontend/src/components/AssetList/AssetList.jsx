import { assets } from '../../data/walletData'
import { formatCurrency, formatTokenAmount, getUsdRate } from '../../hooks/useCryptoRates'
import TokenIcon from '../TokenIcon/TokenIcon'

function AssetList({ hideBalances, rates }) {
  return (
    <section className="stack-section">
      <h2>
        Tokens <span>&gt;</span>
      </h2>
      <div className="asset-list">
        {assets.map((asset) => (
          <AssetRow asset={asset} hideBalances={hideBalances} key={asset.ticker} rates={rates} />
        ))}
      </div>
      <button className="view-all" type="button">
        View all <span>&gt;</span>
      </button>
    </section>
  )
}

function AssetRow({ asset, hideBalances, rates }) {
  const price = getUsdRate(rates, asset.coingeckoId)
  const value = Number.isFinite(price) ? asset.quantity * price : 0

  return (
    <div className="asset-row">
      <TokenIcon tone={asset.tone} label={asset.ticker} />
      <div className="asset-copy">
        <strong>{asset.name}</strong>
        <span>{hideBalances ? '*****' : formatTokenAmount(asset.quantity, asset.ticker)}</span>
      </div>
      <div className="asset-value">
        <strong>{hideBalances ? '*****' : formatCurrency(value)}</strong>
        <span>{hideBalances ? '*****' : formatCurrency(price)}</span>
      </div>
    </div>
  )
}

export default AssetList
