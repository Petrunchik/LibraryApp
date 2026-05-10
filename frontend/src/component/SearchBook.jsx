import { useState } from "react"
import { getBookInfo } from "../services/adminProfile"
import { toast } from "../hooks/useToast"
import SearchBookDetail from "./SearchBookDetail"

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
                <SearchBookDetail bookData={bookResult}/>
            )}
        </div>
    )
}

export default SearchBook