import { useEffect, useState } from "react"
import { deleteBook, editBook, getAuthors, getBookInfo, getGenres, getPublishers } from "../../services/adminProfile"
import { toast } from "../../hooks/useToast"
import { formatAuthorLabel, formatAuthors, formatGenres, formatPublisher } from "../../services/bookFormat"

function EditOrDeleteBook () {
    const [queryData, setQueryData] = useState('')
    const [editData, setEditData] = useState({
        id: '',
        book_public_id: '',
        title: '',
        description: '',
        pages: '',
        author_ids: [],
        year_of_release: '',
        publisher_id: '',
        genre_ids: [],
        image_url: '',
        is_active: '',
    })
    const [bookData, setBookData] = useState(null)
    const [authors, setAuthors] = useState([])
    const [genres, setGenres] = useState([])
    const [publishers, setPublishers] = useState([])

    useEffect(() => {
        const loadDirectories = async () => {
            const [authorsResult, genresResult, publishersResult] = await Promise.all([
                getAuthors(),
                getGenres(),
                getPublishers(),
            ])

            if (authorsResult.success) setAuthors(authorsResult.data || [])
            if (genresResult.success) setGenres(genresResult.data || [])
            if (publishersResult.success) setPublishers(publishersResult.data || [])
        }

        loadDirectories()
    }, [])

    const searchBook = async () => {
        const response = await getBookInfo(queryData)
        if (response.success) {
            const data = response.data
            setBookData(data)
            setEditData({
                id: data.id,
                book_public_id: data.book_public_id,
                title: data.title || '',
                description: data.description || '',
                pages: data.pages != null ? String(data.pages) : '',
                author_ids: (data.authors || []).map((author) => author.id),
                year_of_release: data.year_of_release != null ? String(data.year_of_release) : '',
                publisher_id: data.publisher?.id ?? '',
                genre_ids: (data.genres || []).map((genre) => genre.id),
                image_url: data.image_url || '',
                is_active: data.is_active,
            })
            toast.success("Книга найдена")
        } else {
            toast.error("Книга не найдена")
        }
    }

    const handleEdit = (e) => {
        const { name, value } = e.target
        setEditData(prev => ({
            ...prev,
            [name]: value,
        }))
    }

    const handleMultiSelect = (e) => {
        const { name } = e.target
        const values = Array.from(e.target.selectedOptions, (option) => Number(option.value))
        setEditData(prev => ({
            ...prev,
            [name]: values,
        }))
    }

    const clearAllData = () => {
        setEditData({
            id: '',
            book_public_id: '',
            title: '',
            description: '',
            pages: '',
            author_ids: [],
            year_of_release: '',
            publisher_id: '',
            genre_ids: [],
            image_url: '',
            is_active: '',
        })
        setBookData(null)
        setQueryData('')
    }

    const handleSubmit = async () => {
        if (!editData.book_public_id) {
            toast.info("Сначала найдите книгу!")
            return
        }

        const response = await editBook(editData.book_public_id, {
            title: editData.title,
            description: editData.description,
            pages: Number(editData.pages),
            year_of_release: Number(editData.year_of_release),
            author_ids: editData.author_ids,
            genre_ids: editData.genre_ids,
            publisher_id: Number(editData.publisher_id),
        })
        if (response.success) {
            toast.success("Данные сохранены!")
            setBookData(prev => ({
                ...prev,
                title: editData.title,
                description: editData.description,
                pages: Number(editData.pages),
                year_of_release: Number(editData.year_of_release),
                authors: authors.filter((author) => editData.author_ids.includes(author.id)),
                genres: genres.filter((genre) => editData.genre_ids.includes(genre.id)),
                publisher: publishers.find((publisher) => publisher.id === Number(editData.publisher_id)),
            }))
        } else {
            toast.error(response.error || "Ошибка сохранения данных!")
        }
    }

    const deactivateBook = async () => {
        if (!bookData?.book_public_id) {
            toast.info("Сначала найдите книгу!")
            return
        }

        const response = await deleteBook(bookData.book_public_id)
        if (response.success) {
            clearAllData()
            toast.success("Книга удалена!")
        } else {
            toast.error(response.error || "Ошибка удаления книги!")
        }
    }

    return(
        <div className="card full-width">
            <div className="card-header">
                <h2><i className="fas fa-edit"></i> Редактировать / удалить книгу</h2>
                <span className="badge">поиск по ID издания</span>
            </div>
            <div className="grid-2col">
                <div>
                    <div className="admin-search-wrapper edit-book-search-wrapper">
                        <input type="text" id="searchBookId" placeholder="UUID, публичный ID или название" value={queryData} onChange={(e) => setQueryData(e.target.value)}/>
                        <button id="searchBookBtn" onClick={() => searchBook()}><i className="fas fa-search"></i> Найти</button>
                    </div>
                    <div className="book-form edit-book-form" id="editBookForm">
                        <input type="text" name="title" placeholder="Название книги" value={editData?.title} onChange={handleEdit}/>
                        <textarea rows="2" name="description" placeholder="Описание" value={editData?.description} onChange={handleEdit}></textarea>
                        <input type="text" name="pages" placeholder="Количество страниц" value={editData?.pages} onChange={handleEdit}/>
                        <select
                            multiple
                            name="author_ids"
                            value={(editData.author_ids || []).map(String)}
                            onChange={handleMultiSelect}
                        >
                            {authors.map((author) => (
                                <option key={author.id} value={author.id}>{formatAuthorLabel(author)}</option>
                            ))}
                        </select>
                        <input type="text" name="year_of_release" placeholder="Год выпуска" value={editData?.year_of_release} onChange={handleEdit}/>
                        <select name="publisher_id" value={editData.publisher_id} onChange={handleEdit}>
                            <option value="">Издательство</option>
                            {publishers.map((publisher) => (
                                <option key={publisher.id} value={publisher.id}>{publisher.name}</option>
                            ))}
                        </select>
                        <select
                            multiple
                            name="genre_ids"
                            value={(editData.genre_ids || []).map(String)}
                            onChange={handleMultiSelect}
                        >
                            {genres.map((genre) => (
                                <option key={genre.id} value={genre.id}>{genre.name}</option>
                            ))}
                        </select>
                        <div className="edit-book-upload">
                            <span className="btn-sm btn-dark"><i className="fas fa-upload"></i> Загрузить новую обложку</span>
                        </div>
                        <div className="actions edit-book-actions">
                            <span className="btn-sm btn-primary submit-button" onClick={() => handleSubmit()}><i className="fas fa-save"></i> Сохранить изменения</span>
                            <span className="btn-sm btn-danger" onClick={() => deactivateBook()}><i className="fas fa-trash"></i> Удалить книгу (издание)</span>
                        </div>
                    </div>
                </div>
                <div>
                    <div className="book-info-section-title">Информация о книге</div>
                    <div className="book-info-card found-book" id="bookInfoCard">
                        <div className="profile-row"><span><strong>ID книги:</strong></span><span className="data-show">{bookData?.book_public_id || bookData?.id}</span></div>
                        <div className="profile-row"><span><strong>Название:</strong></span><span>{bookData?.title}</span></div>
                        <div className="profile-row"><span><strong>Автор:</strong></span><span>{formatAuthors(bookData?.authors)}</span></div>
                        <div className="profile-row"><span><strong>Год:</strong></span><span>{bookData?.year_of_release}</span></div>
                        <div className="profile-row"><span><strong>Издательство:</strong></span><span>{formatPublisher(bookData?.publisher)}</span></div>
                        <div className="profile-row"><span><strong>Жанр:</strong></span><span>{formatGenres(bookData?.genres)}</span></div>
                        <div className="profile-row"><span><strong>Страниц:</strong></span><span>{bookData?.pages}</span></div>
                        <div className="profile-row"><span><strong>Физических копий:</strong></span><span>{bookData?.total} экз.</span></div>
                        <div className="profile-row"><span><strong>Доступно:</strong></span><span>{bookData?.available_copies} экз.</span></div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default EditOrDeleteBook
