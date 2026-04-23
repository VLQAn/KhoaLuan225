import { Scripts } from "react-router-dom";
import styles from "./Sidebar.module.css";
import { useState } from "react";

const s = styles;

const Sidebar = () => {
  const [isActive, setIsActive] = useState(false);
  
  return (
    <>
    {/* Overlay */}
    {isActive && (
    <div 
        className={s.overlay}
        onClick={() => setIsActive(false)}
    ></div>
    )}

    <nav className={`${s.sidebar} ${!isActive ? s.close : ""}`}>
      {/* Sidebar content */}
      <header>
        <div className={s.image_text}>
            <span className={s.image}>
                <img src="icon.jpg" alt="logo" />
            </span>

            <div className={s.text + " " + s.header_text}>
                <span className={s.name}>RACSO</span>
                <span className={s.prof}>Your Cenima</span>
            </div>
        </div>
        <i className={`fa-solid fa-chevron-right ${s.toggle}`} 
            onClick={() => setIsActive(!isActive)}></i>
      </header>

      <div className={s.menu_bar}>
        {/* Menu items */}
        <div className={s.menu}>
          <ul className={s.menu_links}>
            <li className={s.nav_link}>
                <a href="#">
                    <i className={`fa-solid fa-house ${s.icon}`}></i>
                    <span className={s.text + " " + s.nav_text}>Trang chủ</span>
                </a>
            </li>
            <li className={s.nav_link}>
                <a href="#">
                    <i className={`fa-solid fa-film ${s.icon}`}></i>
                    <span className={s.text + " " + s.nav_text}>Phim đang chiếu</span>
                </a>
            </li>
            <li className={s.nav_link}>
                <a href="#">
                    <i className={`fa-solid fa-video ${s.icon}`}></i>
                    <span className={s.text + " " + s.nav_text}>Phim sắp chiếu</span>
                </a>
            </li>
            <li className={s.nav_link}>
                <a href="#">
                    <i className={`fa-solid fa-masks-theater ${s.icon}`}></i>
                    <span className={s.text + " " + s.nav_text}>Rạp chiếu</span>
                </a>
            </li>
            <li className={s.nav_link}>
                <a href="#">
                    <i className={`fa-solid fa-clock-rotate-left ${s.icon}`}></i>
                    <span className={s.text + " " + s.nav_text}>Lịch sử đặt vé</span>
                </a>
            </li>
            <li className={s.nav_link}>
                <a href="#">
                    <i className={`fa-solid fa-tags ${s.icon}`}></i>
                    <span className={s.text + " " + s.nav_text}>Khuyến mãi</span>
                </a>
            </li>
          </ul>
        </div>

        <div className={s.bottom_content}>
            <li className={s.nav_link}>
                <a href="#">
                    <i className={`fa-solid fa-arrow-right-from-bracket fa-flip-horizontal ${s.icon}`}></i>
                    <span className={s.text + " " + s.nav_text}>Đăng xuất</span>
                </a>
            </li>
        </div>
      </div>
    </nav>
     </>
  );
};

export default Sidebar;
