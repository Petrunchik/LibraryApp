import { useEffect, useState } from "react"
import { toast } from "../../hooks/useToast"
import ManagingManagerInfo from "./ManagingManagerInfo"
import { addManager, managersList } from "../../services/adminProfile"

function ManagingManager () {
  const [managers, setManagers] = useState([])
  const [reload, setReload] = useState(false)
  const [loading, setLoading] = useState(true)
  const [searchData, setSearchData] = useState("")

  const reloadButton = () => setReload(!reload)

  useEffect( () => {
    setLoading(true)
    const getManagers = async () => {
      try{
        const response = await managersList()
        if (response.success){
          setManagers(response.data)
        } else {
          setManagers([])
          toast.error("При загрузке менеджеров произошла ошибка!")
      }} catch(error) {
        setManagers([])
        toast.error("Сервер недоступен, повторите попытку позднее!")
      } finally {
        setLoading(false)
      }
    }
  getManagers()
  }, [reload])

  const addNewManager = async () => {
    setLoading(true)
    try{
      if (searchData?.trim().length < 10){
        toast.error("Поле заполнено неверно")
        return
      }

      let data = {}
      if (searchData?.trim().length === 11){
        data = {"phone_number": searchData, "id": null}
      } else {
        data = {"phone_number": null, "id": searchData}
      }

      const response = await addManager(data)
      
      if (response.errorStatus === 422) {
        toast.error("Поле заполнены неверно")
      } else if (response.success) {
        toast.success("Менеджер успешно добавлен!")
        setSearchData("")
        reloadButton()
      } else if (response.errorStatus) {
        toast.error(response.error)
      }
    } catch (error) {
      toast.error("Сервер недоступен, повторите попытку позднее!")
    } finally {
      setLoading(false)
    }
    
  }
  return (
        <div className="card">
              <div className="card-header">
                <h2><i className="fas fa-user-tie"></i> Управление менеджерами</h2>
                <span className="badge" style={{cursor: "pointer"}} onClick={() => reloadButton()}>{managers?.length} активных</span>
              </div>
              <div className="admin-search-wrapper" style={{ marginBottom: '24px' }}>
                <input
                  type="text"
                  placeholder="ID или номер телефона нового менеджера"
                  value={searchData}
                  onInput={(e) => setSearchData(e.target.value)}
                />
                <button
                  onClick={() => addNewManager()}
                ><i className="fas fa-plus-circle"></i> Назначить</button>
              </div>

              <div className="manager-list">
                {loading
                ? <span className="fas fa-spinner fa-pulse" style={{ marginLeft: 'auto' }}></span>
                : managers?.length === 0
                ? <div className="stats-row" style={{ textAlign: "center"}}>Менеджеров нет</div>
                : managers?.map((manager) => {
                    return <ManagingManagerInfo 
                        key={manager.id}
                        firstName={manager.first_name}
                        lastName={manager.last_name}
                        id={manager.id}
                        phone={manager.phone_number}
                        reloadButton={reloadButton}
                    />
                })}

              </div>
          </div>
    )
}

export default ManagingManager