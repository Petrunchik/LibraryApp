function ReservationItem ({ title, readerId, bookId, date, status, firstName, lastName }) {
    let icon = "fa fa-question"
    switch (status){
        case "sent":
            status = "Ожидает"
            icon = "fas fa-hourglass-half"
            break
        case "accepted":
            status = "Подтверждено"
            icon = "fa-check-circle"
            break
        case "rejected":
            status = "Отклонено"
            icon = "fa-times-circle"
            break
        case "issued":
            status = "Выдано"
            icon = "fa-book-open"
            break
    }
    return (
        <div className="request-item">
            <div>
                <h4>«{title}»</h4>
                <div className="book-meta">Читатель: {firstName} {lastName}</div>
                <div className="book-meta">ID читателя: {readerId}</div>
                <div className="book-meta">Номер книги: {bookId}</div>
                <div className="book-meta">Дата запроса: {date}</div>
                <div className="book-meta">Статус: <i className={icon}></i>{status}</div>
            </div>
            <div className="actions">
                <span className="btn-sm btn-success"><i className="fas fa-check-circle"></i> Готова к выдаче</span>
                <span className="btn-sm btn-danger"><i className="fas fa-times"></i> Отменить бронь</span>
            </div>
        </div>
    )
}
export default ReservationItem