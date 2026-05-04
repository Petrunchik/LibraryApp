import { useState } from 'react'
import { issueBook } from '../services/issueBook'
import { returnBook } from '../services/returnBook'

function LoanBook () {
    const [message, setMessage] = useState(null) // { type: 'success' | 'error', text: string }

    const [readerId, setReaderId] = useState('')
    const [bookCopyId, setBookCopyId] = useState('')
    const [days, setDays] = useState('')

    const [returnBookCopyId, setReturnBookCopyId] = useState('')
    const [returnComment, setReturnComment] = useState('')

    const clearAllField = () => {
        setReaderId('')
        setBookCopyId('')
        setDays('')
    }
    const clearAllReturnField = () => {
        setReturnBookCopyId('')
        setReturnComment('')
    }
    const handleReturnIssue = async () => {
        let isValid = true
        if (returnBookCopyId.trim().length === 0) {
            setMessage({
                type: 'error',
                text: 'Поле ID книги обязательно к заполнению'
            })
            isValid = false
        }

        if (isValid) {
            const result = await returnBook({ returnBookCopyId, returnComment })
            if(result.success){
                clearAllReturnField()
                setMessage({
                    type: 'success',
                    text: `Книга успешно возвращена!`
                })
            } else {
                setMessage({
                    type: 'error',
                    text: 'Книга не возвращена. Проверьте инвентарный номер.'
                })
            }
        }
        
        // Очистить сообщение через 5 секунд
        setTimeout(() => setMessage(null), 5000)
    }

    const handleIssue = async () => {
        let isValid = true
        if (bookCopyId.trim().length === 0) {
            setMessage({
                type: 'error',
                text: 'Поле ID книги обязательно к заполнению'
            })
            isValid = false
        } else if (readerId.trim().length === 0){
            setMessage({
                type: 'error',
                text: 'Поле ID читателя обязательно к заполнению'
            })
            isValid = false
        } else if (days < 1) {
            setMessage({
                type: 'error',
                text: 'Количество дней на прочтение должно быть больше 0'
            })
            isValid = false
        }
        if (isValid) {
            const result = await issueBook({ readerId, bookCopyId, days })
            if(result.success){
                clearAllField()
                setMessage({
                    type: 'success',
                    text: `Книга успешно выдана! Ориентировочный срок возврата: ${days} дней (до ` + new Date(Date.now() + days*24*3600*1000).toLocaleDateString() + ')'
                })
            } else {
                setMessage({
                    type: 'error',
                    text: 'Книга не выдана. Проверьте инвентарный номер, ID читателя и количество дней.'
                })
            }
        }
        
        // Очистить сообщение через 5 секунд
        setTimeout(() => setMessage(null), 5000)
    }
    
    return (
        <div className="card">
            <div className="card-header">
                <h2><i className="fas fa-hand-holding-heart"></i> Выдача / приём книг</h2>
                <span className="badge">операции</span>
            </div>
            <div className="grid-2col" style={{ marginBottom: '16px' }}>
                <div>
                    <div style={{ fontWeight: 600, marginBottom: '10px' }}><i className="fas fa-book-open"></i> Выдать книгу</div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                            <input
                                type="text"
                                placeholder="Уникальный номер книги"
                                className="input-field"
                                style={{ flex: 1, padding: '10px', borderRadius: '60px', border: '1px solid #e7dfd7' }}
                                value={bookCopyId}
                                onChange={(e) => setBookCopyId(e.target.value)}
                            />
                            <input
                                type="text"
                                placeholder="ID читателя"
                                className="input-field"
                                style={{ flex: 1, padding: '10px', borderRadius: '60px', border: '1px solid #e7dfd7' }}
                                value={readerId}
                                onChange={(e) => setReaderId(e.target.value)}
                            />
                        </div>
                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                            <input 
                                type="number" 
                                placeholder="Кол-во дней на прочтение" 
                                min="1"
                                className="input-field"
                                style={{ flex: 1, padding: '10px', borderRadius: '60px', border: '1px solid #e7dfd7' }}
                                value={days}
                                onChange={(e) => setDays(e.target.value)}
                            />
                            <span className="btn-sm btn-primary" onClick={handleIssue} style={{ cursor: 'pointer' }}>Выдать</span>
                        </div>
                    </div>
                </div>
                <div>
                    <div style={{ fontWeight: 600, marginBottom: '10px' }}><i className="fas fa-undo-alt"></i> Принять возврат</div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                            <input
                                type="text"
                                placeholder="Уникальный номер книги"
                                className="input-field"
                                style={{ flex: 1, padding: '10px', borderRadius: '60px', border: '1px solid #e7dfd7' }}
                                value={returnBookCopyId}
                                onChange={(e) => setReturnBookCopyId(e.target.value)}
                            />
                            <span
                                className="btn-sm btn-success"
                                onClick={handleReturnIssue}
                                style={{ cursor: 'pointer' }}
                                >Принять</span>
                        </div>
                        <div>
                            <input
                                type="text"
                                placeholder="Комментарий к возврату (опционально)"
                                className="input-field"
                                style={{ width: '100%', padding: '10px', borderRadius: '60px', border: '1px solid #e7dfd7' }} 
                                value={returnComment}
                                onChange={(e) => setReturnComment(e.target.value)}
                            />
                        </div>
                    </div>
                </div>
            </div>
            
            {/* Блок сообщений вместо последних операций */}
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
                        gap: '12px',
                        animation: 'fadeIn 0.3s ease'
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
                        Выполните операцию выдачи или возврата
                    </div>
                )}
            </div>
            
            <style>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(-10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </div>
    )
}

export default LoanBook