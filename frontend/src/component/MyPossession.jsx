import { useEffect, useState } from "react"
import { getUserPossesion } from "../services/getUserPossesion"
import MyPossessionDetailInfo from "./MyPossessionDetailInfo"
import { formatDateShort } from "../services/formatDate"

function MyPossession () {

  const [userPosession, setUserPosession] = useState(null)
  const [loading, setLoading] = useState(true)
  
  const [reload, setReload] = useState(false)
    
  const reloadButton = () => {
        setReload(!reload)
        setLoading(true)
  }

  useEffect(() => {
        const getUserPossesionInfo = async () => {
          const user = await getUserPossesion()
          if (user.success){
            setUserPosession(user.data)
            setLoading(false)
          } else {
            console.log("Ошибка получения данных")
          }
        }
        getUserPossesionInfo()
      }, [reload])
      
  const posessionCount = loading 
    ? <span className="fas fa-spinner fa-pulse" style={{ marginLeft: 'auto' }}></span>
    : <span className="info-value" style={{cursor: "pointer"}}> {userPosession?.length} </span>
    return (
        <div className="card-panel">
            <div className="panel-header">
              <h2>
                <i className="fas fa-hand-holding-heart"></i> Сейчас на руках
              </h2>
              <span className="badge-count" style={{cursor: "pointer"}} onClick={() => reloadButton()}>{posessionCount} книги</span>
            </div>

            <div className="books-history-list">

              {loading
                ? <span className="fas fa-spinner fa-pulse" style={{ marginLeft: 'auto' }}></span>
                : userPosession?.length === 0
                ? <span className="info-label" style={{color: "black", textAlign: "center"}}>В данный момент у вас нет книг на руках</span>
                : userPosession?.map((book, index) => {
                  return (<MyPossessionDetailInfo
                      key={ index }
                      title={book.book_title}
                      author={book.book_author}
                      takenDate={formatDateShort(book.date_of_loan)}
                      returnToDate={formatDateShort(book.date_of_expected_return)}
                      imageUrl={book.image_url}
                      amount={book.amount}
                      daysBeforeReturn={book.days_before_return}
                  />)
                })
              }
            </div>
          </div>
    )
}

export default MyPossession