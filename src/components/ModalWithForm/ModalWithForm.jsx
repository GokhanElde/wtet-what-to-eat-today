import { useEffect } from "react";
import closeIcon from "../../assets/close.svg";
import "./ModalWithForm.css";

const ModalWithForm = ({
  children,
  title,
  name,
  buttonText,
  isOpen,
  onClose,
  onSubmit,
  submitDisabled = false,
  secondaryButtonText,
  onSecondaryClick,
  errorMessage,
}) => {
  useEffect(() => {
    if (!isOpen) return undefined;

    const handleEscape = (event) => {
      if (event.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleOverlayClick = (event) => {
    if (event.target === event.currentTarget) onClose();
  };

  return (
    <div
      className={`modal modal_is-opened modal_type_${name}`}
      onMouseDown={handleOverlayClick}
    >
      <div className="modal__content modal__content_type_form">
        <button
          className="modal__close modal__close_type_form"
          onClick={onClose}
          type="button"
          aria-label="Close modal"
        >
          <img src={closeIcon} alt="" />
        </button>

        <h2 className="modal__form-title">{title}</h2>

        <form className="modal__form" name={name} onSubmit={onSubmit}>
          {children}
          {errorMessage && (
            <p className="modal__form-error" role="alert">
              {errorMessage}
            </p>
          )}
          <div className="modal__buttons">
            <button
              type="submit"
              className="modal__submit"
              disabled={submitDisabled}
            >
              {buttonText}
            </button>

            {secondaryButtonText && (
              <button
                type="button"
                className="modal__secondary-button"
                onClick={onSecondaryClick}
              >
                or {secondaryButtonText}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalWithForm;
