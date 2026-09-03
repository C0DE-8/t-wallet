import { useEffect, useMemo, useState } from 'react'
import { assets, watchlist } from '../data/walletData'

const coinIds = [...new Set([...assets, ...watchlist].map((item) => item.coingeckoId))]
const refreshMs = 60_000

function buildRatesUrl() {
  const params = new URLSearchParams({
    ids: coinIds.join(','),
    vs_currencies: 'usd',
    include_24hr_change: 'true',
    include_last_updated_at: 'true',
  })

  return `https://api.coingecko.com/api/v3/simple/price?${params.toString()}`
}

export function useCryptoRates() {
  const [rates, setRates] = useState({})
  const [status, setStatus] = useState('loading')
  const [lastUpdatedAt, setLastUpdatedAt] = useState(null)

  useEffect(() => {
    const controller = new AbortController()

    async function fetchRates() {
      try {
        setStatus((currentStatus) => (currentStatus === 'ready' ? 'refreshing' : 'loading'))
        const response = await fetch(buildRatesUrl(), {
          signal: controller.signal,
          headers: {
            accept: 'application/json',
          },
        })

        if (!response.ok) {
          throw new Error(`Price request failed with ${response.status}`)
        }

        const data = await response.json()
        setRates(data)
        setLastUpdatedAt(Date.now())
        setStatus('ready')
      } catch (error) {
        if (error.name === 'AbortError') return
        setStatus('error')
      }
    }

    fetchRates()
    const intervalId = window.setInterval(fetchRates, refreshMs)

    return () => {
      controller.abort()
      window.clearInterval(intervalId)
    }
  }, [])

  return useMemo(() => ({ rates, status, lastUpdatedAt }), [rates, status, lastUpdatedAt])
}

export function getUsdRate(rates, coingeckoId) {
  return rates[coingeckoId]?.usd ?? null
}

export function getUsdChange(rates, coingeckoId) {
  return rates[coingeckoId]?.usd_24h_change ?? null
}

export function formatCurrency(value) {
  if (!Number.isFinite(value)) return '$0.00'

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: value >= 1 ? 2 : 4,
    maximumFractionDigits: value >= 1 ? 2 : 6,
  }).format(value)
}

export function formatTokenAmount(quantity, ticker) {
  return `${new Intl.NumberFormat('en-US', {
    maximumFractionDigits: quantity >= 1 ? 4 : 8,
  }).format(quantity)} ${ticker}`
}

export function formatPercent(value) {
  if (!Number.isFinite(value)) return '0.00%'

  const sign = value > 0 ? '+' : ''
  return `${sign}${value.toFixed(2)}%`
}
