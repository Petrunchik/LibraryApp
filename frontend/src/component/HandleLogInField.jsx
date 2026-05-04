import { useState } from 'react'
import '../index.css'
import { loginUser } from '../services/loginUser'
import { RedirectToHome } from '../services/redirectToHome'
import { getPath } from '../services/getPath'
import Link from '../Link'
import { navigateTo } from '../services/navigateTo'

function HandleLogInField () {
    const [isShowPassword, setIsShowPassword] = useState(false)

    const [isPhoneError, setIsPhoneError] = useState("none")
    const [isPasswordError, setIsPasswordError] = useState("none")

    const [phone, setPhone] = useState('')
    const [password, setPassword] = useState('')

    const [phoneError, setPhoneMessage] = useState('')
    const [passwordError, setPasswordMessage] = useState('')

    const isAllDigits = (str) => {
        return /^[0-9]+$/.test(str);
    }

    const clearAllErrors = () => {
      setIsPhoneError("none")
      setIsPasswordError("none")
      setPhoneMessage('')
      setPasswordMessage('')
    }
    const clearAllField = () => {
      setPassword('')
      setPhone('')
    }

    const checkData = async () => {
      let isValid = true

      if (phone.trim().length === 0){
        setPhoneMessage("Номер телефона не может быть пустым")
        setIsPhoneError('flex')
        isValid = false
      } else if (!isAllDigits(phone)){
        setPhoneMessage("Номер телефона должен состоять только из цифр")
        setIsPhoneError('flex')
        isValid = false
      } else if (phone.trim().length < 11){
        setPhoneMessage("Номер телефона должен содержать 11 цифр")
        setIsPhoneError('flex')
        isValid = false
      } else if (password.trim().length === 0){
        setPasswordMessage("Пароль не может быть пустым")
        setIsPasswordError("flex")
        isValid = false
      } else if (password.trim().length < 8 || password.trim().length > 30){
        setPasswordMessage("Пароль должен состоять из 8-30 символов")
        setIsPasswordError("flex")
        isValid = false
      }
      if(isValid){
        const result = await loginUser({ phone, password })
        if(result.success){
          const redirectPath = getPath()
          navigateTo(redirectPath)
          clearAllField()
        } else {
          console.log(result.error)
        }
      }
    }

    return (
        // ================= ФОРМА ВХОДА =================
        <div className="auth-form login-form">
          <h2>Вход в аккаунт</h2>
          <p className="auth-subtitle">Введите номер телефона и пароль</p>

          {/* Поле: Номер телефона */}
          <div className="field-wrapper" id="login-phone-wrapper">
            <div className={`input-group ${isPhoneError === "flex" ? "error" : "none"}`} id="login-phone-input">
              <i className="fas fa-phone-alt"></i>
              <input
                onInput={() => clearAllErrors()}
                type="tel"
                maxLength="18"
                placeholder="Номер телефона"
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
          </div>
          <div className="form-error" id="login-form-error" style={{ display: isPhoneError === "flex" ? "flex" : "none" }}>
            <div className="error-message">
              <i className="fas fa-exclamation-circle"></i>
              <span>{phoneError}</span>
            </div>
          </div>

          {/* Поле: Пароль */}
          <div className="field-wrapper" id="login-password-wrapper">
            <div className={`input-group password-group ${isPasswordError === "flex" ? "error" : "none"}`} id="login-password-input">
              <i className="fas fa-lock"></i>
              <input
                onInput={() => clearAllErrors()}
                type={!isShowPassword ? "password" : "text"}
                placeholder="Пароль"
                id="login-password"
                className="password-input"
                onChange={(e) => setPassword(e.target.value)}
              />
              
              <input type="checkbox" id="toggle-login-password" className="password-toggle-checkbox" />
              <label htmlFor="toggle-login-password" className='password-toggle-btn' onClick={() => setIsShowPassword(!isShowPassword)} title="Показать пароль">
                <span className="eye-icon-wrapper">
                  <i className="far fa-eye"></i>
                  <i className="far fa-eye-slash"></i>
                </span>
              </label>
            </div>
          </div>

          <div className="form-error" id="login-form-error" style={{ display: isPasswordError === "flex" ? "flex" : "none" }}>
            <div className="error-message">
              <i className="fas fa-exclamation-circle"></i>
              <span>{passwordError}</span>
            </div>
          </div>

          {/* Общая ошибка для формы входа */}
          {/* <div className="form-error" id="login-form-error" style={{  }}>
            <div className="error-message">
              <i className="fas fa-exclamation-circle"></i>
              <span>{phoneError || passwordError}</span>
              <span>Неверный номер телефона или пароль, попробуйте еще раз</span>
            </div>
          </div> */}

          <div className="forgot-password-block">
            <a href="#" className="forgot-password-card">
              <span className="forgot-icon">
                <i className="fas fa-key"></i>
                <i className="fas fa-question"></i>
              </span>
              <span className="forgot-text">Забыли пароль?</span>
              <span className="forgot-arrow">
                <i className="fas fa-chevron-right"></i>
              </span>
            </a>
          </div>

          <button className="auth-btn" onClick={checkData}>Войти</button>

          <div className="auth-switch">
            <span>Нет аккаунта?</span>
            <label htmlFor="tab-register" className="switch-link">
              Зарегистрироваться <i className="fas fa-arrow-right"></i>
            </label>
          </div>
        </div>
    )
}

export default HandleLogInField