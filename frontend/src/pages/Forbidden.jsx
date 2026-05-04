function Forbidden() {
  return (
    <div className="error-container">
      {/* Логотип библиотеки */}
      <div className="logo-area">
        <span className="logo-text">Книжный червь</span>
        <span className="logo-tagline">библиотека</span>
      </div>

      {/* Основной контент ошибки */}
      <div className="error-content">
        <div className="error-code">403</div>
        <h1 className="error-title">Доступ запрещён</h1>
        <p className="error-description">
          У вас недостаточно прав для просмотра этого ресурса. Если вы считаете, что это ошибка, обратитесь к администратору сайта.
        </p>
        <a href="/" className="btn-primary">
          Вернуться на главную
        </a>
      </div>

      {/* Подвал */}
      <div className="footer-note">
        Если вы уверены, что страница должна быть здесь — напишите библиотекарю
      </div>
    </div>
  );
}

export default Forbidden;