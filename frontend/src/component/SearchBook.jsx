import { useState } from "react"

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
        setTimeout(() => {
            if (bookQuery.toLowerCase().includes("война") || bookQuery.toLowerCase().includes("мир")) {
                setBookResult({
                    title: "Война и мир",
                    author: "Лев Толстой",
                    year: 1869,
                    isActive: true,
                    status: "available"
                })
                setMessage({ type: 'success', text: 'Книга найдена' })
            } else if (bookQuery.toLowerCase().includes("преступление")) {
                setBookResult({
                    title: "Преступление и наказание",
                    author: "Фёдор Достоевский",
                    year: 1866,
                    isActive: true,
                    status: "loaned"
                })
                setMessage({ type: 'success', text: 'Книга найдена' })
            } else {
                setBookResult(null)
                setMessage({ type: 'error', text: 'Книга не найдена' })
            }
            setBookLoading(false)
        }, 500)
    }

    const getBookStatusConfig = (status) => {
        switch (status) {
            case 'available':
                return { class: 'status-ready', icon: 'fa-check', text: 'В наличии' }
            case 'loaned':
                return { class: 'status-waiting', icon: 'fa-book', text: 'Выдана' }
            case 'written_off':
                return { class: 'status-critical', icon: 'fa-trash', text: 'Списана' }
            default:
                return { class: 'status-ready', icon: 'fa-check', text: 'В наличии' }
        }
    }

    return (
        <div>
            <div style={{ fontWeight: 600, marginBottom: '16px' }}>
                <i className="fas fa-book"></i> Поиск книги
            </div>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
                <input
                    type="text"
                    placeholder="ID книги"
                    className="input-field"
                    style={{ flex: 1, padding: '12px 16px', borderRadius: '60px', border: '1px solid #e7dfd7' }}
                    value={bookQuery}
                    onChange={(e) => setBookQuery(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && searchBook()}
                />
                <span
                    className="btn-sm btn-success"
                    onClick={searchBook}
                    style={{ cursor: 'pointer', padding: '8px 20px' }}
                >
                    {bookLoading ? <i className="fas fa-spinner fa-pulse"></i> : <i className="fas fa-search"></i>} Найти
                </span>
            </div>

            {bookResult && (
                <div style={{
                    background: '#fefcf9',
                    borderRadius: '24px',
                    border: '1px solid #e0d6cd',
                    padding: '20px'
                }}>
                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '16px',
                        flexWrap: 'wrap',
                        gap: '8px'
                    }}>
                        <h3 style={{ fontSize: '18px', fontWeight: 600, color: '#3a2e28' }}>
                            <i className="fas fa-book-open"></i> {bookResult.title}
                        </h3>
                        <div style={{ display: 'flex', gap: '8px' }}>
                            <span className={`status-badge ${bookResult.isActive ? 'status-ready' : 'status-critical'}`}>
                                <i className={`fas ${bookResult.isActive ? 'fa-check-circle' : 'fa-ban'}`}></i>
                                {bookResult.isActive ? ' Активна' : ' Неактивна'}
                            </span>
                            <span className={`status-badge ${getBookStatusConfig(bookResult.status).class}`}>
                                <i className={`fas ${getBookStatusConfig(bookResult.status).icon}`}></i>
                                {getBookStatusConfig(bookResult.status).text}
                            </span>
                        </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <div>
                            <i className="fas fa-user-edit"></i> <strong>Автор:</strong> {bookResult.author}
                        </div>
                        <div>
                            <i className="fas fa-calendar-alt"></i> <strong>Год выпуска:</strong> {bookResult.year}
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default SearchBook