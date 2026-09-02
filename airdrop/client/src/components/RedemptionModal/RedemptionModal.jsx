function RedemptionModal({ onClose }) {
  return (
    <section className="modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="modal-title">
      <div className="redemption-modal">
        <p className="modal-note">Notice</p>
        <p className="modal-hold">Transaction hold declined</p>
        <div className="modal-x" aria-hidden="true" />
        <h2 id="modal-title">Redemption Unsuccessful</h2>
        <p className="modal-message">
          This payment cannot be processed right now. Please check the payment
          details and try again.
        </p>
        <p className="modal-status">Receiver status unavailable</p>
        <button type="button" onClick={onClose}>
          Done
        </button>
      </div>
    </section>
  )
}

export default RedemptionModal
