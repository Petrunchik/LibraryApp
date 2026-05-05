import { toast } from "../../hooks/useToast"
import { toggleStatus } from "../../services/adminProfile"
import { copyField } from "../../services/copyField"
import { displayPhone } from "../../services/displayPhone"
import { formatDateWithTime } from "../../services/formatDate"

function BlockingUserInfo({ id, firstName, lastName, status, phone, createdAt, updatedAt, activeLoans, debt, reloadButton }) {
    const toggleUserStatus = async () => {
        const response = await toggleStatus(phone)
        if (response.success){
            toast.success(status ? "Пользователь заблокирован" : "Пользователь разблокирован")
            reloadButton()
        } else {
            toast.error(response.error)
        }
    }
    return (
        <div className="blocking-user-card">
            <div className="blocking-user-header">
                <h3 className="blocking-user-name">
                    <i className="fas fa-user-circle"></i> {firstName} {lastName}
                </h3>
                <span className={`status-badge ${status ? 'status-ready' : 'status-critical'}`}>
                    <i className={`fas ${status ? 'fa-check-circle' : 'fa-ban'}`}></i>
                    {status ? ' Активен' : ' Неактивен'}
                </span>
            </div>

            <div className="blocking-user-content">
                <div className="blocking-user-row">
                    <div>
                        <i className="fas fa-id-card"></i>
                        <strong> ID: </strong>
                        <span style={{cursor: "pointer"}} onClick={() => copyField(id)}>{id}</span>
                    </div>
                    <div>
                        <i className="fas fa-phone"></i>
                        <strong> Телефон:</strong> <span style={{cursor: "pointer"}} onClick={() => copyField(phone)}>{displayPhone(phone)}</span>
                    </div>
                </div>

                <div>
                    <i className="fas fa-calendar-plus"></i>
                    <strong> Дата создания:</strong> {createdAt ? formatDateWithTime(createdAt) : 'не указана'}
                </div>

                <div>
                    <i className="fas fa-calendar-alt"></i>
                    <strong> Дата обновления:</strong> {updatedAt ? formatDateWithTime(updatedAt) : 'не указана'}
                </div>

                <div className="blocking-user-stats">
                    <div className="blocking-user-stat-item">
                        <div className="blocking-user-stat-value">
                            {activeLoans || 0}
                        </div>
                        <div className="blocking-user-stat-label">Книг на руках</div>
                    </div>
                    <div className="blocking-user-stat-item">
                        <div className={`blocking-user-stat-value ${(debt || 0) > 0 ? 'debt-positive' : 'debt-zero'}`}>
                            {debt || 0} ₽
                        </div>
                        <div className="blocking-user-stat-label">Штраф</div>
                    </div>
                </div>

                <div className="blocking-user-actions">
                    {status
                    ? <span className="btn-sm btn-danger" onClick={() => toggleUserStatus()}>
                        <i className="fas fa-ban"></i> Заблокировать
                    </span>
                    : <span className="btn-sm btn-success" onClick={() => toggleUserStatus()}>
                        <i className="fas fa-check-circle"></i> Разблокировать
                    </span>
                    }
                    {/* <span className="btn-sm btn-warning">
                        <i className="fas fa-history"></i> История
                    </span> */}
                </div>
            </div>
        </div>
    )
}

export default BlockingUserInfo