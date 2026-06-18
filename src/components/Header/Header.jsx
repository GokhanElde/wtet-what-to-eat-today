import "./Header.css";
import logo from "../../assets/Logo.png";
import { Link, NavLink } from "react-router-dom";

const Header = () => {
  return (
    <header className="header">
      <div className="header__left">
        <Link to="/" className="header__logo-link">
          <img src={logo} alt="WTET logo" className="header__logo" />
        </Link>
        <p className="header__tagline">What To Eat Today?</p>
      </div>

      <nav className="header__nav">
        <NavLink to="/" className="header__nav-link">
          Home
        </NavLink>
        <NavLink to="/saved-foods" className="header__nav-link">
          Saved Foods
        </NavLink>
      </nav>
    </header>
  );
};

export default Header;
