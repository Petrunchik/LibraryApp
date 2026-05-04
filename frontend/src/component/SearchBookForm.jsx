import { useContext } from "react"
import { BooksContext } from "../context/BooksContext";

function SearchBookForm () {
    const {
        setSearchQuery,
    } = useContext(BooksContext)

    return (
        <div className="search-wrapper">
            <div className="search-box">
                <i className="fas fa-search"></i>
                <input
                    type="text"
                    placeholder="Введите название, автора или ID книги"
                    onInput={(event) => setSearchQuery(event.target.value)}
                    style={{"outline": "none"}}
                />
                <button>Найти</button>
            </div>
        </div>
    )
}

export default SearchBookForm