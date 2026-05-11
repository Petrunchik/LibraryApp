import { useState } from "react"
import SearchBook from "../SearchBook"
import { toast } from "../../hooks/useToast"
import { addBookCopy } from "../../services/adminProfile"
import { copyField } from "../../services/copyField"

function AddingBookCopy () {
    const [selectedStatus, setSelectedStatus] = useState(null)
    const [inventoryNumber, setInventoryNumber] = useState(null)
    const [data, setData] = useState({status: "В наличии"})

    const handleChange = (e) => {
        const { value } = e.target
        setSelectedStatus(value)
        setData(prev => ({...prev, status: value}))
    }

    const handleSubmit = async () => {
        if (!data || !data.book){
            toast.info("Сначала надо найти книгу!")
        }
        console.log({
            "status": data.status,
            "id": data.book.id,
        })
        const response = await addBookCopy({"book_id": data.book.id, "status": data.status})
        if (response.success){
            console.log(response)
            setInventoryNumber(response.data.inventory_number)
            toast.success("Экземпляр добавлен!")
        } else {
            toast.error("Ошибка добавления копии!")
        }
    }
    return (
        <div className="adding-book-copy">
            <div className="book-form">
                <SearchBook title="Добавить физическую копию" setData={setData}/>
                <select name="Список" value={selectedStatus} onChange={handleChange}>
                    <option>В наличии</option>
                    <option>Списана</option>
                    <option>Ремонт</option>
                </select>
                {inventoryNumber && (
                    <div className="inventory-message">
                        Книга добавлена, запишите инвентарный номер в книгу:
                        <span className="inventory-number" onClick={() => copyField(inventoryNumber)}>{inventoryNumber}</span>
                    </div>
                )}
                <span className="btn-sm btn-success add-button" onClick={() => handleSubmit()}>
                    <i className="fas fa-plus"></i> Добавить копию
                </span>
            </div>
        </div>
    )
}
export default AddingBookCopy