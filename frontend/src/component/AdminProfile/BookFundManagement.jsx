import { useEffect, useState } from "react"
import AddingBookCopy from "./AddingBookCopy"
import { addNewBook, getAuthors, getGenres, getPublishers } from "../../services/adminProfile"
import { toast } from "../../hooks/useToast"
import { isAllDigits } from "../../services/fieldChecker"
import { copyField } from "../../services/copyField"
import { formatAuthorLabel } from "../../services/bookFormat"

const emptyForm = {
  title: "",
  description: "",
  pages: "",
  author_ids: [],
  year_of_release: "",
  publisher_id: "",
  genre_ids: [],
}

function BookFundManagement () {
  const [bookId, setBookId] = useState(null)
  const [filename, setFilename] = useState(null)
  const [uploadFile, setUploadFile] = useState(null)
  const [authors, setAuthors] = useState([])
  const [genres, setGenres] = useState([])
  const [publishers, setPublishers] = useState([])
  const [form, setForm] = useState(emptyForm)

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

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(prev => ({...prev, [name]: value}))
  }

  const handleMultiSelect = (e) => {
    const { name } = e.target
    const values = Array.from(e.target.selectedOptions, (option) => Number(option.value))
    setForm(prev => ({...prev, [name]: values}))
  }

  const clearForm = () => {
    setForm(emptyForm)
    setFilename(null)
    setUploadFile(null)
  }
  
  const handleUploadFile = async (event) => {
    const file = event.target.files[0]
    const maxFileSize = 2 * 1024 * 1024
    const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg']

    if (file) {
      if (file.size > maxFileSize) {
        toast.error("Размер изображения не должен превышать 2 МБ!")
        return
      } else if (!allowedTypes.includes(file.type)) {
        toast.error("Для загрузки доступны только PNG и JPG изображения!")
        return
      } else {
        setFilename(file.name)
        setUploadFile(file)
        return
      }
    }
  }

  const cancelDownloadFile = async () => {
    setFilename(null)
    setUploadFile(null)
  }

  const handleSubmit = async () => {
    if (
      (form.title?.trim().length === 0) 
      || (form.description?.trim().length === 0)
      || (form.pages?.trim().length === 0)
      || (form.author_ids.length === 0)
      || (form.year_of_release?.trim().length === 0)
      || !form.publisher_id
      || (form.genre_ids.length === 0)
    ){
      toast.info("Все поля обязательны к заполнению!")
      return
    } else if (!isAllDigits(form.year_of_release.trim()) || !(Number(form.year_of_release?.trim()) >= 1500 && Number(form.year_of_release?.trim()) <= 2026)) {
      toast.info("Поле года выпуска должно быть от 1500 до 2026 года и состоять только из цифр!")
      return
    } else if (!isAllDigits(form.pages.trim())) {
      toast.info("Поле количества страниц должно состоять только из цифр!")
      return
    }

    const response = await addNewBook({
      title: form.title.trim(),
      description: form.description.trim(),
      pages: Number(form.pages),
      author_ids: form.author_ids,
      year_of_release: Number(form.year_of_release),
      publisher_id: Number(form.publisher_id),
      genre_ids: form.genre_ids,
    })
    if (response.success){
      clearForm()
      setBookId(response.data.book_public_id || response.data.id)
      toast.success("Книга добавлена!")
    } else {
      toast.error(response.error || "Ошибка отправки!")
    }
  }

  return (
    <div className="card full-width">
      <div className="card-header">
        <h2><i className="fas fa-layer-group"></i> Управление фондом книг</h2>
        <span className="badge">полный доступ</span>
      </div>
      <div className="grid-2col">
        <div>
          <div className="section-header">
            <i className="fas fa-plus-circle"></i> Добавить книгу (издание)
          </div>
          <div className="book-form">
            <input
              name="title"
              type="text"
              placeholder="Название книги"
              value={form.title}
              onChange={handleChange}
            />
            <textarea
              name="description"
              rows="2"
              placeholder="Описание"
              value={form.description}
              onChange={handleChange}
            ></textarea>
            <input
              name="pages"
              type="text"
              placeholder="Количество страниц"
              value={form.pages}
              onChange={handleChange}
            />
            <select
              multiple
              name="author_ids"
              value={form.author_ids.map(String)}
              onChange={handleMultiSelect}
            >
              {authors.length === 0 && <option disabled value="">Авторы не найдены</option>}
              {authors.map((author) => (
                <option key={author.id} value={author.id}>{formatAuthorLabel(author)}</option>
              ))}
            </select>
            <input
              name="year_of_release"
              type="text"
              placeholder="Год выпуска"
              value={form.year_of_release}
              onChange={handleChange}
            />
            <select
              name="publisher_id"
              value={form.publisher_id}
              onChange={handleChange}
            >
              <option value="">Издательство</option>
              {publishers.map((publisher) => (
                <option key={publisher.id} value={publisher.id}>{publisher.name}</option>
              ))}
            </select>
            <select
              multiple
              name="genre_ids"
              value={form.genre_ids.map(String)}
              onChange={handleMultiSelect}
            >
              {genres.length === 0 && <option disabled value="">Жанры не найдены</option>}
              {genres.map((genre) => (
                <option key={genre.id} value={genre.id}>{genre.name}</option>
              ))}
            </select>

            <div className="upload-container">
              <label className="btn-sm btn-dark">
                <i className="fas fa-upload"></i> Загрузить обложку
                <input type="file" accept="image/*" style={{ display: 'none' }} onChange={handleUploadFile}/>
              </label>
              <div>
                {filename ? (
                    <label style={{ cursor: 'pointer' }} onClick={cancelDownloadFile}>
                        <i className="fa fa-times-circle" aria-hidden="true"></i>
                    </label>
                ) : ""}
              </div>
              <span className="upload-hint">{filename || 'PNG, JPG до 2MB'}</span>
            </div>
            {bookId && (
              <div className="inventory-message">
                Книга добавлена, ID книги:
                <span className="inventory-number" onClick={() => copyField(bookId)}>{bookId}</span>
              </div>
            )}
            <span className="btn-sm btn-primary submit-button" onClick={handleSubmit}>
              <i className="fas fa-save"></i> Добавить издание
            </span>
          </div>
        </div>
        <AddingBookCopy />
      </div>
    </div>
  )
}

export default BookFundManagement
