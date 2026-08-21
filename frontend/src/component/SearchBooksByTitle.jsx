import { useMemo, useState } from "react"
import { searchBooksByTitle } from "../services/searchBooksByTitle"
import { formatAuthors, formatGenres } from "../services/bookFormat"

const BOOKS_PER_PAGE = 5

const normalizeBooks = (data) => {
    if (Array.isArray(data)) {
        return data
    }

    const possibleLists = [data?.books, data?.items, data?.results, data?.data]
    const list = possibleLists.find(Array.isArray)

    if (list) {
        return list
    }

    return data && typeof data === "object" ? [data] : []
}

function SearchBooksByTitle() {
    const [bookQuery, setBookQuery] = useState("")
    const [books, setBooks] = useState([])
    const [currentPage, setCurrentPage] = useState(1)
    const [bookLoading, setBookLoading] = useState(false)
    const [message, setMessage] = useState(null)

    const totalPages = Math.max(1, Math.ceil(books.length / BOOKS_PER_PAGE))

    const visibleBooks = useMemo(() => {
        const startIndex = (currentPage - 1) * BOOKS_PER_PAGE
        return books.slice(startIndex, startIndex + BOOKS_PER_PAGE)
    }, [books, currentPage])

    const searchBook = async () => {
        const title = bookQuery.trim()

        if (!title) {
            setBooks([])
            setCurrentPage(1)
            setMessage({ type: "error", text: "Введите название книги" })
            return
        }

        setBookLoading(true)
        setCurrentPage(1)

        const response = await searchBooksByTitle(title)
        const foundBooks = response.success ? normalizeBooks(response.data) : []

        if (foundBooks.length > 0) {
            setBooks(foundBooks)
            setMessage({ type: "success", text: `Найдено книг: ${foundBooks.length}` })
        } else {
            setBooks([])
            setMessage({ type: "error", text: "Книги с таким названием не найдены" })
        }

        setBookLoading(false)
    }

    const goToPreviousPage = () => {
        setCurrentPage((page) => Math.max(1, page - 1))
    }

    const goToNextPage = () => {
        setCurrentPage((page) => Math.min(totalPages, page + 1))
    }

    return (
        <div className="manager-search-panel">
            <div className="manager-search-form">
                <input
                    type="text"
                    placeholder="Введите название книги"
                    className="input-field"
                    value={bookQuery}
                    onChange={(e) => setBookQuery(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && searchBook()}
                />
                <span
                    className="btn-sm btn-success"
                    onClick={searchBook}
                >
                    {bookLoading ? <i className="fas fa-spinner fa-pulse"></i> : <i className="fas fa-search"></i>} Найти
                </span>
            </div>

            {message && (
                <div className={`search-panel-message ${message.type === "success" ? "message-success" : "message-error"}`}>
                    <i className={`fas ${message.type === "success" ? "fa-check-circle" : "fa-exclamation-triangle"}`}></i>
                    <span>{message.text}</span>
                    <button type="button" onClick={() => setMessage(null)}>
                        <i className="fas fa-times"></i>
                    </button>
                </div>
            )}

            {books.length > 0 && (
                <div className="manager-book-results">
                    {visibleBooks.map((book, index) => (
                        <div className="manager-book-result" key={book.id ?? `${book.title}-${index}`}>
                            <div className="manager-book-result-main">
                                <div className="manager-book-result-title">
                                    <i className="fas fa-book-open"></i>
                                    <span>{book.title}</span>
                                </div>
                                <div className="manager-book-result-meta">
                                    <span><i className="fas fa-user-edit"></i> {formatAuthors(book.authors)}</span>
                                    <span><i className="fas fa-calendar-alt"></i> {book.year_of_release || "Год не указан"}</span>
                                    <span><i className="fas fa-tag"></i> {formatGenres(book.genres)}</span>
                                </div>
                            </div>
                            <div className="manager-book-result-side">
                                <span className={`status-badge ${book.is_active === false ? "status-critical" : "status-ready"}`}>
                                    <i className={`fas ${book.is_active === false ? "fa-ban" : "fa-check-circle"}`}></i>
                                    {book.is_active === false ? "Неактивна" : "Активна"}
                                </span>
                                <div className="manager-book-copies">
                                    <strong>{book.available_copies ?? book.total ?? 0}</strong>
                                    <span>доступно</span>
                                </div>
                            </div>
                        </div>
                    ))}

                    {totalPages > 1 && (
                        <div className="book-search-pagination">
                            <button type="button" onClick={goToPreviousPage} disabled={currentPage === 1}>
                                <i className="fas fa-chevron-left"></i>
                            </button>
                            <span>{currentPage} / {totalPages}</span>
                            <button type="button" onClick={goToNextPage} disabled={currentPage === totalPages}>
                                <i className="fas fa-chevron-right"></i>
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}

export default SearchBooksByTitle
