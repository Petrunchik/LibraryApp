import { formatDateShort } from "../services/formatDate"

function ReservationProfileDetail ({ title, author, returnToDate, expireToDate, status, imageUrl }) {
    const bookStatus = expireToDate === null
    ? <div className="booking-status wait"> <i className="fas fa-hourglass-half"></i> Ожидание книги </div>
    : status === "accepted"
    ? <div className="booking-status ready"> <i className="fas fa-check-circle"></i> Готова с {formatDateShort(expireToDate)} </div>
    : <div className="booking-status rejected"> <i className="fas fa-check-circle"></i> Отклонено {formatDateShort(expireToDate)} </div>

    return (
        <div className="history-item">
            <div className="history-cover">
                  {/* <i className="fas fa-crown"></i> */}
                  <img className="history-cover" src={imageUrl} alt={title}></img>
            </div>
            <div className="history-info">
                <div className="history-title">{title} · {author}</div>
                <div className="history-meta">
                    <span>
                        <i className="far fa-calendar-alt"></i>  Дата создания заявки: {returnToDate}
                    </span>
                </div>
            </div>
            {bookStatus}
        </div>
    )
}

export default ReservationProfileDetail