import '../index.css'
import { useState } from 'react'
import { registerUser } from '../services/registerUser'
import { RedirectToHome } from '../services/redirectToHome'
import { getPath } from '../services/getPath'
import { navigateTo } from '../services/navigateTo'

function HandleRegisterField() {
    const [isShowPassword1, setIsShowPassword1] = useState(false)
    const [isShowPassword2, setIsShowPassword2] = useState(false)

    const [password1, setPassword1] = useState('')
    const [password2, setPassword2] = useState('')
    const [name, setName] = useState('')
    const [lastName, setLastName] = useState('')
    const [phone, setPhone] = useState('')
    
    const [passwordError, setPasswordError] = useState('none')
    const [nameError, setNameError] = useState('none')
    const [phoneError, setPhoneError] = useState('none')
    const [lastNameError, setLastNameError] = useState('none')
    
    const [passwordMessage, setPasswordMessage] = useState('')
    const [nameMessage, setNameMessage] = useState('')
    const [phoneMessage, setPhoneMessage] = useState('')
    const [lastNameMessage, setLastNameMessage] = useState('')

    const isAllSymbolsAreWords = (str) => {
        return /^[A-Za-zА-Яа-я]+$/.test(str) && !str.includes(' ')
    }

    const isAllDigits = (str) => {
        return /^[0-9]+$/.test(str);
    }

    const clearAllErrors = () => {
        setNameError('none')
        setNameMessage('')
        setLastNameError('none')
        setLastNameMessage('')
        setPhoneError('none')
        setPhoneMessage('')
        setPasswordError('none')
        setPasswordMessage('')
    }
    const clearAllField = () => {
        setName('')
        setLastName('')
        setPhone('')
        setPassword1('')
        setPassword2('')
    }

    const checkData = async () => {
        let isValid = true
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
            setNameError('none')
            setNameMessage('')
        }

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

        // Проверка телефона
        if (!phone.trim()) {
            setPhoneError('flex')
            setPhoneMessage("Номер телефона обязателен для заполнения")
            isValid = false
        } else if (!isAllDigits(phone)){
            setPhoneError('flex')
            setPhoneMessage("Номер телефона должен состоять только из цифр")
            isValid = false
        } else if ((phone.length !== 11) || (phone[0] !== '8')){
            setPhoneError('flex')
            setPhoneMessage("Номер телефона должен содержать из 11 цифр и начинаться с 8")
            isValid = false
        } else {
            setPhoneError('none')
            setPhoneMessage('')
        }

        // Проверка паролей
        if ((password1.length < 8) || (password1 === '') || (password2 === '')) {
            setPasswordError('flex')
            setPasswordMessage("Длина пароля должна быть больше 8 символов")
            isValid = false
        } else if ((password1 !== password2)) {
            setPasswordError('flex')
            setPasswordMessage("Пароли не совпадают")
            isValid = false
        } else {
            setPasswordError('none')
            setPasswordMessage('')
        }
        if(isValid){
            const result = await registerUser({
                name, lastName, phone,
                password: password1
            })
            
            if (result.success) {
                const redirectPath = getPath()
                navigateTo(redirectPath)
                clearAllErrors();
                clearAllField();
            } else if (result.error === "409") {
                setPhoneError('flex');
                setPhoneMessage(result.cause?.message || "Номер телефона уже зарегистрирован");
            } else {
                setPasswordError('flex');
                setPasswordMessage(result.message || result.error || "Ошибка регистрации");
            }
        }
    }

    return (
        <div className="auth-form register-form">
            <h2>Регистрация</h2>
            <p className="auth-subtitle">Заполните данные для создания аккаунта</p>

            <div className="input-row">
                <div className="field-wrapper" id="reg-name-wrapper">
                    <div className={`input-group ${nameError === 'flex' ? 'error' : ''}`} id="reg-name-input">
                        <i className="fas fa-user"></i>
                        <input 
                            onInput={() => clearAllErrors()}
                            type="text" 
                            placeholder="Имя"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>
                    <div className="error-message" style={{ display: nameError }}>
                        <i className="fas fa-exclamation-circle"></i>
                        <span>{nameMessage}</span>
                    </div>
                </div>
                
                <div className="field-wrapper" id="reg-surname-wrapper">
                    <div className={`input-group ${lastNameError === 'flex' ? 'error' : ''}`} id="reg-surname-input">
                        <i className="fas fa-user-circle"></i>
                        <input 
                            onInput={() => clearAllErrors()}
                            type="text" 
                            placeholder="Фамилия"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                        />
                    </div>
                    <div className="error-message" style={{ display: lastNameError }}>
                        <i className="fas fa-exclamation-circle"></i>
                        <span>{lastNameMessage}</span>
                    </div>
                </div>
            </div>

            <div className="field-wrapper" id="reg-phone-wrapper">
                <div className={`input-group ${phoneError === 'flex' ? 'error' : ''}`} id="reg-phone-input">
                    <i className="fas fa-phone-alt"></i>
                    <input 
                        onInput={() => clearAllErrors()}
                        type="tel" 
                        placeholder="Номер телефона"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                    />
                </div>
                <div className="error-message" style={{ display: phoneError }}>
                    <i className="fas fa-exclamation-circle"></i>
                    <span>{phoneMessage}</span>
                </div>
            </div>

            <div className="field-wrapper" id="reg-password1-wrapper">
                <div className={`input-group password-group ${passwordError === 'flex' ? 'error' : ''}`} id="reg-password1-input">
                    <i className="fas fa-lock"></i>
                    <input
                        onInput={() => clearAllErrors()}
                        onChange={(e) => setPassword1(e.target.value)}
                        type={!isShowPassword1 ? "password" : "text"}
                        placeholder="Пароль"
                        id="reg-password1"
                        className="password-input" 
                        value={password1}
                    />
                    
                    <input type="checkbox" id="toggle-reg-password1" className="password-toggle-checkbox" />
                    <label
                        htmlFor="toggle-reg-password1"
                        className="password-toggle-btn"
                        onClick={() => setIsShowPassword1(!isShowPassword1)}
                        title="Показать пароль"
                    >
                        <span className="eye-icon-wrapper">
                            <i className="far fa-eye"></i>
                            <i className="far fa-eye-slash"></i>
                        </span>
                    </label>
                </div>
            </div>

            <div className="field-wrapper" id="reg-password2-wrapper">
                <div className={`input-group password-group ${passwordError === 'flex' ? 'error' : ''}`} id="reg-password2-input">
                    <i className="fas fa-check-circle"></i>
                    <input
                        onInput={() => clearAllErrors()}
                        type={!isShowPassword2 ? "password" : "text"}
                        placeholder="Подтвердите пароль"
                        id="reg-password2"
                        className="password-input"
                        onChange={(e) => setPassword2(e.target.value)}
                        value={password2}
                    />
                    
                    <input type="checkbox" id="toggle-reg-password2" className="password-toggle-checkbox" />
                    <label
                        htmlFor="toggle-reg-password2"
                        className="password-toggle-btn"
                        onClick={() => setIsShowPassword2(!isShowPassword2)}
                        title="Показать пароль"
                    >
                        <span className="eye-icon-wrapper">
                            <i className="far fa-eye"></i>
                            <i className="far fa-eye-slash"></i>
                        </span>
                    </label>
                </div>
                <div className="error-message" style={{ display: passwordError }}>
                    <i className="fas fa-exclamation-circle"></i>
                    <span>{passwordMessage}</span>
                </div>
            </div>

            <button className="auth-btn" onClick={checkData}>Зарегистрироваться</button>

            <div className="auth-switch">
                <span>Уже есть аккаунт?</span>
                <label htmlFor="tab-login" className="switch-link">
                    Войти <i className="fas fa-arrow-right"></i>
                </label>
            </div>
        </div>
    )
}

export default HandleRegisterField