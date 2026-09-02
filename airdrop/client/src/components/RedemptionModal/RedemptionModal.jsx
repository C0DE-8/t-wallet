import { IoCheckmarkCircle, IoCloseCircle, IoClose } from 'react-icons/io5'

function RedemptionModal({ onClose, status = 'success', errorMessage = '', batchData = null }) {
  const isSuccess = status === 'success'
  const isFailure = status === 'failure'

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
          {isSuccess ? (
            <>
              <div className="modal-icon success">
                <IoCheckmarkCircle />
              </div>
              <h2 id="redemption-modal-title">Redemption Successful</h2>
              <p className="modal-message">Your airdrop claim has been submitted successfully.</p>
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
              <h2 id="redemption-modal-title">Redemption Unsuccessful</h2>
              <p className="modal-message">We could not process your airdrop claim. Please review your details and try again.</p>
              {errorMessage && (
                <div className="error-details">
                  <small>{errorMessage}</small>
                </div>
              )}
            </>
          ) : (
            <>
              <h2 id="redemption-modal-title">Redemption</h2>
              <p className="modal-message">Processing your request...</p>
            </>
          )}
        </div>

        <button className="modal-action-button" type="button" onClick={onClose}>
          {isSuccess ? 'Done' : 'Try Again'}
        </button>
      </div>
    </section>
  )
}

export default RedemptionModal
