import SearchBookForm from "./SearchBookForm"
import ProfileLink from "./ProfileLink";

function Header() {
    return (
        <header className="header">
            <div className="logo-area">
                <i className="fas fa-book-open logo-icon"></i>
                <span className="logo-text">Книжный червь</span>
                <span className="logo-tagline">библиотека</span>
            </div>

            <SearchBookForm/>

            <ProfileLink 
                className="profile-icon" 
                title="Личный кабинет" 
            />
        </header>
    );
}

export default Header