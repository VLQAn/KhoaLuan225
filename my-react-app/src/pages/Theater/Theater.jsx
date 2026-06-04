import { FaStar } from "react-icons/fa";
import { MdLocationOn } from "react-icons/md";
import { useEffect, useState } from "react";
import theaterApi from "../../services/theaterApi";
import styles from "./Theater.module.css";

const s = styles;

const Theater = () => {
  const [theaters, setTheaters] = useState([]);

  const [active, setActive] =
    useState("Tất cả");

  const [selectedCity, setSelectedCity] =
    useState("Tất cả");

  useEffect(() => {
    fetchTheaters();
  }, []);

  const fetchTheaters = async () => {
    try {
      const response =
        await theaterApi.getAll();

      console.log(response);

      const data =
        response?.data || [];

      setTheaters(data);
    }
    catch (error) {
      console.error(error);
    }
  };

  const brands = [
    "Tất cả",
    ...new Set(
      theaters.map(
        t => t.thuongHieu
      )
    )
  ];

  const cities = [
    "Tất cả",
    ...new Set(
      theaters.map(t => {

        const parts =
          t.diaChi.split(",");

        return parts[
          parts.length - 1
        ].trim();
      })
    )
  ];

  const filteredTheaters =
    theaters.filter(t => {

      const matchBrand =
        active === "Tất cả" ||
        t.thuongHieu === active;

      const matchCity =
        selectedCity === "Tất cả" ||
        t.diaChi.includes(selectedCity);

      return (
        matchBrand &&
        matchCity
      );
    });

  const generateRating = (id) => {
    return (
      4 + ((id * 7) % 10) / 10
    ).toFixed(1);
  };

  return (
    <div className={s.container}>
      <h1 className={s.title}>Rạp chiếu phim</h1>
      {/* Brand menu */}
      <div className={s.brand_menu}>
        {brands.map((b) => (
          <div
            key={b}
            className={`${s.brand_item}
        ${active === b
                ? s.active
                : ""
              }`}
            onClick={() =>
              setActive(b)
            }
          >
            {b}
          </div>
        ))}
      </div>

      {/* Filter */}
      <select className={s.city_select}
        value={selectedCity}
        onChange={(e) =>
          setSelectedCity(
            e.target.value
          )
        }
      >
        {cities.map(city => (
          <option
            key={city}
            value={city}
          >
            {city}
          </option>
        ))}
      </select>

      {/* Theater list */}
      <div className={s.theater_list}>
        {filteredTheaters.map((t) => (
          <div
            key={t.maRap}
            className={s.theater_card}
          >
            <img
              src={t.logo}
              alt={t.tenRap}
            />

            <div className={s.info}>
              <h3>{t.tenRap}</h3>
              <p>{t.diaChi}</p>
            </div>

            <div className={s.rating}>
              {generateRating(t.maRap)}
              <FaStar color="gold" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Theater;