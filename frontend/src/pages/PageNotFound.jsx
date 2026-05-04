function PageNotFound() {
  return (
    <div className="error-container">
      {/* Логотип библиотеки */}
      <div className="logo-area">
        <span className="logo-text">Книжный червь</span>
        <span className="logo-tagline">библиотека</span>
      </div>

      {/* Основной контент ошибки */}
      <div className="error-content">
        <div className="error-code">404</div>
        <h1 className="error-title">Страница не найдена</h1>
        <p className="error-description">
          Кажется, эта книга стоит не на той полке. Страница, которую вы ищете,
          была убрана в архив или никогда не существовала.
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

export default PageNotFound;