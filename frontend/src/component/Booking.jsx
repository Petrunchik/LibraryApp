function Booking () {
    return(
        <div className="card">
              <div className="card-header">
                <h2><i className="fas fa-clipboard-list"></i> Подтверждённые брони</h2>
                <span className="badge">2 ожидают выдачи</span>
              </div>
              <div className="active-list">
                <div className="request-item">
                  <div>
                    <h4>«Мастер и Маргарита»</h4>
                    <div className="book-meta">Читатель ID: LIB-4281 · Инв. номер: INV-101</div>
                    <div className="book-meta">Дата запроса: 10.04.2026</div>
                    <div className="book-meta">Статус: <span className="status-badge status-waiting">⏳ Ожидает выдачи</span></div>
                  </div>
                  <div className="actions">
                    <span className="btn-sm btn-success"><i className="fas fa-check-circle"></i> Готова к выдаче</span>
                    <span className="btn-sm btn-danger"><i className="fas fa-trash"></i> Отменить бронь</span>
                  </div>
                </div>
                <div className="request-item">
                  <div>
                    <h4>«Дюна»</h4>
                    <div className="book-meta">Читатель ID: LIB-9210 · Инв. номер: INV-205</div>
                    <div className="book-meta">Дата запроса: 11.04.2026</div>
                    <div className="book-meta">Статус: <span className="status-badge status-waiting">⏳ Ожидает выдачи</span></div>
                  </div>
                  <div className="actions">
                    <span className="btn-sm btn-success"><i className="fas fa-check-circle"></i> Готова к выдаче</span>
                    <span className="btn-sm btn-primary"><i className="fas fa-hand-holding"></i> Выдать</span>
                    <span className="btn-sm btn-danger"><i className="fas fa-trash"></i> Отменить бронь</span>
                  </div>
                </div>
              </div>
            </div>
    )
}
export default Booking