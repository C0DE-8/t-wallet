// src/components/RedemptionModal/RedemptionModal.jsx
import { IoCheckmarkCircle, IoCloseCircle } from 'react-icons/io5'

function RedemptionModal({ onClose, status = 'success', errorMessage = '', batchData = null }) {
  const isSuccess = status === 'success'
  const isFailure = status === 'failure'

  return (
    <div className="redemption-modal-overlay" onClick={onClose}>
      <div className="redemption-modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-button" onClick={onClose} aria-label="Close">
          <IoClose />
        </button>
        
        <div className="modal-content">
          {isSuccess ? (
            <>
              <div className="modal-icon success">
                <IoCheckmarkCircle />
              </div>
              <h2>Redemption Successful!</h2>
              <p>Your airdrop claim has been submitted successfully.</p>
              {batchData && (
                <div className="batch-info">
                  <small>Batch ID: {batchData.id}</small>
                </div>
              )}
            </>
          ) : isFailure ? (
            <>
              <div className="modal-icon failure">
                <IoCloseCircle />
              </div>
              <h2>Redemption Unsuccessful</h2>
              <p>We couldn't process your airdrop claim. Please try again.</p>
              {errorMessage && (
                <div className="error-details">
                  <small>{errorMessage}</small>
                </div>
              )}
            </>
          ) : (
            // Default/neutral state
            <>
              <h2>Redemption</h2>
              <p>Processing your request...</p>
            </>
          )}
        </div>
        
        <button className="modal-action-button" onClick={onClose}>
          {isSuccess ? 'Done' : 'Try Again'}
        </button>
      </div>
    </div>
  )
}

export default RedemptionModal