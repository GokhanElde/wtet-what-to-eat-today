import "./Header.css";
import logo from "../../assets/Logo.png";
import { Link, NavLink } from "react-router-dom";

const Header = ({ currentUser, isLoggedIn, onLogin, onRegister, onLogout }) => {
  return (
    <header className="header">
      <div className="header__left">
        <Link to="/" className="header__logo-link">
          <img src={logo} alt="WTET logo" className="header__logo" />
        </Link>
        <p className="header__tagline">What To Eat Today?</p>
      </div>

      <nav className="header__nav" aria-label="Main navigation">
        <NavLink to="/" className="header__nav-link">
          Home
        </NavLink>
        {isLoggedIn && (
          <NavLink to="/saved-foods" className="header__nav-link">
            Saved Foods
          </NavLink>
        )}
      </nav>

      <div className="header__auth">
        {isLoggedIn ? (
          <button
            className="header__logout-button"
            type="button"
            onClick={onLogout}
            aria-label={`Log out ${currentUser.name}`}
          >
            <span>{currentUser.name}</span>
            <span className="header__logout-icon" aria-hidden="true" />
          </button>
        ) : (
          <>
            <button
              className="header__auth-button"
              type="button"
              onClick={onRegister}
            >
              Sign Up
            </button>
            <button
              className="header__auth-button"
              type="button"
              onClick={onLogin}
            >
              Log In
            </button>
          </>
        )}
      </div>
    </header>
  );
};

export default Header;
