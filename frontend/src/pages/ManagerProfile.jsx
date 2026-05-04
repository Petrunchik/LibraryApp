import '../style/ManagerProfileStyle.css'
import StaticsPanel from '../component/StaticsPanel';
import Reservation from '../component/Reservation';
import LoanBook from '../component/LoanBook';
import NotificationManager from '../component/NotificationManager';
import FineManager from '../component/FineManager';
import SearchReaderOrBook from '../component/SearchReaderOrBook';

import { logout } from '../services/logout'
import { RedirectToHome } from '../services/redirectToHome';

function ManagerProfile () {

    return (
        <div className="dashboard-container">
          {/* ШАПКА */}
          <header className="header">
            <div className="logo-area" onClick={() => RedirectToHome()}>
              <i className="fas fa-book-open logo-icon"></i>
              <span className="logo-text">Книжный червь</span>
              <span className="logo-tagline">библиотека</span>
            </div>
            <div className="manager-badge">
              <i className="fas fa-user-tie"></i> Панель менеджера · Иванов А.А.
            </div>
            <div className="logout-btn" onClick={() => logout()}><i className="fas fa-sign-out-alt"></i> Выйти из профиля</div>
          </header>

          {/* ПАНЕЛЬ СТАТИСТИКИ */}
          {/* <StaticsPanel /> */}

          <div className="dashboard-grid">
            {/* 1. БЛОК: ОЖИДАЮТ ПОДТВЕРЖДЕНИЯ */}
            <Reservation />

            <SearchReaderOrBook />

            {/* 2. ВЫДАЧА КНИГ + ПРИЁМ */}
            <LoanBook />

            {/* 4. ОТПРАВКА УВЕДОМЛЕНИЙ */}
            <NotificationManager />

            {/* 5. ЧИТАТЕЛИ С ЗАДОЛЖЕННОСТЯМИ */}
            <FineManager />
          </div>

          <div style={{ marginTop: '28px', textAlign: 'center', color: '#a39283', fontSize: '14px', borderTop: '1px dashed #ddd2c8', paddingTop: '28px' }}>
            <i className="fas fa-shield-alt"></i> Панель управления библиотекой · Действия менеджера логируются
          </div>
        </div>
    )
}

export default ManagerProfile