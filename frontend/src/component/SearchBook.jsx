import { useState } from "react"
import { getBookInfo } from "../services/adminProfile"
import { toast } from "../hooks/useToast"

function SearchBook({ setMessage }) {
    // Состояния для поиска книги
    const [bookQuery, setBookQuery] = useState("")
    const [bookResult, setBookResult] = useState(null)
    const [bookLoading, setBookLoading] = useState(false)

    const searchBook = async () => {
        if (!bookQuery.trim()) {
            setMessage({ type: 'error', text: 'Введите ID книги или название' })
            return
        }
        setBookLoading(true)
        const response = await getBookInfo(bookQuery)
        if (response.success){
            setBookResult(response.data)
            toast.success("Книга найдена!")
            setBookLoading(false)
        } else {
            toast.error("Книга не найдена!")
            setBookLoading(false)
        }
    }

    // const getBookStatusConfig = (status) => {
    //     switch (status) {
    //         case 'available':
    //             return { class: 'status-ready', icon: 'fa-check', text: 'В наличии' }
    //         case 'loaned':
    //             return { class: 'status-waiting', icon: 'fa-book', text: 'Выдана' }
    //         case 'written_off':
    //             return { class: 'status-critical', icon: 'fa-trash', text: 'Списана' }
    //         default:
    //             return { class: 'status-ready', icon: 'fa-check', text: 'В наличии' }
    //     }
    // }

    return (
        <div className="search-book">
            <div className="search-title">
                <i className="fas fa-book"></i> Поиск книги
            </div>
            <div className="search-input-wrapper">
                <input
                    type="text"
                    placeholder="ID книги или название"
                    className="input-field search-input"
                    value={bookQuery}
                    onChange={(e) => setBookQuery(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && searchBook()}
                />
                <span
                    className="btn-sm btn-success search-button"
                    onClick={searchBook}
                >
                    {bookLoading ? <i className="fas fa-spinner fa-pulse"></i> : <i className="fas fa-search"></i>} Найти
                </span>
            </div>

            {bookResult && (
                <div className="book-result-card">
                    <div className="book-result-header">
                        <h3 className="book-title">
                            <i className="fas fa-book-open"></i> {bookResult.title}
                        </h3>
                        <div className="book-status-badges">
                            <span className={`status-badge ${bookResult.is_active ? 'status-ready' : 'status-critical'}`}>
                                <i className={`fas ${bookResult.is_active ? 'fa-check-circle' : 'fa-ban'}`}></i>
                                {bookResult.is_active ? ' Активна' : ' Неактивна'}
                            </span>
                            {/* <span className={`status-badge ${getBookStatusConfig(bookResult.status).class}`}>
                                <i className={`fas ${getBookStatusConfig(bookResult.status).icon}`}></i>
                                {getBookStatusConfig(bookResult.status).text}
                            </span> */}
                        </div>
                    </div>

                    <div className="book-details">
                        <div className="book-detail-item">
                            <i className="fas fa-user-edit"></i> <strong>Автор:</strong> {bookResult.author}
                        </div>
                        <div className="book-detail-item">
                            <i className="fas fa-calendar-alt"></i> <strong>Год выпуска:</strong> {bookResult.year_of_release}
                        </div>
                        <div className="book-detail-item">
                            <i className="fas fa-building"></i> <strong>Издательство:</strong> {bookResult.publisher}
                        </div>
                        <div className="book-detail-item">
                            <i className="fas fa-tag"></i> <strong>Жанр:</strong> {bookResult.genre}
                        </div>
                        <div className="book-detail-item">
                            <i className="fas fa-copy"></i> <strong>Количество копий:</strong> {bookResult.total}
                        </div>
                        <div className="book-detail-item">
                            <i className="fas fa-book-reader"></i> <strong>Выдано книг:</strong> {bookResult.borrowed_copies}
                        </div>
                        <div className="book-detail-item">
                            <i className="fas fa-star"></i> <strong>Рейтинг:</strong> {bookResult.rating}
                        </div>
                        <div className="book-detail-item">
                            <i className="fas fa-chart-line"></i> <strong>Количество оценок:</strong> {bookResult.total_rating_count}
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default SearchBook