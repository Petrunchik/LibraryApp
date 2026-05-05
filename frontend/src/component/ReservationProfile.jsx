import ReservationProfileDetail from "./ReservationProfileDetail"
import { getReservationInfo } from '../services/getReservationInfo'
import { useEffect, useState } from "react"
import { formatDateShort } from "../services/formatDate"
import { toast } from "../hooks/useToast"

function ReservationProfile () {
    const [loading, setLoading] = useState(false)
    
    const [reservationList, setReservationList] = useState(null)
    const [reload, setReload] = useState(false)
    
    const reloadButton = () => {
        setReload(!reload)
        setLoading(true)
      }
    
    useEffect(() => {
            const getReservation = async () => {
                setLoading(true)
              const reservations = await getReservationInfo()

              if (reservations.success){
                setReservationList(reservations.data)
                setLoading(false)
                
              } else {
                toast.error("Ошибка получения данных")
              }
            }
            getReservation()
          }, [reload])
    const reservationCount = loading 
    ? <span className="fas fa-spinner fa-pulse" style={{ marginLeft: 'auto' }}></span>
    : <span className="info-value" style={{cursor: "pointer"}}> {reservationList?.length} </span>

    return (
        <div className="card-panel">
            <div className="panel-header">
              <h2>
                <i className="fas fa-clock"></i> Активные бронирования
              </h2>
              <span className="badge-count" onClick={() => reloadButton()} style={{cursor: "pointer"}}>последние {reservationCount}</span>
            </div>
            <div className="books-history-list">
                {loading
                ? <span className="fas fa-spinner fa-pulse" style={{ marginLeft: 'auto' }}></span>
                : reservationList?.length === 0
                ? <span className="info-label" style={{color: "black", textAlign: "center"}}>В данный момент у вас нет активных бронирований</span>
                : reservationList?.map((item, index) => {
                    return (
                        <ReservationProfileDetail
                            key={index}
                            title={item.title}
                            author={item.author}
                            imageUrl={item.image_url}
                            returnToDate={formatDateShort(item.date_of_create)}
                            expireToDate={item.date_of_expire}
                            status={item.status}

                        />
                    )
                })}
                
            </div>
          </div>
    )
}
export default ReservationProfile