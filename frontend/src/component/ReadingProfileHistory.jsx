import { useEffect, useState } from "react"
import ReadingHistoryDetail from "./ReadingHistoryDetail"
import { addBookGrade, getUserHistoryReading } from "../services/readerProfile"
import { formatDateShort } from "../services/formatDate"
import { toast } from "../hooks/useToast"

function ReadingProfileHistory() {
    // Состояние для сохранённых оценок книг
    const [savedRatings, setSavedRatings] = useState({})
    // Временная выбранная оценка (до нажатия кнопки "Оценить")
    const [selectedRating, setSelectedRating] = useState({})
    // Показывать ли кнопку "Оценить" для конкретной книги
    const [showSubmitBtn, setShowSubmitBtn] = useState({})
    // Временная оценка при наведении мыши
    const [hoverRating, setHoverRating] = useState({})

    const [historyReadingBookList, setHistoryReadingBookList] = useState(null)

    const [reload, setReload] = useState(false)
    const [loading, setLoading] = useState(false)
    
    const reloadButton = () => {
        setReload(!reload)
        setLoading(true)
      }

    useEffect(() => {
        const getUserHistory = async () => {
            setLoading(true)
            const history = await getUserHistoryReading()
            if (history.success){
                setHistoryReadingBookList(history.data)
                const initialRatings = {}

                history.data.forEach(book => {
                    if (book.rating && book.rating > 0) {
                        initialRatings[book.book_id] = book.rating
                    }
                })
                setSavedRatings(initialRatings)
                setLoading(false)
            } else {
                toast.error("Ошибка получения данных")
            }
        }
        getUserHistory()
    }, [reload])

    // Обработчик выбора звезды (предварительный выбор, без сохранения)
    const handleSelectStar = (bookId, rating) => {
        setSelectedRating(prev => ({ ...prev, [bookId]: rating }))
        setShowSubmitBtn(prev => ({ ...prev, [bookId]: true }))
    }

    // Обработчик сохранения оценки (при нажатии на кнопку "Оценить")
    const handleSubmitRating = async (bookId) => {
        const rating = selectedRating[bookId]
        if (rating) {
            setSavedRatings(prev => ({ ...prev, [bookId]: rating }))
            // Сбрасываем состояние после сохранения
            setShowSubmitBtn(prev => ({ ...prev, [bookId]: false }))
            setSelectedRating(prev => {
                const newState = { ...prev }
                delete newState[bookId]
                return newState
            })
            const result = await addBookGrade({"book_id": bookId, "grade": rating})
            if (result?.success) {
                toast.success("Спасибо за оценку!")
            } else {
                toast.error("Ошибка отправки оценки!")
            }
        }
    }

    // Обработчик наведения на звезду
    const handleHoverStar = (bookId, rating) => {
        setHoverRating(prev => ({ ...prev, [bookId]: rating }))
    }

    // Обработчик ухода мыши с блока звёзд
    const handleMouseLeaveStars = (bookId) => {
        setHoverRating(prev => ({ ...prev, [bookId]: 0 }))
    }

    // Получение текущей оценки для отображения
    const getCurrentDisplayRating = (bookId, bookItem) => {
        // Если есть временная при наведении — показываем её
        if (hoverRating[bookId]) return hoverRating[bookId]
        // Если есть выбранная, но ещё не сохранённая — показываем её
        if (selectedRating[bookId]) return selectedRating[bookId]
        // Иначе показываем сохранённую оценку
        return bookItem.rating
    }

    return (
        <div className="card-panel">
            <div className="panel-header">
                <h2>
                    <i className="fas fa-history"></i> История чтения
                </h2>
                <span className="badge-count" style={{cursor: "pointer"}} onClick={() => reloadButton()}>последние {historyReadingBookList?.length || 0}</span>
            </div>
            <div className="books-history-list">
                {loading
                ? <span className="fas fa-spinner fa-pulse" style={{ marginLeft: 'auto' }}></span>
                : historyReadingBookList?.length === 0
                ? <span className="info-label" style={{color: "black", textAlign: "center"}}>История чтения пуста</span>
                : historyReadingBookList?.map((item, index) => {
                    const bookId = item.book_id
                    const hasSavedRating = savedRatings[bookId] !== undefined
                    const displayRating = getCurrentDisplayRating(bookId, item)
                    const showButton = showSubmitBtn[bookId] && !hasSavedRating

                    // Блок с оценкой
                    const ratingBlock = !hasSavedRating ? (
                        // Режим редактирования (можно поставить оценку)
                        <div className="history-status rating-edit">
                            <div 
                                className="stars-container"
                                onMouseLeave={() => handleMouseLeaveStars(bookId)}
                            >
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <i
                                        key={star}
                                        className={`fas fa-star ${star <= displayRating ? 'star-active' : 'star-inactive'}`}
                                        onMouseEnter={() => handleHoverStar(bookId, star)}
                                        onClick={() => handleSelectStar(bookId, star)}
                                    />
                                ))}
                            </div>
                            {showButton && (
                                <button 
                                    className="btn-primary rate-submit-btn"
                                    onClick={() => handleSubmitRating(bookId)}
                                >
                                    <i className="fas fa-check"></i> Оценить
                                </button>
                            )}
                        </div>
                    ) : (
                        // Режим просмотра (оценка уже сохранена)
                        <div className="history-status rating-view">
                            <span className="rating-value">{savedRatings[bookId]}.0</span>
                        </div>
                    )

                    return (
                        <ReadingHistoryDetail
                            key={index}
                            title={item.title}
                            author={item.author}
                            returnToDate={formatDateShort(item.date_of_return)}
                            imageUrl={item.image_url}
                            comment={item.comment}
                            ratingComponent={ratingBlock}
                        />
                    )
                })}
            </div>
            {/* <div style={{ marginTop: "20px", textAlign: "right" }}>
                <button className="sec-btn" style={{ background: "#f7f2ed" }}>
                    <i className="fas fa-chevron-circle-right"></i> Вся история (47 книг)
                </button>
            </div> */}
        </div>
    )
}

export default ReadingProfileHistory