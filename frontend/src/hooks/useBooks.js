import { useState, useEffect } from 'react';

export const useBooks = () => {
    const [books, setBooks] = useState([])
    const [loading, setLoading] = useState(true)
    const API_BASE_URL = import.meta.env.API_BASE_URL || 'http://localhost:8000'

    useEffect(() => {
        fetch(`${API_BASE_URL}/books/`)
            .then(res => res.json())
            .then(data => {
                const formattedBooks = data.map(book => ({
                    id: book.id,
                    title: book.title,
                    author: book.author,
                    year: book.year_of_release.toString(),
                    rating: book.rating,
                    image_url: book.image_url,
                    description: book.description,
                    publisher: book.publisher,
                    genre: book.genre,
                    pages: book.pages,
                    borrowed_copies: book.borrowed_copies,
                    available_copies: book.available_copies,
                    availability: book.available_copies > 0 ? "В наличии" : "Ожидается",
                    totalRatingCount: book.total_rating_count,
                }));
                setBooks(formattedBooks);
            })
            .catch(err => console.log(err))
            .finally(() => setLoading(false));
    }, []);

    return { books, loading };
};