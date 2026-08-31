import {
  SiBinance,
  SiBitcoin,
  SiEthereum,
  SiSolana,
  SiTether,
} from 'react-icons/si'

const tokenMarks = {
  BNB: SiBinance,
  BTC: SiBitcoin,
  ETH: SiEthereum,
  SOL: SiSolana,
  USDT: SiTether,
}

function TronMark() {
  return (
    <svg viewBox="0 0 200 200" aria-hidden="true">
      <path
        d="M48 43 L154 57 L116 159 L48 43 Z M48 43 L116 159 L102 91 L48 43 Z M102 91 L154 57 L116 159 L102 91 Z"
        fill="white"
        stroke="white"
        strokeLinejoin="round"
        strokeWidth="3"
      />
    </svg>
  )
}

function TokenIcon({ tone, label }) {
  const Mark = label === 'TRX' ? TronMark : tokenMarks[label]

  return (
    <span className={`token-icon ${tone}`}>
      {Mark ? <Mark /> : label.slice(0, 1)}
    </span>
  )
}

export default TokenIcon
