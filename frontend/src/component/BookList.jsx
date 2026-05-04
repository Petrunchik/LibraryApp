import { useState, useContext } from "react";
import { BooksContext } from "../context/BooksContext";
import BookItem from "./BookItem";
import PopUpWindow from "./PopUpWindow";


function BookList() {
    const {
        bookList,
        filteredBooks,
    } = useContext(BooksContext)

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedBook, setSelectedBook] = useState(null);

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
    const numberOfBooks = filteredBooks ?? bookList
    return (
        <>
            <div className="books-grid">
                {(filteredBooks ?? bookList).map((book) => {
                    return (
                        <BookItem 
                            key={book.id} 
                            book={book}
                            onOpenModal={handleOpenModal}
                        />
                    );
                })}
            </div>
            
            <PopUpWindow 
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                bookData={selectedBook}
            />
        </>
    );
}

export default BookList;