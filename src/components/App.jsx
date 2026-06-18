import { useEffect, useState } from "react";
import { Routes, Route, NavLink } from "react-router-dom";

import Header from "./Header/Header.jsx";
import Main from "./Main/Main.jsx";
import Footer from "./Footer/Footer.jsx";
import FoodModal from "./FoodModal/FoodModal.jsx";
import FoodSection from "./FoodSection/FoodSection.jsx";
import CurrentUserContext from "../contexts/CurrentUserContext";

import "../App.css";

const FAVORITES_STORAGE_KEY = "wtet-favorite-foods";

const mockUser = {
  _id: "wtet-user",
};

function App() {
  const [favoriteFoods, setFavoriteFoods] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(FAVORITES_STORAGE_KEY)) || [];
    } catch (error) {
      console.error("Failed to load saved foods:", error);
      return [];
    }
  });
  const [activeModal, setActiveModal] = useState(null);
  const [selectedCard, setSelectedCard] = useState(null);

  useEffect(() => {
    localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favoriteFoods));
  }, [favoriteFoods]);

  const closeAllModals = () => {
    setActiveModal(null);
    setSelectedCard(null);
  };

  const handleCardClick = (card) => {
    setSelectedCard(card);
    setActiveModal("preview");
  };

  const handleCardLike = ({ item, isLiked }) => {
    const id = item._id;

    if (isLiked) {
      setFavoriteFoods((foods) => foods.filter((food) => food._id !== id));
      return;
    }

    const updatedFood = {
      ...item,
      likes: [...(item.likes || []), mockUser._id],
    };

    setFavoriteFoods((foods) => [
      updatedFood,
      ...foods.filter((food) => food._id !== id),
    ]);
  };

  return (
    <CurrentUserContext.Provider value={mockUser}>
      <div className="page">
        <Header />

        <div className="page-layout">
          <aside className="sidebar-nav">
            <nav className="sidebar-nav__inner">
              <NavLink
                to="/"
                className={({ isActive }) =>
                  isActive ? "sidebar-nav__link active" : "sidebar-nav__link"
                }
              >
                Home
              </NavLink>
              <NavLink
                to="/saved-foods"
                className={({ isActive }) =>
                  isActive ? "sidebar-nav__link active" : "sidebar-nav__link"
                }
              >
                Saved Foods
              </NavLink>
            </nav>
          </aside>

          <main className="content">
            <Routes>
              <Route
                path="/"
                element={
                  <Main
                    onCardClick={handleCardClick}
                    onCardLike={handleCardLike}
                  />
                }
              />
              <Route
                path="/saved-foods"
                element={
                  <FoodSection
                    foodItems={favoriteFoods}
                    onCardClick={handleCardClick}
                    onCardLike={handleCardLike}
                  />
                }
              />
            </Routes>
          </main>
        </div>

        <Footer />

        <FoodModal
          card={selectedCard}
          isOpen={activeModal === "preview"}
          onClose={closeAllModals}
        />
      </div>
    </CurrentUserContext.Provider>
  );
}

export default App;

