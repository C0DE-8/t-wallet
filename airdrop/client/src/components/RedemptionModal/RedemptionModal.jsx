function RedemptionModal({ onClose }) {
  return (
    <section className="modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="modal-title">
      <div className="redemption-modal">
        <p className="modal-note">Note....</p>
        <p className="modal-hold">{'{Transaction hold declined}'}</p>
        <div className="modal-x" aria-hidden="true" />
        <h2 id="modal-title">Redemption Unsuccessful</h2>
        <p className="modal-message">
          This payment can not be processed now. Please check out the time of
          your payment and try again.
        </p>
        <p className="modal-status">*****[Receiver Status]*****</p>
        <button type="button" onClick={onClose}>
          Done
        </button>
      </div>
    </section>
  )
}

export default RedemptionModal
