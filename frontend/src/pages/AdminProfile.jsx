import { useEffect, useState } from 'react'
import ManagingManager from '../component/AdminProfile/ManagingManager'
import BlockingUser from '../component/AdminProfile/BlockingUser'
import { logout } from '../services/logout'
import '../style/AdminProfileStyle.css'
import { getUserInfo } from '../services/getUserInfo'
import BookFundManagement from '../component/AdminProfile/BookFundManagement'
import { RedirectToHome } from '../services/redirectToHome'
import EditOrDeleteBook from '../component/AdminProfile/EditOrDeleteBook'

function AdminProfile () {
  const [userData, setUserData] = useState(null)
  
    useEffect(() => {
          const getUser = async () => {
            const user = await getUserInfo()
            if (user.success){
              setUserData(user.data)
            } else {
              toast.error("Ошибка получения данных пользователя!")
            }
          }
          getUser()
        }, [])

    return (
        <div className="admin-container">
          {/* шапка */}
          <div className="header">
            <div className="logo-area" style={{cursor: "pointer"}} onClick={() => RedirectToHome()}>
              <i className="fas fa-book-open logo-icon"></i>
              <span className="logo-text">Книжный червь</span>
              <span className="logo-tagline">библиотека</span>
            </div>
            <div className="admin-badge">
              <i className="fas fa-crown"></i> Администратор · {userData?.first_name} {userData?.last_name}
            </div>
            <div className="logout-btn" onClick={() => logout()}><i className="fas fa-sign-out-alt"></i> Выйти</div>
          </div>

          {/* верхняя статистика */}
          <div className="stats-row">
            <div><i className="fas fa-book"></i> Книг в фонде: <strong>2 410</strong></div>
            <div><i className="fas fa-users"></i> Всего читателей: <strong>1 247</strong></div>
            <div><i className="fas fa-user-tie"></i> Менеджеров: <strong>4</strong></div>
            <div><i className="fas fa-ban"></i> Заблокировано: <strong>12</strong></div>
            <div><i className="fas fa-coins"></i> Общая сумма штрафов: <strong>8 450 ₽</strong></div>
          </div>

          <div className="dashboard-grid">
            {/* БЛОК 1: УПРАВЛЕНИЕ МЕНЕДЖЕРАМИ */}
            <ManagingManager />

            {/* БЛОК 2: ПОИСК И БЛОКИРОВКА ПОЛЬЗОВАТЕЛЕЙ */}
            <BlockingUser />

            {/* БЛОК 3: ДОБАВЛЕНИЕ КНИГИ (издание) + ФИЗИЧЕСКАЯ КОПИЯ */}
            <BookFundManagement />

            {/* БЛОК 4: РЕДАКТИРОВАТЬ / УДАЛИТЬ КНИГУ */}
            <EditOrDeleteBook />

            {/* БЛОК 5: СТАТИСТИКА И ОТЧЁТЫ */}
            <div className="card full-width">
              <div className="card-header">
                <h2><i className="fas fa-chart-pie"></i> Статистика и отчёты</h2>
                <span className="badge">аналитика</span>
              </div>
              <div className="stats-card">
                <div className="report-title"><i className="fas fa-calendar-alt"></i> Отчёты по периодам</div>
                <div className="actions">
                  <span className="btn-sm btn-primary"><i className="fas fa-chart-line"></i> Статистика за месяц</span>
                  <span className="btn-sm btn-primary"><i className="fas fa-chart-line"></i> Статистика за квартал</span>
                  <span className="btn-sm btn-primary"><i className="fas fa-chart-line"></i> Статистика за год</span>
                </div>
              </div>
              <div className="stats-card">
                <div className="report-title"><i className="fas fa-file-invoice-dollar"></i> Финансовые отчёты</div>
                <div className="actions">
                  <span className="btn-sm btn-success"><i className="fas fa-file-alt"></i> Отчёт по штрафам</span>
                  <span className="btn-sm btn-success"><i className="fas fa-chart-simple"></i> Отчёт по задолженностям</span>
                  <span className="btn-sm btn-success"><i className="fas fa-coins"></i> Сводка по оплатам</span>
                </div>
              </div>
              <div className="stats-card">
                <div className="report-title"><i className="fas fa-book"></i> Библиотечная статистика</div>
                <div className="actions">
                  <span className="btn-sm btn-info"><i className="fas fa-chart-bar"></i> Популярность книг</span>
                  <span className="btn-sm btn-info"><i className="fas fa-trend-up"></i> Динамика выдач</span>
                  <span className="btn-sm btn-info"><i className="fas fa-users"></i> Активность читателей</span>
                  <span className="btn-sm btn-info"><i className="fas fa-book-open"></i> Востребованные жанры</span>
                </div>
              </div>
              <div className="stats-card">
                <div className="report-title"><i className="fas fa-print"></i> Экспорт данных</div>
                <div className="actions">
                  <span className="btn-sm btn-dark"><i className="fas fa-file-csv"></i> Экспорт в CSV</span>
                  <span className="btn-sm btn-dark"><i className="fas fa-file-excel"></i> Экспорт в Excel</span>
                  <span className="btn-sm btn-dark"><i className="fas fa-file-pdf"></i> Экспорт в PDF</span>
                </div>
              </div>
              <div style={{ marginTop: '12px', background: '#f1ebe6', borderRadius: '20px', padding: '18px' }}>
                <i className="fas fa-chart-simple"></i> <strong>Быстрая сводка:</strong> За последний месяц выдано 1 284 книги, сумма штрафов — 2 350 ₽, самая популярная книга — «Мастер и Маргарита» (47 выдач).
              </div>
            </div>
          </div>

          <div style={{ marginTop: '28px', textAlign: 'center', color: '#a39283', fontSize: '14px', borderTop: '1px dashed #ddd2c8', paddingTop: '28px' }}>
            <i className="fas fa-shield-alt"></i> Панель администратора · Полный доступ к конфигурации библиотечной системы
          </div>
        </div>
    )
}

export default AdminProfile