import { useContext, useEffect } from 'react'
import { useRoute } from '../Router'
import { UserDataContext } from '../context/UserDataContext'
import { getPath } from './getPath'
import { navigateTo } from './navigateTo'
import { getUserInfo } from './getUserInfo'

export const usePageTracking = () => {
    const path = useRoute()

    // const userData = useContext(UserDataContext)
    
    useEffect(() =>  {
        // Выполняется при каждом изменении path
        const getData = async () => {
            const response = await getUserInfo()

            let role = null

            if (response.success) {
                role = response.data.role
            } else {
                console.log("Ошибка получения роли")
            }
        
            // Обновление title
            const titles = {
                '/': 'Библиотека · Главная',
                '/auth': "Библиотека · Регистрация · Вход",
                '/reader/profile': "Библиотека · Личный кабинет читателя",
                '/manager/profile': "Библиотека · Личный кабинет менеджера",
                '/admin/profile': "Библиотека · Личный кабинет администрации",
                "/forbidden" : "Библиотека · Доступ запрещён",
            }
            document.title = titles[path] || 'Библиотека · Страница не найдена'
            
            if (role && (path === "/auth")){
                navigateTo("/")
                return
            }
            if (path.split('/')[1] === role || path === "/" || path === "/auth"){
                navigateTo(path)
                return
            } else {
                navigateTo("/forbidden")
                return
            }
        }
    getData()
    }, [path])
}