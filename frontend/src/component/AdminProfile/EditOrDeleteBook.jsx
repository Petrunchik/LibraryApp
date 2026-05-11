import { useState } from "react"
import { deleteBook, editBook, getBookInfo } from "../../services/adminProfile"
import { toast } from "../../hooks/useToast"

function EditOrDeleteBook () {
    const [queryData, setQueryData] = useState('')
    const [editData, setEditData] = useState({
        id: '',
        title: '',
        description: '',
        pages: '',
        author: '',
        year_of_release: '',
        publisher: '',
        genre: '',
        image_url: '',
        is_active: '',
    })
    const [bookData, setBookData] = useState(null)

    const searchBook = async () => {
        const response = await getBookInfo(queryData)
        if (response.success) {
            setBookData(response.data)
            setEditData(response.data)
            console.log(response.data)
            toast.success("Книга найдена")
        } else {
            toast.error("Книга не найдена")
        }
    }

    const handleEdit = (e) => {
        const { name, value } = e.target
        console.log(name, value)
        setEditData(prev => ({
            ...prev,
            [name]: value,
        }))
    }
    const clearAllData = () => {
        setEditData({
            id: '',
            title: '',
            description: '',
            pages: '',
            author: '',
            year_of_release: '',
            publisher: '',
            genre: '',
            image_url: '',
            is_active: '',
        })
        setBookData(null)
        setQueryData('')
    }

    const handleSubmit = async () => {
        const response = await editBook(editData)
        if (response.success) {
            toast.success("Данные сохранены!")
            setBookData(editData)
        } else {
            toast.error("Ошибка сохранения данных!")
        }
    }

    const deactivateBook = async () => {
        const response = await deleteBook(bookData.id)
        if (response.success) {
            clearAllData()
            toast.success("Книга удалена!")
        } else {
            toast.error("Ошибка удаления книги!")
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
                        <input type="text" id="searchBookId" placeholder="Введите ID книги (например, B-101)" value={queryData} onChange={(e) => setQueryData(e.target.value)}/>
                        <button id="searchBookBtn" onClick={() => searchBook()}><i className="fas fa-search"></i> Найти</button>
                    </div>
                    <div className="book-form edit-book-form" id="editBookForm">
                        <input type="text" name="title" placeholder="Название книги" value={editData?.title} onChange={handleEdit}/>
                        <textarea rows="2" name="description" placeholder="Описание" value={editData?.description} onChange={handleEdit}></textarea>
                        <input type="text" name="pages" placeholder="Количество страниц" value={editData?.pages} onChange={handleEdit}/>
                        <input type="text" name="author" placeholder="Автор" value={editData?.author} onChange={handleEdit}/>
                        <input type="text" name="year_of_release" placeholder="Год выпуска" value={editData?.year_of_release} onChange={handleEdit}/>
                        <input type="text" name="publisher" placeholder="Издательство" value={editData?.publisher} onChange={handleEdit}/>
                        <input type="text" name="genre" placeholder="Жанр" value={editData?.genre} onChange={handleEdit}/>
                        <div className="edit-book-upload">
                            <span className="btn-sm btn-dark"><i className="fas fa-upload"></i> Загрузить новую обложку</span>
                        </div>
                        <div className="actions edit-book-actions">
                            <span className="btn-sm btn-warning" onClick={() => handleSubmit()}><i className="fas fa-save"></i> Сохранить изменения</span>
                            <span className="btn-sm btn-danger" onClick={() => deactivateBook()}><i className="fas fa-trash"></i> Удалить книгу (издание)</span>
                        </div>
                    </div>
                </div>
                <div>
                    <div className="book-info-section-title">Информация о книге</div>
                    <div className="book-info-card found-book" id="bookInfoCard">
                        <div className="profile-row"><span><strong>ID книги:</strong></span><span className="data-show">{bookData?.id}</span></div>
                        <div className="profile-row"><span><strong>Название:</strong></span><span>{bookData?.title}</span></div>
                        <div className="profile-row"><span><strong>Автор:</strong></span><span>{bookData?.author}</span></div>
                        <div className="profile-row"><span><strong>Год:</strong></span><span>{bookData?.year_of_release}</span></div>
                        <div className="profile-row"><span><strong>Издательство:</strong></span><span>{bookData?.publisher}</span></div>
                        <div className="profile-row"><span><strong>Жанр:</strong></span><span>{bookData?.genre}</span></div>
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