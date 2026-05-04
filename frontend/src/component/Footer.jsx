import '../index.css'

function Footer() {
    return (
        <div className="footer-note">
        {/* совсем маленький декоративный элемент, подчёркивающий интерфейс библиотеки */}
            <i className="far fa-bookmark" style={{marginRight: '8px'}}></i> 
            Добро пожаловать в уютный книжный уголок • Сегодня открыты до 21:00
        </div>
    )
}

export default Footer