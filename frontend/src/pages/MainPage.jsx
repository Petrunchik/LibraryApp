import Header from '../component/Header'
import Footer from '../component/Footer'
import '../index.css'
import BookList from '../component/BookList'
import { useBooks } from '../hooks/useBooks'

import BooksToolbar from '../component/BooksToolbar'

import { BooksContext } from '../context/BooksContext'
import { useState, useMemo } from 'react'

function MainPage () {
    const { books: bookList, loading } = useBooks()

    const [searchQuery, setSearchQuery] = useState('')
    const [sortQuery, setSortQuery] = useState('')
    const [filterQuery, setFilterQuery] = useState('')

    const [numberOfBooks, setNumberOfBooks] = useState('')

    const filteredBooks = useMemo(() => {
        let result = [...bookList]

        const searchFilter = searchQuery.trim().toLowerCase()
        if (searchFilter.length > 0){
            result = result.filter(book => 
            book.title.toLowerCase().includes(searchFilter) ||
            book.author.toLowerCase().includes(searchFilter) || 
            book.id.includes(searchFilter)
        )}

        switch(sortQuery){
            case "allBooks":
                break
            case 'ratingSort':
                result.sort((a, b) => b.rating - a.rating)
                break
            case "nameAscSort":
                result.sort((a, b) => a.title.localeCompare(b.title))
                break
            case "nameDescSort":
                result.sort((a, b) => b.title.localeCompare(a.title))
                break
            case "newestSort":
                break
            default:
                break
            }
        switch(filterQuery){
            case "allBooks":
                break
            case "inStock":
                result = result.filter(({ availability }) => availability === "В наличии")
                break
            case "expected":
                result = result.filter(({ availability }) => availability === "Ожидается")
                break
            default:
                break
            }
        return result
    }, [bookList, searchQuery, sortQuery, filterQuery])

    const lengthOfBooks = filteredBooks.length

    if (loading) return <div>Загрузка...</div>
    return (
        <BooksContext.Provider
        value={{
            bookList,
            searchQuery,
            setSearchQuery,
            filteredBooks,
            sortQuery,
            setSortQuery,
            filterQuery,
            setFilterQuery,
            lengthOfBooks,
        }}
        >
            <div className="library-container">
                <Header/>
                
                <BooksToolbar numberOfBooks={lengthOfBooks}/>

                <BookList setNumberOfBooks={setNumberOfBooks}/>

                <Footer/>
            </div>
        </BooksContext.Provider>
    )
}

export default MainPage