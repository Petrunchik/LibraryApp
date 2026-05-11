import { useState } from "react"
import SearchUser from "./SearchUser"
import SearchBook from "./SearchBook"

function SearchReaderOrBook() {
    const [message, setMessage] = useState(null)
    return (
        <div className="card">
            <div className="card-header">
                <h2><i className="fas fa-search"></i> Поиск читателя или книги</h2>
            </div>

            <div className="grid-2col" style={{ marginBottom: '24px' }}>
                {/* Левая сторона - поиск читателя */}
                <SearchUser setMessage={setMessage}/>

                {/* Правая сторона - поиск книги */}
                <SearchBook setMessage={setMessage} title="Поиск книги"/>
            </div>
            
            {/* Блок сообщений */}
            <div style={{ marginTop: '12px', borderTop: '1px solid #ede5dd', paddingTop: '18px' }}>
                {message ? (
                    <div style={{ 
                        padding: '14px 18px', 
                        borderRadius: '20px',
                        backgroundColor: message.type === 'success' ? '#e1f0e4' : '#ffe1d6',
                        color: message.type === 'success' ? '#2d6a4f' : '#bb5b2c',
                        border: `1px solid ${message.type === 'success' ? '#c8e0d0' : '#fcd0bf'}`,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px'
                    }}>
                        <i className={`fas ${message.type === 'success' ? 'fa-check-circle' : 'fa-exclamation-triangle'}`} style={{ fontSize: '20px' }}></i>
                        <div>
                            <div style={{ fontWeight: 600, marginBottom: '4px' }}>
                                {message.type === 'success' ? 'Успешно!' : 'Ошибка'}
                            </div>
                            <div style={{ fontSize: '14px' }}>{message.text}</div>
                        </div>
                        <button 
                            onClick={() => setMessage(null)}
                            style={{ 
                                marginLeft: 'auto', 
                                background: 'none', 
                                border: 'none', 
                                cursor: 'pointer',
                                color: 'inherit',
                                fontSize: '16px'
                            }}
                        >
                            <i className="fas fa-times"></i>
                        </button>
                    </div>
                ) : (
                    <div style={{ textAlign: 'center', padding: '24px', color: '#a39283' }}>
                        <i className="fas fa-info-circle" style={{ marginRight: '8px' }}></i>
                        Введите данные для поиска читателя или книги
                    </div>
                )}
            </div>
        </div>
    )
}

export default SearchReaderOrBook