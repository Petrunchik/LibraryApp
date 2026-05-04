import { useState } from "react";
import { createReservation } from "../services/createReservation";
import { toast } from "../hooks/useToast";

function PopUpWindow({ isOpen, onClose, bookData }) {

  const [showButton, setShowButton] = useState(true)

  if (!isOpen) return null

  const copyId = (text) => {
    navigator.clipboard.writeText(text)
  } 

  const toBook = async (bookId) => { 
    const result = await createReservation(bookId)
    setShowButton(!showButton)
    // Используем addToast из ToastContainer через ref
      if (result?.errorStatus === 400) {
        toast.warning("Запрос уже отправлен")
      } else if (result?.errorStatus === 200 || !result?.errorStatus) {
        toast.success("Книга успешно забронирована!")
      } else if (result?.errorStatus === 401 || !result?.errorStatus) {
        toast.error("Для этого действия необходимо авторизироваться!")
      } else {
        toast.error("Ошибка при бронировании");
      }
    
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        {/* Крестик закрытия */}
        <button className="modal-close-btn" onClick={onClose}>
          <i className="fas fa-times"></i>
        </button>

        <div className="modal-content">
          {/* Левая колонка - обложка и статистика */}
          <div className="modal-left">
            <div className="modal-cover">
              {bookData?.image_url ? (
                <img src={bookData.image_url} alt={bookData.title} />
              ) : (
                <i className="fas fa-book-open"></i>
              )}
            </div>
            <div className="modal-stats">
              <div className="stat-item">
                <i className="fas fa-star"></i>
                <span>{bookData?.rating} · {bookData?.totalRatingCount} оценок</span>
              </div>
              <div className="stat-item">
                <i className="fas fa-bookmark"></i>
                <span>{bookData?.pages || '384'} стр.</span>
              </div>
              <div className="stat-item">
                <i className="fas fa-language"></i>
                <span>{bookData?.language || 'Русский'}</span>
              </div>
              <div className="stat-item">
                <i className="fas fa-calendar-alt"></i>
                <span>Возраст: {bookData?.age || '16+'}</span>
              </div>
            </div>
          </div>

          {/* Правая колонка - детальная информация */}
          <div className="modal-right">
            <h2 className="modal-book-title">{bookData?.title || 'Название книги'}</h2>
            <p className="modal-book-author">{bookData?.author || 'Автор'}</p>

            <div className="modal-meta-grid">
              <div className="meta-pair">
                <span className="meta-label">Издательство</span>
                <span className="meta-value">{bookData?.publisher || '—'}</span>
              </div>
              <div className="meta-pair">
                <span className="meta-label">Год издания</span>
                <span className="meta-value">{bookData?.year || '—'}</span>
              </div>
              <div className="meta-pair">
                <span className="meta-label">Жанр</span>
                <span className="meta-value">{bookData?.genre || '—'}</span>
              </div>
              <div className="meta-pair">
                <span className="meta-label">ID книги</span>
                <span
                  className="meta-value"
                  onClick={() => copyId(bookData?.id || '—')}
                  style={{"cursor": "pointer"}}
                >{bookData?.id || '—'}</span>
              </div>
            </div>

            <div className="modal-description">
              <h4>Описание</h4>
              <p>{bookData?.description || 'Описание отсутствует'}</p>
            </div>

            <div className="modal-actions">
              <span className={`modal-availability ${bookData?.availability === 'В наличии' ? 'in-stock' : 'out-of-stock'}`}>
                <i className={bookData?.availability === 'В наличии' ? 'fas fa-check-circle' : 'fas fa-clock'}></i>
                {bookData?.availability || 'В наличии'}
              </span>
              <button
                className="modal-primary-btn"
                style={{display: bookData.availability === "Ожидается" ? "" : "none"}}
                onClick={() => toBook(bookData.id)}
              >
                <i className="fas fa-book-reader"></i> Забронировать
              </button>
            </div>

            <div className="modal-extra">
              <div className="extra-tags">
                {bookData?.tags?.length > 0 ? (
                  bookData.tags.map((tag, idx) => (
                    <span key={idx} className="tag">#{tag}</span>
                  ))
                ) : (
                  <span className="tag">#книга</span>
                )}
              </div>
              {bookData?.location && (
                <p className="extra-note">
                  <i className="fas fa-map-pin"></i> {bookData.location}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PopUpWindow