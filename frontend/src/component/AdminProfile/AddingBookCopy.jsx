function AddingBookCopy () {
    return (
    <div>
        <div style={{ fontWeight: 600, marginBottom: '18px', fontSize: '16px' }}><i className="fas fa-copy"></i> Добавить физическую копию</div>
        <div className="book-form">
            <div className="admin-search-wrapper" style={{ marginBottom: '12px' }}>
                <input type="text" placeholder="ID книги (издания) для копии" />
                <button><i className="fas fa-search"></i> Поиск</button>
            </div>
            <input type="text" placeholder="Инвентарный номер (уникальный)" />
            <select>
                <option>В наличии</option>
                <option>Выдана</option>
                <option>Списана</option>
                <option>Ремонт</option>
            </select>
            <span className="btn-sm btn-success" style={{ alignSelf: 'flex-start' }}><i className="fas fa-plus"></i> Добавить копию</span>
        </div>
            <div className="profile-preview" style={{ marginTop: '20px', background: '#f1ebe6' }}>
            <div className="profile-row"><span><i className="fas fa-info-circle"></i> Пример: книга «Мастер и Маргарита» (ID: B-101) — добавлено 3 копии (INV-101, INV-102, INV-103)</span></div>
        </div>
    </div>
    )
}
export default AddingBookCopy