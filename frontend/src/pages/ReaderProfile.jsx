import { useState } from 'react';
import '../style/ReaderPageStyle.css'
import ReaderProfileInfo from '../component/ReaderProfileInfo';
import FineInfo from '../component/FineInfo';
import MyPossession from '../component/MyPossession';
import ReadingProfileHistory from '../component/ReadingProfileHistory';
import ReservationProfile from '../component/ReservationProfile';
import { RedirectToHome } from '../services/redirectToHome';

function ReaderProfile() {
  // Состояние для отображения блока штрафов
  const [showFines, setShowFines] = useState(false);
  return (
    <div className="profile-container">
      {/* ШАПКА: поиск по центру */}
      <header className="header">
        <div className="logo-area" style={{cursor: "pointer"}} onClick={() => RedirectToHome()}>
          <i className="fas fa-book-open logo-icon"></i>
          <span className="logo-text">Книжный червь</span>
          <span className="logo-tagline">библиотека</span>
        </div>
        <div className="header-placeholder"></div>
      </header>

      
      <div className="profile-grid">
        {/* ЛЕВАЯ КОЛОНКА (без горизонтального скролла) */}
        <ReaderProfileInfo showFines={showFines} setShowFines={setShowFines}/>

        {/* ПРАВАЯ ЧАСТЬ */}
        <div className="history-section">
          {/* БЛОК ШТРАФОВ — отображение зависит от состояния showFines */}
          <FineInfo showFines={showFines}/>

          {/* Сейчас на руках */}
          <MyPossession/>

          {/* История чтения */}
          <ReadingProfileHistory />

          {/* АКТИВНЫЕ БРОНИРОВАНИЯ (карточки) */}
          <ReservationProfile />
        </div>
      </div>

      <div className="footer-note">
        <i className="far fa-bookmark"></i> Личный кабинет • Управление подпиской, штрафами и историей • Поддержка: support@knizhnycherv.ru
      </div>
    </div>
  );
}

export default ReaderProfile