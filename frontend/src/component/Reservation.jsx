import { useEffect, useState } from "react"
import { reservationGet } from "../services/reservationGet"
import ReservationItem from "./ReservationItem"

function Reservation () {

  const [loading, setLoading] = useState(false)

  const [reservationList, setReservationList] = useState(null)
  const [reload, setReload] = useState(false)

  const reloadButton = () => {
    setReload(!reload)
    setLoading(true)
  }

  // reservationGet
  useEffect(() => {
    const getReservationList = async () => {
      const reservations = await reservationGet()
      setReservationList(reservations)
      setLoading(false)
    }
    getReservationList()
  }, [reload])

  if (reservationList && reservationList.length > 0) {
    return (
    <div className="card">
      <div className="card-header">
        <h2><i className="fas fa-calendar-check"></i> Бронирование книг</h2>
        <button
          onClick={() => reloadButton()}
          className="badge btn-sm">
            {reservationList.length} новые 
          <i className={loading ? "fas fa-spinner fa-pulse" : "fa fa-refresh"} aria-hidden="false"
        ></i></button>
      </div>
        <div className="request-list">
          {reservationList.map((item) => {
            return (
              <ReservationItem
                key={item.id}
                title={item.title}
                readerId={item.reader_id}
                bookId={item.book_id}
                date={item.date_of_create} 
                status={item.status}
                firstName={item.first_name}
                lastName={item.last_name}
              />
            )
            })}
        </div>
    </div>
    )
  } else {
    return (
        <div className="card">
              <div className="card-header">
                <h2><i className="fas fa-calendar-check"></i> Бронирование книг</h2>
                <button className="badge btn-sm" onClick={() => reloadButton()}>0 новых <i
                  className="fa fa-refresh"
                  style={{cursor: "pointer"}}
                  aria-hidden="false"
                ></i></button>
              </div>

              <div className="request-list">
                <span style={{textAlign: "center"}}>Запросов пока нет</span>
              </div>
            </div>
    )
  }
}

export default Reservation