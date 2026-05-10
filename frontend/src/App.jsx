import './index.css'
import Router from './Router'
import MainPage from './pages/MainPage'
import AuthorizationPage from './pages/AutorizationPage'
import PageNotFound from './pages/PageNotFound'
import ReaderProfile from './pages/ReaderProfile'
import ManagerProfile from './pages/ManagerProfile'
import AdminProfile from './pages/AdminProfile'
import Forbidden from './pages/Forbidden'
import { usePageTracking } from './services/usePageTracking'
import { UserDataContext } from './context/UserDataContext'
import { useEffect, useRef, useState } from 'react'
import { getUserInfo } from './services/getUserInfo'
import { registerToast, toast } from "./hooks/useToast"
import ToastContainer from './component/ToastContainer'

function App() {
    const [userData, setUserData] = useState(null)
    const toastRef = useRef(null);
      
    useEffect(() => {
      const getUser = async () => {
        const user = await getUserInfo()
        if (user.success){
          setUserData(user.data)
        } else {
          console.log("Ошибка получения данных пользователя, требуется авторизация")
        }
      }
      getUser()
    }, [])
    useEffect(() => {
      if (toastRef.current) {
        registerToast(toastRef.current.addToast)
      }
    }, [])
    
    const routes = {
        '/': MainPage,
        '/auth': AuthorizationPage,
        '/reader/profile': ReaderProfile,
        '/manager/profile': ManagerProfile,
        '/admin/profile': AdminProfile,
        '/forbidden': Forbidden,
        '*': PageNotFound
    }
    usePageTracking()
    return (
        <UserDataContext.Provider
        value={{
            userData,
            setUserData,
        }}>
            <Router routes={routes}/>
            <ToastContainer ref={toastRef} />
        </UserDataContext.Provider>
    )}

export default App