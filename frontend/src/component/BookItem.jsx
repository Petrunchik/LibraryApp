function BookItem({ book, onOpenModal }) {
    const { title, author, availability, year, rating, image_url } = book
    const isAvailabile = availability === 'В наличии'
    return (
        <div className="book-card" onClick={() => onOpenModal(book)}>
            <div className="book-cover">
                {image_url ? 
                (
                <img src={image_url} alt={title}></img>
                ) : (
                <i className="fas fa-feather-alt"></i>
                )}
            </div>
            <div className="book-title">{title}</div>
            <div className="book-author">{author}</div>
            <div className="book-meta">
                <span className={isAvailabile ? "availability" : "expected"}>
                    <i className={isAvailabile ? 'fas fa-check' : 'fas fa-clock'}></i>
                    {availability}
                </span>
                <span className="year">{year}</span>
                <i className="fas fa-star"></i>{rating}
            </div>
        </div>
    );
}

export default BookItem;