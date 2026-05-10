function SearchBookDetail ({ bookData }) {
    return (
        <div className="book-result-card">
                    <div className="book-result-header">
                        <h3 className="book-title">
                            <i className="fas fa-book-open"></i> {bookData.title}
                        </h3>
                        <div className="book-status-badges">
                            <span className={`status-badge ${bookData.is_active ? 'status-ready' : 'status-critical'}`}>
                                <i className={`fas ${bookData.is_active ? 'fa-check-circle' : 'fa-ban'}`}></i>
                                {bookData.is_active ? ' Активна' : ' Неактивна'}
                            </span>
                            {/* <span className={`status-badge ${getBookStatusConfig(bookData.status).class}`}>
                                <i className={`fas ${getBookStatusConfig(bookData.status).icon}`}></i>
                                {getBookStatusConfig(bookData.status).text}
                            </span> */}
                        </div>
                    </div>

                    <div className="book-details">
                        <div className="book-detail-item">
                            <i className="fas fa-user-edit"></i> <strong>Автор:</strong> {bookData.author}
                        </div>
                        <div className="book-detail-item">
                            <i className="fas fa-calendar-alt"></i> <strong>Год выпуска:</strong> {bookData.year_of_release}
                        </div>
                        <div className="book-detail-item">
                            <i className="fas fa-building"></i> <strong>Издательство:</strong> {bookData.publisher}
                        </div>
                        <div className="book-detail-item">
                            <i className="fas fa-tag"></i> <strong>Жанр:</strong> {bookData.genre}
                        </div>
                        <div className="book-detail-item">
                            <i className="fas fa-copy"></i> <strong>Количество копий:</strong> {bookData.total}
                        </div>
                        <div className="book-detail-item">
                            <i className="fas fa-book-reader"></i> <strong>Выдано книг:</strong> {bookData.borrowed_copies}
                        </div>
                        <div className="book-detail-item">
                            <i className="fas fa-star"></i> <strong>Рейтинг:</strong> {bookData.rating}
                        </div>
                        <div className="book-detail-item">
                            <i className="fas fa-chart-line"></i> <strong>Количество оценок:</strong> {bookData.total_rating_count}
                        </div>
                    </div>
                </div>
    )
}

export default SearchBookDetail