import { toast } from "../../hooks/useToast"
import { displayPhone } from "../../services/displayPhone"
import { copyField } from "../../services/copyField"
import { demoteManager } from "../../services/adminProfile"

function ManagingManagerInfo ({ firstName, lastName, id, phone, reloadButton }) {

    const demote = async () => {
        const response = await demoteManager({"phone": phone})
        if (response.success){
            toast.info("Менеджер удален")
            reloadButton()
        } else {
            toast.error(response.error)
        }
    }

    return (
    <div className="manager-item">
        <div className="manager-info">
            <h4>{firstName} {lastName}</h4>
            <div className="manager-meta">
                ID: <span
                    style={{cursor: "pointer"}}
                    onClick={() => copyField(id)}
                >{id}</span> · phone: <span></span>
                <span
                    style={{cursor: "pointer"}}
                    onClick={() => copyField(phone)}
                > {displayPhone(phone)}</span>
            </div>
        </div>
        <div className="actions">
            <span
                className="btn-sm btn-warning"
                onClick={() => demote()}>
                    <i className="fas fa-user-minus"></i>Лишить прав
            </span>
            {/* <span
                className="btn-sm btn-dark"
                onClick={() => toast.info("Редактирование менеджера")}>
                    <i className="fas fa-edit"></i> Редактировать
            </span> */}
        </div>
    </div>
    )
}

export default ManagingManagerInfo