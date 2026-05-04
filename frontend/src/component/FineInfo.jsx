function FineInfo ({ showFines }) {
    return (
        <div 
            id="finesBlock" 
            className="fine-section-hidden" 
            style={{ display: showFines ? "flex" : "none" }}
          >
            <div className="fine-title">
              <i className="fas fa-exclamation-triangle"></i> Штрафы / задолженности
            </div>
            <div className="fine-amount">350 ₽</div>
            <div className="fine-breakdown">
              <div className="fine-book-row">
                <span className="fine-book-title">
                  <i className="fas fa-book"></i> «Ведьмак. Кровь эльфов»
                </span>
                <span className="fine-book-days">просрочка 4 дня · 200 ₽</span>
              </div>
              <div className="fine-book-row">
                <span className="fine-book-title">
                  <i className="fas fa-book"></i> «Мастер и Маргарита» (пред. бронь)
                </span>
                <span className="fine-book-days">просрочка 3 дня · 150 ₽</span>
              </div>
              <div className="fine-book-row">
                <span className="fine-book-title">
                  <i className="fas fa-book"></i> «Сто лет одиночества» (задержка)
                </span>
                <span className="fine-book-days">штраф 50₽ (оплачен)</span>
              </div>
            </div>
            <div className="fine-detail-summary">
              <span>
                <i className="fas fa-hourglass-half"></i> Текущая просрочка: 7 дней
              </span>
              <span>
                <i className="fas fa-coins"></i> 50 ₽/день
              </span>
            </div>
            <button className="pay-btn">
              <i className="fas fa-credit-card"></i> Оплатить онлайн (350 ₽)
            </button>
            <div style={{ fontSize: "12px", marginTop: "14px", color: "#b68462" }}>
              <i className="fas fa-info-circle"></i> При сумме &gt;500 ₽ блокируется выдача книг
            </div>
          </div>
    )
}

export default FineInfo