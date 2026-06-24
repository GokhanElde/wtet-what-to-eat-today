import "./FoodModal.css";
import closeIcon from "../../assets/close.svg";
import { useEffect } from "react";

const FoodModal = ({ card, isOpen, onClose }) => {
  useEffect(() => {
    if (!isOpen) return undefined;

    const handleEscape = (event) => {
      if (event.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen || !card) return null;

  const handleOverlayClick = (e) => {
    if (e.target.classList.contains("modal")) onClose();
  };

  return (
    <div
      className={`modal modal_type_preview ${isOpen ? "modal_is-opened" : ""}`}
      onClick={handleOverlayClick}
    >
      <div className="modal__content modal__content_type_image">
        <button type="button" className="modal__close" onClick={onClose}>
          <img src={closeIcon} alt="Close" />
        </button>

        {card.imageUrl ? (
          <img
            src={card.imageUrl}
            alt={card.imageAlt || card.name}
            className="modal__image"
          />
        ) : (
          <div className="modal__image modal__image_placeholder" />
        )}

        <div className="modal__footer">
          <div className="title">
            <h2 className="modal__title modal__title_type_preview">
              {card.name}
            </h2>
          </div>

          {card.imageSource === "Pexels" && (
            <p className="modal__image-credit">
              Photo by{" "}
              <a href={card.photographerUrl} target="_blank" rel="noreferrer">
                {card.photographer}
              </a>{" "}
              on{" "}
              <a href={card.photoUrl} target="_blank" rel="noreferrer">
                Pexels
              </a>
            </p>
          )}

          {card.instructions && (
            <div className="modal__recipe">
              <p className="modal__recipe-meta">
                {[card.category, card.area].filter(Boolean).join(" / ")}
              </p>
              <p className="modal__recipe-text">{card.instructions}</p>
              {card.recipeUrl && (
                <a
                  className="modal__recipe-link"
                  href={card.recipeUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  Open recipe source
                </a>
              )}
            </div>
          )}

          <div className="modal__nutrients">
            <div className="nutrient">
              <span className="nutrient__label">Calories</span>
              <span className="nutrient__value">{card.calories ?? "--"}</span>
            </div>
            <div className="nutrient">
              <span className="nutrient__label">Protein</span>
              <span className="nutrient__value">{card.protein ?? "--"} g</span>
            </div>
            <div className="nutrient">
              <span className="nutrient__label">Carbs</span>
              <span className="nutrient__value">{card.carbs ?? "--"} g</span>
            </div>
            <div className="nutrient">
              <span className="nutrient__label">Fat</span>
              <span className="nutrient__value">{card.fat ?? "--"} g</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FoodModal;
