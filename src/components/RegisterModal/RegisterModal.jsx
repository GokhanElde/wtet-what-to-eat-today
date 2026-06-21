import { useState } from "react";
import ModalWithForm from "../ModalWithForm/ModalWithForm.jsx";
import { useForm } from "../../hooks/useForm.js";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const RegisterModal = ({ isOpen, onClose, onRegister, onSwitchToLogin }) => {
  const { values, handleChange, resetForm } = useForm({
    name: "",
    email: "",
    password: "",
  });
  const [errorMessage, setErrorMessage] = useState("");
  const [nameTouched, setNameTouched] = useState(false);
  const [emailTouched, setEmailTouched] = useState(false);
  const isNameValid = values.name.trim().length >= 3;
  const isEmailValid = EMAIL_PATTERN.test(values.email.trim());
  const showNameError = nameTouched && !isNameValid;
  const showEmailError = emailTouched && !isEmailValid;

  const resetModal = () => {
    resetForm();
    setErrorMessage("");
    setNameTouched(false);
    setEmailTouched(false);
  };

  const handleClose = () => {
    resetModal();
    onClose();
  };

  const handleSwitchToLogin = () => {
    resetModal();
    onSwitchToLogin();
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setNameTouched(true);
    setEmailTouched(true);
    setErrorMessage("");

    if (!isNameValid || !isEmailValid) return;

    onRegister(values)
      .then(handleClose)
      .catch((error) => setErrorMessage(error.message));
  };

  const isFormIncomplete =
    !isNameValid || !isEmailValid || values.password.length < 6;

  return (
    <ModalWithForm
      title="Sign Up"
      name="register"
      buttonText="Sign Up"
      isOpen={isOpen}
      onClose={handleClose}
      onSubmit={handleSubmit}
      submitDisabled={isFormIncomplete}
      secondaryButtonText="Log In"
      onSecondaryClick={handleSwitchToLogin}
      errorMessage={errorMessage}
    >
      <label className="modal__label">
        Name
        <input
          name="name"
          placeholder="Name"
          className={`modal__input ${showNameError ? "modal__input_invalid" : ""}`}
          type="text"
          value={values.name}
          onChange={handleChange}
          onBlur={() => setNameTouched(true)}
          aria-invalid={showNameError}
          aria-describedby={showNameError ? "register-name-error" : undefined}
          minLength="3"
          autoComplete="name"
          required
        />
        {showNameError && (
          <span className="modal__input-error" id="register-name-error">
            Name must be at least 3 characters
          </span>
        )}
      </label>

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
          aria-describedby={showEmailError ? "register-email-error" : undefined}
          autoComplete="email"
          required
        />
        {showEmailError && (
          <span className="modal__input-error" id="register-email-error">
            Invalid email address
          </span>
        )}
      </label>

      <label className="modal__label">
        Password
        <input
          name="password"
          placeholder="At least 6 characters"
          className="modal__input"
          type="password"
          value={values.password}
          onChange={handleChange}
          minLength="6"
          autoComplete="new-password"
          required
        />
      </label>
    </ModalWithForm>
  );
};

export default RegisterModal;
