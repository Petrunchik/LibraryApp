import { useState, useEffect, useCallback, useRef } from 'react';
import { formatAuthors, formatGenres } from '../services/bookFormat';

const BOOKS_PER_PAGE = 30;

const formatBook = (book) => ({
    id: book.id,
    book_public_id: book.book_public_id,
    title: book.title,
    authors: book.authors,
    authorsText: formatAuthors(book.authors),
    author: formatAuthors(book.authors),
    genres: book.genres,
    genresText: formatGenres(book.genres),
    genre: formatGenres(book.genres),
    year: book.year_of_release != null ? String(book.year_of_release) : "",
    rating: book.rating,
    image_url: book.image_url,
    description: book.description,
    publisher: book.publisher,
    pages: book.pages,
    language: book.language,
    age_restriction: book.age_restriction,
    borrowed_copies: book.borrowed_copies,
    available_copies: Number(book.available_copies) || 0,
    availability: (Number(book.available_copies) || 0) > 0 ? "В наличии" : "Ожидается",
    totalRatingCount: book.total_rating_count,
});

export const useBooks = () => {
    const [books, setBooks] = useState([])
    const [loading, setLoading] = useState(true)
    const [loadingMore, setLoadingMore] = useState(false)
    const [hasMoreBooks, setHasMoreBooks] = useState(true)
    const isLoadingMore = useRef(false)
    const API_BASE_URL = import.meta.env.API_BASE_URL || 'http://localhost:8000'

    const loadMoreBooks = useCallback(async () => {
        if (isLoadingMore.current || !hasMoreBooks) return

        isLoadingMore.current = true
        setLoadingMore(true)

        try {
            const response = await fetch(`${API_BASE_URL}/books/?skip=${books.length}&limit=${BOOKS_PER_PAGE}`)
            const data = await response.json()
            if (!Array.isArray(data)) {
                return
            }

            const formattedBooks = data.map(formatBook)

            setBooks((currentBooks) => {
                const existingBookIds = new Set(currentBooks.map((book) => book.id))
                const newBooks = formattedBooks.filter((book) => !existingBookIds.has(book.id))

                return [...currentBooks, ...newBooks]
            })

            if (data.length < BOOKS_PER_PAGE) {
                setHasMoreBooks(false)
            }
        } catch (err) {
            console.log(err)
        } finally {
            isLoadingMore.current = false
            setLoadingMore(false)
        }
    }, [API_BASE_URL, books.length, hasMoreBooks])

    useEffect(() => {
        fetch(`${API_BASE_URL}/books/?skip=0&limit=${BOOKS_PER_PAGE}`)
            .then(res => res.json())
            .then(data => {
                if (!Array.isArray(data)) {
                    setBooks([])
                    setHasMoreBooks(false)
                    return
                }

                const formattedBooks = data.map(formatBook);
                setBooks(formattedBooks);
                setHasMoreBooks(data.length === BOOKS_PER_PAGE)
            })
            .catch(err => console.log(err))
            .finally(() => setLoading(false));
    }, [API_BASE_URL]);

    return { books, loading, loadingMore, hasMoreBooks, loadMoreBooks };
};
