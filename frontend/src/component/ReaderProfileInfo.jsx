import { useEffect, useState } from 'react';
import { logout } from '../services/logout';
import { formatDate } from '../services/formatDate';
import { displayPhone } from '../services/displayPhone';
import { getUserInfo } from "../services/getUserInfo"
import { toast } from '../hooks/useToast';

function ReaderProfileInfo ({ showFines, setShowFines }) {
  const [userData, setUserData] = useState(null)
  const [loading, setLoading] = useState(true)

  const copyId = (text) => {
        navigator.clipboard.writeText(text)
    }

  useEffect(() => {
      const getUser = async () => {
        const user = await getUserInfo()
        if (user.success){
          setUserData(user.data)
          setLoading(false)
        } else {
          toast.error("Ошибка получения данных")
        }
      }
      getUser()
    }, [])
    console.log(userData)

    const idDisplay = loading 
    ? <span className="fas fa-spinner fa-pulse" style={{ marginLeft: 'auto' }}></span>
    : <span className="info-value" style={{cursor: "pointer"}} onClick={() => copyId(userData?.id)}>
        {userData?.id ?? "ID"}
    </span>

    const firstNameLastNameDisplay = loading 
    ? <span className="fas fa-spinner fa-pulse" style={{ marginLeft: 'auto' }}></span>
    : <div className="user-name">{userData.first_name} {userData.last_name}</div>

    const phoneDisplay = loading 
    ? <span className="fas fa-spinner fa-pulse" style={{ marginLeft: 'auto' }}></span>
    : <span className="info-value">{displayPhone(userData.phone_number)}</span>

    const dateDisplay = loading 
    ? <span className="fas fa-spinner fa-pulse" style={{ marginLeft: 'auto' }}></span>
    : <span className="info-value">{formatDate(userData.date_of_create)}</span>

    return (
        <div className="profile-card">
          <div className="avatar-large">
            <div className="avatar-circle">
              <i className="fas fa-user-astronaut"></i>
            </div>
          </div>
          {firstNameLastNameDisplay}
          <div style={{ textAlign: "center" }}>
            <span className="user-role">
              <i className="fas fa-gem"></i> Постоянный читатель · Premium
            </span>
          </div>

          <div className="info-row">
            <i className="fas fa-id-card"></i>
            <span className="info-label">ID читателя</span>
            {idDisplay}
          </div>
          <div className="info-row">
            <i className="fas fa-phone-alt"></i>
            <span className="info-label">Телефон</span>
            {phoneDisplay}
          </div>
          <div className="info-row">
            <i className="fas fa-calendar-check"></i>
            <span className="info-label">Регистрация</span>
            {dateDisplay}
          </div>
          {/* <div className="info-row">
            <i className="fas fa-book-reader"></i>
            <span className="info-label">Всего книг</span>
            <span className="info-value">{readerHistoryCount} (за всё время)</span>
          </div> */}

          <div className="settings-group">
            <div className="double-buttons">
              <button className="sec-btn">
                <i className="fas fa-user-edit"></i> Редактировать
              </button>
              <button className="sec-btn">
                <i className="fas fa-key"></i> Сменить пароль
              </button>
            </div>
            <button className="sec-btn logout-full" onClick={() => logout()}>
              <i className="fas fa-sign-out-alt"></i> Выйти из профиля
            </button>
            {/* Кнопка для переключения отображения штрафов (для тестирования) */}
            <button 
              className="sec-btn" 
              onClick={() => setShowFines(!showFines)}
              style={{ marginTop: '8px', justifyContent: 'center' }}
            >
              <i className="fas fa-exclamation-triangle"></i> 
              {showFines ? 'Скрыть' : 'Показать'} штрафы
            </button>
          </div>
        </div>
    )
}

export default ReaderProfileInfo