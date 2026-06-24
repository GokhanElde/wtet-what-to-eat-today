import { useContext, useState } from "react";
import FoodCard from "../FoodCard/FoodCard.jsx";
import CurrentUserContext from "../../contexts/CurrentUserContext.js";
import { searchFoodCatalog } from "../../utils/foodSearch.js";
import { getRandomMealRecipe, searchMealRecipes } from "../../utils/themealdb.js";
import "./FoodChallenge.css";

const CHALLENGE_LEVELS = [
  {
    id: "easy",
    title: "Easy Bite",
    description: "A simple idea for a low-effort meal.",
    queries: ["salad", "omelette", "soup", "pasta"],
  },
  {
    id: "balanced",
    title: "Balanced Plate",
    description: "A more filling option with solid nutrition.",
    queries: ["chicken", "rice", "fish", "beans"],
  },
  {
    id: "surprise",
    title: "Surprise Me",
    description: "A random recipe when choosing feels impossible.",
    queries: [],
  },
];

function chooseRandom(items) {
  return items[Math.floor(Math.random() * items.length)];
}

const FoodChallenge = ({ onCardClick, onCardLike }) => {
  const currentUser = useContext(CurrentUserContext);
  const [selectedLevel, setSelectedLevel] = useState(CHALLENGE_LEVELS[0].id);
  const [challengeResults, setChallengeResults] = useState([]);
  const [statusMessage, setStatusMessage] = useState(
    "Pick a level and generate a food challenge.",
  );
  const [isLoading, setIsLoading] = useState(false);

  const handleLevelChange = (event) => {
    setSelectedLevel(event.target.value);
  };

  const handleCardLike = ({ item, isLiked }) => {
    onCardLike({ item, isLiked });

    setChallengeResults((results) =>
      results.map((result) =>
        result._id === item._id
          ? {
              ...result,
              likes: isLiked
                ? (result.likes || []).filter(
                    (like) =>
                      like !== currentUser?._id &&
                      like?._id !== currentUser?._id,
                  )
                : [...(result.likes || []), currentUser._id],
            }
          : result,
      ),
    );
  };

  const handleGenerateChallenge = async () => {
    const level = CHALLENGE_LEVELS.find((item) => item.id === selectedLevel);

    setIsLoading(true);
    setStatusMessage("Generating your challenge...");

    try {
      let results = [];

      if (level.id === "surprise") {
        const randomMeal = await getRandomMealRecipe();
        results = randomMeal ? [randomMeal] : [];
      } else {
        const query = chooseRandom(level.queries);
        results = await searchMealRecipes(query);

        if (results.length === 0) {
          results = await searchFoodCatalog(query);
        }
      }

      setChallengeResults(results.slice(0, 3));
      setStatusMessage(
        results.length > 0
          ? "Challenge ready. Pick one and see the details."
          : "No challenge found. Try another level.",
      );
    } catch (error) {
      console.error("Food challenge error:", error);
      setChallengeResults([]);
      setStatusMessage("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="food-challenge">
      <section className="food-challenge__intro">
        <p className="food-challenge__eyebrow">Food Challenge</p>
        <h1 className="food-challenge__title">
          Let the app choose your next meal.
        </h1>
        <p className="food-challenge__subtitle">
          Choose a level and get a quick recipe idea from TheMealDB.
        </p>
      </section>

      <section
        className="food-challenge__controls"
        aria-label="Food challenge levels"
      >
        {CHALLENGE_LEVELS.map((level) => {
          const levelClassName =
            "food-challenge__level" +
            (selectedLevel === level.id ? " food-challenge__level_active" : "");

          return (
            <label className={levelClassName} key={level.id}>
              <input
                className="food-challenge__radio"
                type="radio"
                name="challenge-level"
                value={level.id}
                checked={selectedLevel === level.id}
                onChange={handleLevelChange}
              />
              <span className="food-challenge__level-title">{level.title}</span>
              <span className="food-challenge__level-text">
                {level.description}
              </span>
            </label>
          );
        })}
      </section>

      <button
        className="food-challenge__button"
        type="button"
        onClick={handleGenerateChallenge}
        disabled={isLoading}
      >
        {isLoading ? "Generating..." : "Generate Challenge"}
      </button>

      <p className="food-challenge__status">{statusMessage}</p>

      <ul className="cards food-challenge__cards">
        {challengeResults.map((item) => (
          <FoodCard
            key={item._id}
            item={item}
            onCardClick={onCardClick}
            onCardLike={handleCardLike}
          />
        ))}
      </ul>
    </main>
  );
};

export default FoodChallenge;
