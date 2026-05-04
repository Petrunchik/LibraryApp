function MyPossessionDetailInfo ({ title, author, takenDate, returnToDate, imageUrl, amount, daysBeforeReturn }) {
    const status = daysBeforeReturn > 0
    ? <div className="history-status"> <i className="fas fa-check-circle"></i> Еще {daysBeforeReturn} дн. </div>
    : daysBeforeReturn < 0
    ? <div className="history-status overdue"> <i className="fas fa-exclamation-circle"></i> Просрочена на {Math.abs(daysBeforeReturn)} дн.</div>
    : <div className="history-status overdue"> <i className="fas fa-exclamation-circle"></i> Сегодня последний день </div> 

    return (
        <div className="history-item">
            <div className="history-cover">
                  <img className="history-cover" src={imageUrl} alt={title}></img>
                </div>
            
                <div className="history-info">
                    <div className="history-title">{title} · {author}</div>
                    <div className="history-meta">
                        <span>
                            <i className="far fa-calendar-alt"></i> Взята: {takenDate}
                        </span>
                        <span>
                            <i className="far fa-clock"></i> Вернуть до: {returnToDate}
                        </span>
                    </div>
                </div>

                {status}

              </div>
    )
}

export default MyPossessionDetailInfo