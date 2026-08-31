import { useEffect, useRef, useState } from 'react'
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
  const sliderRef = useRef(null)
  const [activeSlide, setActiveSlide] = useState(0)

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveSlide((currentSlide) => {
        const nextSlide = (currentSlide + 1) % promoSlides.length
        sliderRef.current?.scrollTo({
          top: nextSlide * sliderRef.current.clientHeight,
          behavior: 'smooth',
        })

        return nextSlide
      })
    }, 8000)

    return () => window.clearInterval(timer)
  }, [])

  function handleScroll(event) {
    const slideHeight = event.currentTarget.clientHeight
    const nextSlide = Math.round(event.currentTarget.scrollTop / slideHeight)

    setActiveSlide(Math.min(nextSlide, promoSlides.length - 1))
  }

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
      <div className="promo-slider" ref={sliderRef} onScroll={handleScroll}>
        {promoSlides.map((slide) => (
          <article className="promo-slide" key={slide.title}>
            <img className="promo-icon" src={slide.icon} alt="" />
            <div className="promo-copy">
              <strong>{slide.title}</strong>
              <span>{slide.subtitle}</span>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

export default PromoSlider
