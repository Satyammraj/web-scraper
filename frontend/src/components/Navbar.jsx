
import { NavLink } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="navbar">
      <NavLink to="/" className="brand">
        <span className="brand-icon">⌘</span>
        <span>RestaurantWebScraper</span>
      </NavLink>

      <div className="nav-links">
        <NavLink
          to="/"
          end
          className={({ isActive }) =>
            isActive ? "nav-link active" : "nav-link"
          }
        >
          Home
        </NavLink>

        <NavLink
          to="/history"
          className={({ isActive }) =>
            isActive ? "nav-link active" : "nav-link"
          }
        >
          History
        </NavLink>

        <a className="nav-link" href="#about">
          About
        </a>
      </div>
    </nav>
  );
}
