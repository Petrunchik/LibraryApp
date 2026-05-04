export const checkNameData = (name) => {
        // Проверка имени
        if (!isAllSymbolsAreWords(name)) {
            setNameError('flex')
            setNameMessage("Имя должно содержать только буквы")
            isValid = false
        } else if (name.trim().length <= 1) {
            setNameError('flex')
            setNameMessage("Имя должно содержать более 1 символа")
            isValid = false
        } else {
            return {"status": "none", "message": ""}
        }
}
export const checkLastNameData = (lastName) => {
        // Проверка фамилии
        if (!isAllSymbolsAreWords(lastName)) {
            setLastNameError('flex')
            setLastNameMessage("Фамилия должна содержать только буквы")
            isValid = false
        } else if (!lastName.trim()) {
            setLastNameError('flex')
            setLastNameMessage("Фамилия обязательна для заполнения")
            isValid = false
        } else if (lastName.trim().length <= 1) {
            setLastNameError('flex')
            setLastNameMessage("Фамилия должна содержать более 1 символа")
            isValid = false
        } else {
            setLastNameError('none')
            setLastNameMessage('')
        }
}

export const isAllDigits = (str) => {
        return /^[0-9]+$/.test(str);
    }

export const checkPhoneNumber = (phone) => {
        // Проверка телефона
    if (!phone.trim()) {
        return {'status': "flex", message: 'Номер телефона обязателен для заполнения'}
    } else if (!isAllDigits(phone)){
            return {'status': "flex", message: 'Номер телефона должен состоять только из цифр'}
    } else if ((phone.length !== 11) || (phone[0] !== '8')){
            return {'status': "flex", message: 'Номер телефона должен содержать из 11 цифр и начинаться с 8'}
    } else {
            return {'status': "none", message: ''}
        }
}
export const checkPassword = (password) => {
        // Проверка паролей
        if ((password.length < 8) || (password === '')) {
            return {"status": "flex", "message": "Длина пароля должна быть больше 8 символов"}
        } else {
            setPasswordError('none')
            setPasswordMessage('')
            return {"status": "flex", "message": "Пароли не совпадают"}
        }
}
export const checkFieldId= (id) => {
    if (id.trim().length === 0){
        return {"status": "flex", "message": "Поле ID пользователя обязателно для заполнения"}
    } else {
        return {"status": "none", "message": ""}
    }
}
