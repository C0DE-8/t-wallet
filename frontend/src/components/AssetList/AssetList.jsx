import { useMemo } from 'react'
import { assets as defaultAssets } from '../../data/walletData'
import { formatCurrency, formatTokenAmount, getUsdRate } from '../../hooks/useCryptoRates'
import TokenIcon from '../TokenIcon/TokenIcon'

function AssetList({ assets = defaultAssets, hideBalances, rates }) {
  const sortedAssets = useMemo(() => {
    return assets
      .map((asset, index) => ({
        asset,
        index,
        value: getAssetUsdValue(asset, rates),
      }))
      .sort((left, right) => right.value - left.value || left.index - right.index)
  }, [assets, rates])

  return (
    <section className="stack-section">
      <h2>
        Tokens <span>&gt;</span>
      </h2>
      <div className="asset-list">
        {sortedAssets.map(({ asset, value }) => (
          <AssetRow asset={asset} hideBalances={hideBalances} key={asset.ticker} rates={rates} value={value} />
        ))}
      </div>
      <button className="view-all" type="button">
        View all <span>&gt;</span>
      </button>
    </section>
  )
}

function AssetRow({ asset, hideBalances, rates, value }) {
  const price = getUsdRate(rates, asset.coingeckoId)

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

function getAssetUsdValue(asset, rates) {
  const price = getUsdRate(rates, asset.coingeckoId)
  return Number.isFinite(price) ? asset.quantity * price : 0
}

export default AssetList
