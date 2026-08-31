import { useEffect, useState } from 'react'
import bStocksIcon from '../../assets/icons/bstocks.png'
import exploreIcon from '../../assets/icons/explore.png'
import swapIcon from '../../assets/icons/swap.png'

const promoSlides = [
  {
    title: 'Explore Hyperliquid: 200+ markets live',
    subtitle: 'Explore now',
    icon: exploreIcon,
  },
  {
    title: 'bStocks now live, 0% fees',
    subtitle: 'Buy now',
    icon: bStocksIcon,
  },
  {
    title: '0% swap fees on selected stables',
    subtitle: 'Applicable to same-chain swaps only',
    icon: swapIcon,
  },
]

function PromoSlider() {
  const [activeSlide, setActiveSlide] = useState(0)

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveSlide((currentSlide) => (currentSlide + 1) % promoSlides.length)
    }, 3500)

    return () => window.clearInterval(timer)
  }, [])

  const slide = promoSlides[activeSlide]

  return (
    <section className="promo-card" aria-label="Promotions">
      <div className="promo-progress" aria-hidden="true">
        {promoSlides.map((item, index) => (
          <span
            className={index === activeSlide ? 'active' : ''}
            key={item.title}
          ></span>
        ))}
      </div>
      <img className="promo-icon" src={slide.icon} alt="" />
      <div className="promo-copy">
        <strong>{slide.title}</strong>
        <span>{slide.subtitle}</span>
      </div>
    </section>
  )
}

export default PromoSlider
