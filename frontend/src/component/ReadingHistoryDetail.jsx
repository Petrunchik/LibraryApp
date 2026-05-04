function ReadingHistoryDetail({ title, author, returnToDate, comment, ratingComponent, imageUrl }) {
    return (
        <div className="history-item">
            <div className="history-cover">
                <img className="history-cover" src={imageUrl} alt={title}></img>
            </div>
            <div className="history-info">
                <div className="history-title">{title} · {author}</div>
                <div className="history-meta">
                    <span><i className="far fa-calendar-alt"></i> Сдана: {returnToDate} · {comment}</span>
                </div>
            </div>
            {/* Вместо status теперь ratingComponent */}
            {ratingComponent}
        </div>
    )
}

export default ReadingHistoryDetail