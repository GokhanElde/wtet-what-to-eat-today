import FoodCard from "../FoodCard/FoodCard";
import "./FoodSection.css";

const FoodSection = ({ foodItems, onCardClick, onCardLike }) => {
  return (
    <section className="food-section">
      <div className="food-section__header">
        <h2 className="food-section__title">Favorite foods</h2>
      </div>

      {foodItems.length === 0 ? (
        <p className="food-section__empty">You haven&apos;t saved any foods yet.</p>
      ) : (
        <ul className="cards">
          {foodItems.map((item) => (
            <FoodCard
              key={item._id}
              item={item}
              onCardClick={onCardClick}
              onCardLike={onCardLike}
            />
          ))}
        </ul>
      )}
    </section>
  );
};

export default FoodSection;