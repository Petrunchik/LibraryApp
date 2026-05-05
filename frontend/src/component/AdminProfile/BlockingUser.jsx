import { useState } from "react"
import BlockingUserInfo from "./BlockingUserInfo"
import { getUserByPhone } from "../../services/getUserByPhone"
import { toast } from "../../hooks/useToast"
import { isAllDigits } from "../../services/fieldChecker"

function BlockingUser () {
    const [userData, setUserData] = useState(null)
    const [phone, setPhone] = useState("")
    const [savedPhone, setSavedPhone] = useState("")
    const [loading, setLoading] = useState(false)

    const reloadButton = () => {
        getUser(savedPhone)
    }

    const getUser = async (searchPhone = null) => {
        const resultPhone = searchPhone !== null ? searchPhone : phone
        setLoading(true)
        setUserData(null)
        try{
            if (resultPhone?.trim().length === 0){
                toast.error("Поле обязательно к заполнению")
                return
            } else if (!isAllDigits(resultPhone?.trim())){
                toast.error("Номер телефона должен состоять только из цифр")
                return
            } else if (resultPhone?.trim().length !== 11){
                toast.error("Номер телефона должен состоять из 11 цифр")
                return
            }

            const user = await getUserByPhone(resultPhone)

            if (user.success){
                setUserData(user.data)
                setSavedPhone(resultPhone)
                setPhone("")
            } else {
                toast.error("Ошибка получения данных пользователя!")
                setPhone("")
            }
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="card">
              <div className="card-header">
                <h2><i className="fas fa-user-lock"></i> Блокировка / разблокировка</h2>
                <span className="badge">поиск по ID</span>
              </div>

              <div className="admin-search-wrapper">
                <input
                    type="text"
                    placeholder="Введите номер телефона читателя"
                    value={phone}
                    disabled={loading}
                    onInput={(e) => setPhone(e.target.value)}
                />
                <button onClick={() => getUser()}><i className="fas fa-search"></i> Найти</button>
              </div>

              {userData === null
                ? <span className="stats-row">Воспользуйтесь поиском чтобы найти пользователей</span>
                :  loading
                ? <span className="fas fa-spinner fa-pulse" style={{ marginLeft: 'auto' }}></span>
                : <BlockingUserInfo 
                    id={userData.id}
                    firstName={userData.first_name}
                    lastName={userData.last_name}
                    status={userData.is_active}
                    phone={userData.phone_number}
                    createdAt={userData.date_of_create}
                    updatedAt={userData.date_of_update}
                    activeLoans={userData.active_loans}
                    reloadButton={reloadButton}
                />}
            </div>
    )
}

export default BlockingUser