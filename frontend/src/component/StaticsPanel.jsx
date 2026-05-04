function StaticsPanel () {
    return (
        <div className="stats-row">
            <div><i className="fas fa-book"></i> Книг в фонде: <strong>2 410</strong></div>
            <div><i className="fas fa-users"></i> Активных читателей: <strong>187</strong></div>
            <div><i className="fas fa-clock"></i> Бронирований сегодня: <strong>12</strong></div>
            <div><i className="fas fa-coins"></i> Общая сумма штрафов: <strong>8 450 ₽</strong></div>
            <div><i className="fas fa-bell"></i> Непросмотренных уведомлений: <strong>3</strong></div>
        </div>
    )
}

export default StaticsPanel