import "./FoodCard.css";
import { useContext } from "react";
import CurrentUserContext from "../../contexts/CurrentUserContext";

const FoodCard = ({ item, onCardClick, onCardLike }) => {
  const currentUser = useContext(CurrentUserContext);
  const isLiked = item.likes?.some((like) => {
    return like === currentUser?._id || like._id === currentUser?._id;
  });

  const handleLikeClick = (e) => {
    e.stopPropagation();
    onCardLike({ item, isLiked });
  };

  const initials = item.name
    ? item.name
        .split(" ")
        .map((w) => w[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : "";

  return (
    <li className="item-card" onClick={() => onCardClick(item)}>
      <div className="item-card__header">
        <p className="item-card__title">{item.name}</p>
        {currentUser && (
          <button
            type="button"
            className={`item-card__like-button ${
              isLiked ? "item-card__like-button_active" : ""
            }`}
            onClick={handleLikeClick}
            aria-label={isLiked ? "Unsave food" : "Save food"}
          />
        )}
      </div>

      {item.imageUrl ? (
        <img className="item-card__image" src={item.imageUrl} alt={item.imageAlt || item.name} />
      ) : (
        <div className="item-card__placeholder" aria-hidden="true">
          <span className="item-card__placeholder-text">{initials}</span>
        </div>
      )}
    </li>
  );
};

export default FoodCard;




