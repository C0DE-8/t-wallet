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

function TokenIcon({ tone, label }) {
  const Mark = tokenMarks[label]

  return (
    <span className={`token-icon ${tone}`}>
      {Mark ? <Mark /> : label.slice(0, 1)}
    </span>
  )
}

export default TokenIcon
