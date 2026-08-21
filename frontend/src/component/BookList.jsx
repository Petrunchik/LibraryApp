import { useState, useContext, useEffect, useRef } from "react";
import { BooksContext } from "../context/BooksContext";
import BookItem from "./BookItem";
import PopUpWindow from "./PopUpWindow";


function BookList() {
    const {
        bookList,
        filteredBooks,
        loadingMore,
        hasMoreBooks,
        loadMoreBooks,
        canLoadMoreBooks,
    } = useContext(BooksContext)

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedBook, setSelectedBook] = useState(null);
    const loadMoreRef = useRef(null);

    const handleOpenModal = (book) => {
        setSelectedBook(book);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedBook(null);
    };
    
    // Определяем, какие книги показывать
    const booksToShow = filteredBooks ?? bookList;
    const loadMoreTriggerIndex = booksToShow.length > 18 ? Math.max(18, booksToShow.length - 12) : null;

    useEffect(() => {
        if (!loadMoreRef.current || !hasMoreBooks || loadingMore || !canLoadMoreBooks) return

        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                loadMoreBooks()
            }
        }, {
            rootMargin: "200px 0px",
        })

        observer.observe(loadMoreRef.current)

        return () => observer.disconnect()
    }, [booksToShow.length, canLoadMoreBooks, hasMoreBooks, loadMoreBooks, loadingMore])
    
    // Проверяем, есть ли книги для отображения
    const hasNoBooks = !booksToShow || booksToShow.length === 0;

    if (hasNoBooks) {
        return (
            <div className="books-grid">
                <div className="no-books-message">
                    <i className="fas fa-book-open"></i>
                    <h3>Книги не найдены</h3>
                    <p>Попробуйте изменить параметры поиска или фильтрации</p>
                </div>
            </div>
        );
    }
    return (
        <>
            <div className="books-grid">
                {booksToShow.map((book, index) => {
                    return (
                        <div
                            className="book-list-item"
                            key={book.id}
                            ref={loadMoreTriggerIndex === index + 1 ? loadMoreRef : null}
                        >
                            <BookItem 
                                book={book}
                                onOpenModal={handleOpenModal}
                            />
                        </div>
                    );
                })}
            </div>

            {loadingMore && (
                <div className="books-loading-more">
                    <i className="fas fa-spinner fa-pulse"></i> Загружаем ещё книги...
                </div>
            )}
            
            <PopUpWindow 
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                bookData={selectedBook}
            />
        </>
    );
}

export default BookList;
