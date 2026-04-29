import { FaStar } from "react-icons/fa";
import { MdLocationOn } from "react-icons/md";
import { useState } from "react";
import styles from "./Theater.module.css";
const brands = ["Galaxy", "Beta", "CGV", "Lotte", "BHD", "Cinestar", "MegaGS", "DDC"];

const s = styles;

const theatersData = [
  {
    name: "Tên rạp 1",
    address: "Địa chỉ 1",
    rating: 4.2,
    logo: "https://i.pinimg.com/1200x/28/6a/44/286a44ffe1fa38b026aeb94d157651a6.jpg",
  },
  {
    name: "Tên rạp 2",
    address: "Địa chỉ 2",
    rating: 4.2,
    logo: "https://i.pinimg.com/1200x/28/6a/44/286a44ffe1fa38b026aeb94d157651a6.jpg",
  },
];

const Theater = () => {
  const [active, setActive] = useState("Galaxy");

  return (
    <div className={s.container}>
      <h1 className={s.title}>Rạp chiếu phim</h1>
      {/* Brand menu */}
      <div className={s.brand_menu}>
        {brands.map((b) => (
          <div
            key={b}
            className={`${s.brand_item} ${active === b ? s.active : ""}`}
            onClick={() => setActive(b)}
          >
            {b}
          </div>
        ))}
      </div>

      {/* Filter */}
      <div className={s.filter}>
        <select>
          <option>Đà Nẵng</option>
          <option>Hà Nội</option>
          <option>Hồ Chí Minh</option>
        </select>
      </div>

      {/* Theater list */}
      <div className={s.theater_list}>
        {theatersData.map((t, i) => (
          <div key={i} className={s.theater_card}>
            <img src={t.logo} alt="" />
            <div className={s.info}>
              <h3>{t.name}</h3>
              <p>{t.address}</p>
            </div>

            <div className={s.rating}>
              {t.rating} <FaStar color="gold" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Theater;