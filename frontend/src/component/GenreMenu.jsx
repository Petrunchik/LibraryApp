function GenreMenu() {
    return (
        // {/* дополнительное выпадающее меню (жанр) — для красоты */}
          <div className="custom-dropdown">
            <div className="dropdown-btn">
              <i className="fas fa-tags"></i> Жанр
              <i className="fas fa-chevron-down"></i>
            </div>
            <div className="dropdown-menu">
              <div className="dropdown-item"><i className="fas fa-check-circle" style={{color: '#6b4e3a'}}></i> Все книги</div>
              <div className="divider"></div>
              <div className="dropdown-item"><i className="fas fa-dragon"></i> Фэнтези</div>
              <div className="dropdown-item"><i className="fas fa-robot"></i> Научная фантастика</div>
              <div className="dropdown-item"><i className="fas fa-mask"></i> Мистика</div>
              <div className="dropdown-item"><i className="fas fa-tree"></i> Приключения</div>
            </div>
          </div>
    )
}

export default GenreMenu