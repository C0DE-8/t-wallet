import { IoCloseCircle, IoClose, IoAlertCircle } from 'react-icons/io5'
import './RedemptionModal.css'

function RedemptionModal({ 
  onClose, 
  errorMessage = '', 
  batchData = null,
  failureType = 'default' // 'default', 'critical', or 'super'
}) {
  const isCriticalFailure = failureType === 'critical'
  const isSuperFailed = failureType === 'super'

  return (
    <section
      className="redemption-modal-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="redemption-modal-title"
      onClick={onClose}
    >
      <div className="redemption-modal" onClick={(event) => event.stopPropagation()}>
        <button className="modal-close-button" type="button" onClick={onClose} aria-label="Close">
          <IoClose />
        </button>

        <div className="modal-content">
          {isSuperFailed ? (
            // Super Failed - Red Alert
            <>
              <div className="modal-icon super-failed">
                <IoAlertCircle />
              </div>
              <h2 id="redemption-modal-title">Redemption Unsuccessful</h2>
              <p className="modal-message">A critical error occurred. Your transaction could not be processed at all.</p>
              {errorMessage && (
                <div className="error-details super">
                  <small>{errorMessage}</small>
                </div>
              )}
            </>
          ) : isCriticalFailure ? (
            // Critical Failure - Black X
            <>
              <div className="modal-icon critical-failure">
                <IoCloseCircle />
              </div>
              <h2 id="redemption-modal-title">Redemption Unsuccessful</h2>
              <p className="modal-message">An error occurred while processing your request. Please try again.</p>
              {errorMessage && (
                <div className="error-details critical">
                  <small>{errorMessage}</small>
                </div>
              )}
            </>
          ) : (
            // Default Failure - Red X (ALWAYS SHOWS THIS)
            <>
              <div className="modal-icon failure">
                <IoCloseCircle />
              </div>
              <h2 id="redemption-modal-title">Redemption Unsuccessful</h2>
              <p className="modal-message">We could not process your airdrop claim. Please review your details and try again.</p>
              {errorMessage && (
                <div className="error-details">
                  <small>{errorMessage}</small>
                </div>
              )}
              {batchData && (
                <div className="batch-info">
                  <small>Batch ID: {batchData.id}</small>
                </div>
              )}
            </>
          )}
        </div>

        <button className="modal-action-button" type="button" onClick={onClose}>
          Try Again
        </button>
      </div>
    </section>
  )
}

export default RedemptionModal