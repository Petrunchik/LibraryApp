function FineManager () {
    return (
        <div className="card full-width">
              <div className="card-header">
                <h2><i className="fas fa-exclamation-triangle"></i> Читатели с задолженностями & управление штрафами</h2>
                <span className="badge">3 должника</span>
              </div>
              <div style={{ overflowX: 'auto' }}>
                <table className="debt-table">
                  <thead>
                    <tr>
                      <th style={{ textAlign: 'left', padding: '12px 8px' }}>Читатель</th>
                      <th>Книга</th>
                      <th>Просрочка</th>
                      <th>Штраф</th>
                      <th>Действия</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr style={{ borderBottom: '1px solid #ede5dd' }}>
                      <td style={{ padding: '14px 8px' }}>Александра Громова</td>
                      <td>Ведьмак. Кровь эльфов</td>
                      <td>4 дня</td>
                      <td>200 ₽</td>
                      <td><span className="btn-sm btn-success">Списать штраф</span> <span className="btn-sm btn-warning">Напомнить</span></td>
                    </tr>
                    <tr style={{ borderBottom: '1px solid #ede5dd' }}>
                      <td style={{ padding: '14px 8px' }}>Дмитрий Волков</td>
                      <td>Преступление и наказание</td>
                      <td>12 дней</td>
                      <td>600 ₽</td>
                      <td><span className="btn-sm btn-success">Списать частично</span> <span className="btn-sm btn-danger">Заблокировать выдачу</span></td>
                    </tr>
                    <tr style={{ borderBottom: '1px solid #ede5dd' }}>
                      <td style={{ padding: '14px 8px' }}>Елена Морозова</td>
                      <td>1984</td>
                      <td>2 дня</td>
                      <td>100 ₽</td>
                      <td><span className="btn-sm btn-success">Оплачен (отметить)</span> <span className="btn-sm btn-primary">Продление</span></td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                <span className="btn-sm btn-primary"><i className="fas fa-file-invoice-dollar"></i> Сформировать отчёт по штрафам</span>
                <span className="btn-sm btn-warning"><i className="fas fa-envelope"></i> Массовое уведомление должникам</span>
              </div>
            </div>
    )
}
export default FineManager