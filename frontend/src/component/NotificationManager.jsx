function NotificationManager () {
    return (
        <div className="card">
              <div className="card-header">
                <h2><i className="fas fa-paper-plane"></i> Отправить уведомление</h2>
                <span className="badge">читателям</span>
              </div>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ fontWeight: 500 }}>Текст сообщения</label>
                <textarea rows="2" placeholder="Текст уведомления..." defaultValue="Уважаемые читатели! Напоминаем, что книга «Мастер и Маргарита» готова к выдаче. Заберите до 25 апреля."></textarea>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '12px' }}>
                <span className="btn-sm btn-primary"><i className="fas fa-envelope-open-text"></i> Отправить всем читателям</span>
              </div>
              <div className="notification-area" style={{ marginTop: '20px' }}>
                <div style={{ fontWeight: 600, marginBottom: '12px' }}>📬 История отправленных</div>
                <div className="notif-row">
                  <div className="notif-content">
                    <div className="notif-title">Напоминание о возврате</div>
                    <div className="notif-text">Уважаемые читатели, напоминаем о необходимости вернуть книги до 20 апреля.</div>
                  </div>
                  <div className="notif-date">12.04.2026, 10:23</div>
                </div>
                <div className="notif-row">
                  <div className="notif-content">
                    <div className="notif-title">Готовность брони</div>
                    <div className="notif-text">Книга «Мастер и Маргарита» готова к выдаче.</div>
                  </div>
                  <div className="notif-date">11.04.2026, 14:15</div>
                </div>
                <div className="notif-row">
                  <div className="notif-content">
                    <div className="notif-title">Подтверждение брони</div>
                    <div className="notif-text">Ваша бронь на книгу «Дюна» подтверждена.</div>
                  </div>
                  <div className="notif-date">10.04.2026, 09:45</div>
                </div>
              </div>
            </div>
    )
}
export default NotificationManager