import SearchUser from "./SearchUser"
import SearchBooksByTitle from "./SearchBooksByTitle"

function SearchReaderOrBook() {
    return (
        <>
            <div className="card manager-search-card">
                <div className="card-header">
                    <h2><i className="fas fa-user"></i> Поиск читателя</h2>
                    <span className="badge">по телефону</span>
                </div>
                <SearchUser />
            </div>

            <div className="card manager-search-card">
                <div className="card-header">
                    <h2><i className="fas fa-book"></i> Поиск книги</h2>
                    <span className="badge">по названию</span>
                </div>
                <SearchBooksByTitle />
            </div>
        </>
    )
}

export default SearchReaderOrBook
