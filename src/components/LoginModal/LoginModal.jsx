import { useState } from "react";
import ModalWithForm from "../ModalWithForm/ModalWithForm.jsx";
import { useForm } from "../../hooks/useForm.js";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const LoginModal = ({ isOpen, onClose, onLogin, onSwitchToRegister }) => {
  const { values, handleChange, resetForm } = useForm({
    email: "",
    password: "",
  });
  const [errorMessage, setErrorMessage] = useState("");
  const [emailTouched, setEmailTouched] = useState(false);
  const isEmailValid = EMAIL_PATTERN.test(values.email.trim());
  const showEmailError = emailTouched && !isEmailValid;

  const resetModal = () => {
    resetForm();
    setErrorMessage("");
    setEmailTouched(false);
  };

  const handleClose = () => {
    resetModal();
    onClose();
  };

  const handleSwitchToRegister = () => {
    resetModal();
    onSwitchToRegister();
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setEmailTouched(true);
    setErrorMessage("");

    if (!isEmailValid) return;

    onLogin(values)
      .then(handleClose)
      .catch((error) => setErrorMessage(error.message));
  };

  return (
    <ModalWithForm
      title="Log In"
      name="login"
      buttonText="Log In"
      isOpen={isOpen}
      onClose={handleClose}
      onSubmit={handleSubmit}
      submitDisabled={!isEmailValid || values.password.length < 6}
      secondaryButtonText="Sign Up"
      onSecondaryClick={handleSwitchToRegister}
      errorMessage={errorMessage}
    >
      <label className="modal__label">
        Email
        <input
          name="email"
          placeholder="Email"
          className={`modal__input ${showEmailError ? "modal__input_invalid" : ""}`}
          type="email"
          value={values.email}
          onChange={handleChange}
          onBlur={() => setEmailTouched(true)}
          aria-invalid={showEmailError}
          aria-describedby={showEmailError ? "login-email-error" : undefined}
          autoComplete="email"
          required
        />
        {showEmailError && (
          <span className="modal__input-error" id="login-email-error">
            Invalid email address
          </span>
        )}
      </label>

      <label className="modal__label">
        Password
        <input
          name="password"
          placeholder="Password"
          className="modal__input"
          type="password"
          value={values.password}
          onChange={handleChange}
          minLength="6"
          autoComplete="current-password"
          required
        />
      </label>
    </ModalWithForm>
  );
};

export default LoginModal;
