import { useState, useEffect } from "react"
import { getUserByPhone } from "../services/getUserByPhone"
import { checkPhoneNumber } from "../services/fieldChecker"

function SearchUser({ setMessage }) {
    const [loading, setLoading] = useState(false)

    // Состояния для поиска читателя
    const [readerQuery, setReaderQuery] = useState("")
    const [readerResult, setReaderResult] = useState(null)
    const [readerLoading, setReaderLoading] = useState(false)

    const copyId = (text) => {
        navigator.clipboard.writeText(text)
        alert(`Скопировано: ${text}`)
    }

    const formatDateWithTime = (dateString) => {
        const date = new Date(dateString)
        return date.toLocaleString('ru-RU') // "22.04.2026, 00:00:00"
    }

    const searchReader = async () => {
        if (checkPhoneNumber(readerQuery).status === "flex") {
            setMessage({ type: 'error', text: checkPhoneNumber(readerQuery).message})
            return
        }
        setReaderLoading(true)
        const result = await getUserByPhone(readerQuery)
        const response = result.data
        if (result.success) {
            setReaderResult({
                id: response.id || 123,
                lastName: response.last_name || "Петров",
                firstName: response.first_name || "Иван",
                phone: response.phone_number || "+7 (999) 123-45-67",
                role: response.role === "manager" ? "Менеджер" : response.role === "admin" ? "Администратор" : "Читатель",
                createdAt: formatDateWithTime(response.date_of_create) || "15.03.2023",
                updatedAt: formatDateWithTime(response.date_of_update) || "10.01.2024",
                isActive: response.is_active,
                activeLoans: response.activeLoans || 2,
                debts: response.debts || 0
            })
                setMessage({ type: 'success', text: 'Читатель найден' })
            } else {
                setReaderResult(null)
                setMessage({ type: 'error', text: 'Читатель не найден' })
            }
            setReaderLoading(false)
    }

    return (
        <div>
            <div style={{ fontWeight: 600, marginBottom: '16px' }}>
                <i className="fas fa-user"></i> Поиск читателя
            </div>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
                <input
                    type="text"
                    placeholder="ID или номер телефона"
                    className="input-field"
                    style={{ flex: 1, padding: '12px 16px', borderRadius: '60px', border: '1px solid #e7dfd7' }}
                    value={readerQuery}
                    onChange={(e) => setReaderQuery(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && searchReader()}
                />
                <span
                    className="btn-sm btn-primary"
                    onClick={searchReader}
                    style={{ cursor: 'pointer', padding: '8px 20px' }}
                >
                    {readerLoading ? <i className="fas fa-spinner fa-pulse"></i> : <i className="fas fa-search"></i>} Найти
                </span>
            </div>

            {readerResult && (
                <div style={{
                    background: '#fefcf9',
                    borderRadius: '24px',
                    border: '1px solid #e0d6cd',
                    padding: '20px'
                }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                        <h3 style={{ fontSize: '18px', fontWeight: 600, color: '#3a2e28' }}>
                            <i className="fas fa-user-circle"></i> {readerResult.lastName} {readerResult.firstName}
                        </h3>
                        <span className={`status-badge ${readerResult.isActive ? 'status-ready' : 'status-critical'}`}>
                            <i className={`fas ${readerResult.isActive ? 'fa-check-circle' : 'fa-ban'}`}></i>
                            {readerResult.isActive ? ' Активен' : ' Неактивен'}
                        </span>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                            {/* <div style={{cursor: "pointer"}}><i className="fas fa-id-card"></i> <strong>ID:</strong> {readerResult.id}</div> */}
                            <div>
                                <i className="fas fa-id-card"></i>
                                <strong>ID:</strong>
                                <span
                                    style={{cursor: "pointer"}}
                                    onClick={() => copyId(readerResult.id)}
                                    >{readerResult.id}
                                </span>
                            </div>
                            <div><i className="fas fa-phone"></i> <strong>Телефон:</strong> {readerResult.phone}</div>
                        </div>

                        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                            <div><i className="fas fa-tag"></i> <strong>Роль:</strong> {readerResult.role}</div>
                        </div>

                        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', fontSize: '13px', color: '#8f7f71' }}>
                            <div><i className="fas fa-calendar-plus"></i> <strong>Дата создания:</strong> {readerResult.createdAt}</div>
                            <div><i className="fas fa-calendar-edit"></i> <strong>Дата редактирования:</strong> {readerResult.updatedAt}</div>
                        </div>

                        <div style={{ display: 'flex', gap: '20px', paddingTop: '12px', borderTop: '1px solid #ede5dd' }}>
                            <div style={{ textAlign: 'center' }}>
                                <div style={{ fontSize: '24px', fontWeight: 700, color: '#6b4e3a' }}>{readerResult.activeLoans}</div>
                                <div style={{ fontSize: '12px', color: '#8f7f71' }}>Книг на руках</div>
                            </div>
                            <div style={{ textAlign: 'center' }}>
                                <div style={{ fontSize: '24px', fontWeight: 700, color: readerResult.debts > 0 ? '#bb5b2c' : '#2d6a4f' }}>
                                    {readerResult.debts}
                                </div>
                                <div style={{ fontSize: '12px', color: '#8f7f71' }}>Задолженность</div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default SearchUser