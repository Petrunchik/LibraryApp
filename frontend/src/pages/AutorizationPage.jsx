import '../index.css'
import HandleLogInField from '../component/HandleLogInField.jsx'
import HandleRegisterField from '../component/HandleRegisterField.jsx'

function AutorizationPage() {
  return (
    <div className="auth-wrapper">
      <div className="auth-container">
        
        <div className="auth-logo">
          <i className="fas fa-book-open"></i>
          <span>Книжный червь</span>
        </div>

        {/* Радио-кнопки для переключения форм */}
        <input type="radio" name="auth-tab" id="tab-login" className="auth-tab-login" defaultChecked />
        <input type="radio" name="auth-tab" id="tab-register" className="auth-tab-register" />

        <HandleLogInField />
        <HandleRegisterField />

      </div>
    </div>
  )
}

export default AutorizationPage