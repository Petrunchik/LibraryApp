import { toast } from '../hooks/useToast'
import { copyField } from '../services/copyField'
import { reservationModerate } from '../services/managerProfile'

function ReservationItem ({ title, readerId, bookId, date, status, firstName, lastName, setReload }) {
    let icon = "fa fa-question"

    const moderate = async (status) => {
        if (!(["rejected", "accepted"].includes(status))){
            toast.error("Неверный статус")
        }
        const data = {
            "reader_id": readerId,
            "book_id": bookId, 
            "status": status
        }
        const response = await reservationModerate(data)
        if (response.success === true) {
            toast.success("Успешно!")
            setReload()
        } else if (response.errorStatus === 400){
            toast.error("Книги нет в наличии!")
        } else {
            toast.error("Ошибка запроса!")
        }
    }

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
                <div className="book-meta" style={{cursor: "pointer"}} onClick={() => copyField(readerId)}>ID читателя: {readerId}</div>
                <div className="book-meta" style={{cursor: "pointer"}} onClick={() => copyField(bookId)}>Номер книги: {bookId}</div>
                <div className="book-meta">Дата запроса: {date}</div>
                <div className="book-meta">Статус: <i className={icon}></i>{status}</div>
            </div>
            <div className="actions">
                <span className="btn-sm btn-success" onClick={() => moderate("accepted")}><i className="fas fa-check-circle"></i> Готова к выдаче</span>
                <span className="btn-sm btn-danger" onClick={() => moderate("rejected")}><i className="fas fa-times"></i> Отменить бронь</span>
            </div>
        </div>
    )
}
export default ReservationItem