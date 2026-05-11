import { useState } from "react"
import AddingBookCopy from "./AddingBookCopy"
import { addNewBook } from "../../services/adminProfile"
import { toast } from "../../hooks/useToast"
import { isAllDigits } from "../../services/fieldChecker"
import { copyField } from "../../services/copyField"

function BookFundManagement () {
  const [bookId, setBookId] = useState(null)
  const [form, setForm] = useState({
    title: "",
    description: "",
    pages: "",
    author: "",
    year_of_release: "",
    publisher: "",
    genre: "",
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(prev => ({...prev, [name]: value}))
  }

  const clearForm = () => {
    setForm({
      title: "",
      description: "",
      pages: "",
      author: "",
      year_of_release: "",
      publisher: "",
      genre: "",
      image_url: null,
    })
  }

  const handleSubmit = async () => {
    if (
      (form.title?.trim().length === 0) 
      || (form.description?.trim().length === 0)
      || (form.pages?.trim().length === 0)
      || (form.author?.trim().length === 0)
      || (form.year_of_release?.trim().length === 0)
      || (form.publisher?.trim().length === 0)
      || (form.genre?.trim().length === 0)
    ){
      toast.info("Все поля обязательны к заполнению!")
    } else if (!isAllDigits(form.year_of_release.trim()) || !(Number(form.year_of_release?.trim()) > 1000 && Number(form.year_of_release?.trim()) < 2026)) {
      toast.info("Поле года выпуска должно быть от 1000 до 2026 года и состоять только из цифр!")
    } else if (!isAllDigits(form.pages.trim())) {
      toast.info("Поле количества страниц должно состоять только из цифр!")
    }
    const response = await addNewBook(form)
    if (response.success){
      clearForm()
      setBookId(response.data.id)
      toast.success("Книга добавлена!")
    } else {
      toast.error("Ошибка отправки!")
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
            <input
              name="author"
              type="text"
              placeholder="Автор (Фамилия Имя)"
              value={form.author}
              onChange={handleChange}
            />
            <input
              name="year_of_release"
              type="text"
              placeholder="Год выпуска"
              value={form.year_of_release}
              onChange={handleChange}
            />
            <input
              name="publisher"
              type="text"
              placeholder="Издательство"
              value={form.publisher}
              onChange={handleChange}
            />
            <input
              name="genre"
              type="text"
              placeholder="Жанр"
              value={form.genre}
              onChange={handleChange}
            />

            <div className="upload-container">
              <span className="btn-sm btn-dark">
                <i className="fas fa-upload"></i> Загрузить обложку
              </span>
              <span className="upload-hint">PNG, JPG до 2MB</span>
            </div>
            <input
              type="file"
              accept="image/png, image/jpeg"
              style={{ display: 'none' }}
            />
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