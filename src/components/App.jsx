import { useEffect, useState } from "react";
import { Routes, Route, NavLink, Navigate } from "react-router-dom";

import Header from "./Header/Header.jsx";
import Main from "./Main/Main.jsx";
import Footer from "./Footer/Footer.jsx";
import FoodModal from "./FoodModal/FoodModal.jsx";
import FoodSection from "./FoodSection/FoodSection.jsx";
import FoodChallenge from "./FoodChallenge/FoodChallenge.jsx";
import LoginModal from "./LoginModal/LoginModal.jsx";
import RegisterModal from "./RegisterModal/RegisterModal.jsx";
import ProtectedRoute from "./ProtectedRoute/ProtectedRoute.jsx";
import CurrentUserContext from "../contexts/CurrentUserContext.js";
import * as auth from "../utils/auth.js";

import "../App.css";

const getFavoritesStorageKey = (userId) => `wtet-favorite-foods:${userId}`;

function readFavoriteFoods(userId) {
  if (!userId) return [];

  try {
    return (
      JSON.parse(localStorage.getItem(getFavoritesStorageKey(userId))) || []
    );
  } catch (error) {
    console.error("Failed to load saved foods:", error);
    return [];
  }
}

function App() {
  const [currentUser, setCurrentUser] = useState(() => auth.getCurrentUser());
  const [favoriteFoods, setFavoriteFoods] = useState(() =>
    readFavoriteFoods(auth.getCurrentUser()?._id),
  );
  const [activeModal, setActiveModal] = useState(null);
  const [selectedCard, setSelectedCard] = useState(null);
  const isLoggedIn = Boolean(currentUser);

  useEffect(() => {
    if (!currentUser) return;

    localStorage.setItem(
      getFavoritesStorageKey(currentUser._id),
      JSON.stringify(favoriteFoods),
    );
  }, [currentUser, favoriteFoods]);

  const closeAllModals = () => {
    setActiveModal(null);
    setSelectedCard(null);
  };

  const handleOpenLoginModal = () => setActiveModal("login");
  const handleOpenRegisterModal = () => setActiveModal("register");

  const handleCardClick = (card) => {
    setSelectedCard(card);
    setActiveModal("preview");
  };

  const handleLogin = (credentials) =>
    auth.login(credentials).then((user) => {
      setCurrentUser(user);
      setFavoriteFoods(readFavoriteFoods(user._id));
      closeAllModals();
    });

  const handleRegister = (userData) =>
    auth.register(userData).then((user) => {
      setCurrentUser(user);
      setFavoriteFoods(readFavoriteFoods(user._id));
      closeAllModals();
    });

  const handleLogout = () => {
    auth.logout();
    setCurrentUser(null);
    setFavoriteFoods([]);
    closeAllModals();
  };

  const handleCardLike = ({ item, isLiked }) => {
    if (!currentUser) {
      handleOpenLoginModal();
      return false;
    }

    const id = item._id;

    if (isLiked) {
      setFavoriteFoods((foods) => foods.filter((food) => food._id !== id));
      return true;
    }

    const updatedFood = {
      ...item,
      likes: [...(item.likes || []), currentUser._id],
    };

    setFavoriteFoods((foods) => [
      updatedFood,
      ...foods.filter((food) => food._id !== id),
    ]);
    return true;
  };

  return (
    <CurrentUserContext.Provider value={currentUser}>
      <div className="page">
        <Header
          currentUser={currentUser}
          isLoggedIn={isLoggedIn}
          onLogin={handleOpenLoginModal}
          onRegister={handleOpenRegisterModal}
          onLogout={handleLogout}
        />

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
              {isLoggedIn && (
                <NavLink
                  to="/saved-foods"
                  className={({ isActive }) =>
                    isActive ? "sidebar-nav__link active" : "sidebar-nav__link"
                  }
                >
                  Saved Foods
                </NavLink>
              )}
              <NavLink
                to="/food-challenge"
                className={({ isActive }) =>
                  isActive
                    ? "sidebar-nav__link sidebar-nav__link_type_challenge active"
                    : "sidebar-nav__link sidebar-nav__link_type_challenge"
                }
              >
                Food Challenge
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
                  <ProtectedRoute isLoggedIn={isLoggedIn}>
                    <FoodSection
                      foodItems={favoriteFoods}
                      onCardClick={handleCardClick}
                      onCardLike={handleCardLike}
                    />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/food-challenge"
                element={
                  <FoodChallenge
                    onCardClick={handleCardClick}
                    onCardLike={handleCardLike}
                  />
                }
              />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
        </div>

        <Footer />

        <FoodModal
          card={selectedCard}
          isOpen={activeModal === "preview"}
          onClose={closeAllModals}
        />
        <LoginModal
          isOpen={activeModal === "login"}
          onClose={closeAllModals}
          onLogin={handleLogin}
          onSwitchToRegister={handleOpenRegisterModal}
        />
        <RegisterModal
          isOpen={activeModal === "register"}
          onClose={closeAllModals}
          onRegister={handleRegister}
          onSwitchToLogin={handleOpenLoginModal}
        />
      </div>
    </CurrentUserContext.Provider>
  );
}

export default App;
