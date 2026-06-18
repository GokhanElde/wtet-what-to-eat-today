import { useContext, useState } from "react";
import FoodCard from "../FoodCard/FoodCard.jsx";
import CurrentUserContext from "../../contexts/CurrentUserContext.js";
import { searchFoodCatalog } from "../../utils/foodSearch.js";
import "./Main.css";

const RESULTS_PER_PAGE = 3;

const Main = ({ onCardClick, onCardLike }) => {
  const currentUser = useContext(CurrentUserContext);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [visibleResults, setVisibleResults] = useState(RESULTS_PER_PAGE);
  const [isLoading, setIsLoading] = useState(false);
  const [searchError, setSearchError] = useState("");
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleCardLike = ({ item, isLiked }) => {
    onCardLike({ item, isLiked });

    setSearchResults((results) =>
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

  const handleSearchSubmit = async (event) => {
    event.preventDefault();
    const query = searchQuery.trim();

    if (!query) {
      setHasSearched(false);
      setSearchResults([]);
      setSearchError("");
      setVisibleResults(RESULTS_PER_PAGE);
      return;
    }

    setIsLoading(true);
    setSearchError("");
    setHasSearched(true);
    setVisibleResults(RESULTS_PER_PAGE);

    try {
      const results = await searchFoodCatalog(query);
      setSearchResults(results);
    } catch (error) {
      console.error("Search error:", error);
      setSearchError("Something went wrong. Please try again.");
      setSearchResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleShowMore = () => {
    setVisibleResults((count) => count + RESULTS_PER_PAGE);
  };

  const displayedResults = searchResults.slice(0, visibleResults);
  const hasMoreResults = visibleResults < searchResults.length;

  return (
    <main className="main">
      <section className="food-search">
        <h1 className="food-search__title">
          Can&apos;t decide what to eat today?
        </h1>
        <p className="food-search__subtitle">
          Search foods, check nutrition details, and save your favorites.
        </p>

        <form className="food-search__form" onSubmit={handleSearchSubmit}>
          <input
            className="food-search__input"
            type="search"
            placeholder="Search foods or ingredients"
            value={searchQuery}
            onChange={handleSearchChange}
            aria-label="Search foods"
          />
          <button className="food-search__button" type="submit">
            Search
          </button>
        </form>
      </section>

      <section className="food-section">
        <div className="food-section__header">
          <h2 className="food-section__title">Food results</h2>
          <p className="food-section__count">
            {isLoading
              ? "Loading..."
              : `${searchResults.length} item${searchResults.length === 1 ? "" : "s"}`}
          </p>
        </div>

        {searchError && <p className="food-search__error">{searchError}</p>}

        <ul className="cards">
          {isLoading ? (
            <li className="food-search__empty">Searching...</li>
          ) : displayedResults.length > 0 ? (
            displayedResults.map((item) => (
              <FoodCard
                key={item._id}
                item={item}
                onCardClick={onCardClick}
                onCardLike={handleCardLike}
              />
            ))
          ) : hasSearched && !searchError ? (
            <li className="food-search__empty">Nothing found.</li>
          ) : !hasSearched ? (
            <li className="food-search__empty">
              Start typing to search for foods.
            </li>
          ) : null}
        </ul>

        {hasMoreResults && (
          <button
            className="food-search__show-more"
            type="button"
            onClick={handleShowMore}
          >
            Show more
          </button>
        )}
      </section>
    </main>
  );
};

export default Main;

