import { NavLink, useNavigate } from "react-router-dom";
import "../styles/Sidebar.css";

const Sidebar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    const confirmLogout = window.confirm("Are you sure you want to log out?");
    if (confirmLogout) {
      localStorage.removeItem("token");
      navigate("/login");
    }
  };

  return (
    <div className="sidebar">
      <h2>CareerCarve</h2>
      <ul>
        <li>
          <NavLink to="/" activeClassName="active" end>
            Home
          </NavLink>
        </li>

        <li>
          <NavLink to="/book-new-session" activeClassName="active" end>
            Book New Session
          </NavLink>
        </li>
        <li>
          <NavLink to="/my-bookings" activeClassName="active" end>
            My Bookings
          </NavLink>
        </li>

        <li>
          <a href="#logout" onClick={handleLogout} className="sidebar-link">
            Log Out
          </a>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
