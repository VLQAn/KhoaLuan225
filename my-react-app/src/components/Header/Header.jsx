// src/components/Header.jsx
import { Link } from "react-router-dom";
import { FaSearch, FaFacebook, FaGoogle } from "react-icons/fa";

const Header = () => {
  return (
    <div className="banner">
      <div className="header">
        <div className="menu">☰</div>
        <div className="logo">RACSO</div>

        <div className="icons">
          <span><FaSearch /></span>
          <span><FaFacebook /></span>
          <span><FaGoogle /></span>
          <span>
            <Link to="/register">Đăng nhập / Đăng ký</Link>
          </span>
        </div>
      </div>
    </div>
  );
};

export default Header;