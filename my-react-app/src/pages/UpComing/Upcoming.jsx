import styles from "./Upcoming.module.css";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaPlay } from "react-icons/fa";

import movieApi from "../../services/movieApi";

const s = styles;

const Upcoming = () => {

  const navigate = useNavigate();

  const [movies, setMovies] = useState([]);

  useEffect(() => {

    const fetchMovies = async () => {

      try {

        const response =
          await movieApi.getAllMovies();

        setMovies(
          response.data.data
        );

      } catch (error) {

        console.error(error);

      }
    };

    fetchMovies();

  }, []);

  const moviesSapChieu =
    movies.filter(
      movie =>
        movie.trangThai ===
        "sap_chieu"
    );

  return (
    <div className={s.container}>

      <h1 className={s.title}>
        Phim sắp chiếu
      </h1>

      <div className={s.grid}>

        {moviesSapChieu.map((movie) => (

          <div
            key={movie.maPhim}
            className={s.card}
            onClick={() =>
              navigate(
                `/movie/${movie.maPhim}`,
                {
                  state: movie,
                }
              )
            }
          >

            <div className={s.poster}>

              <img
                src={movie.anhPoster}
                alt={movie.tieuDe}
              />

              <div className={s.overlay}>
                <FaPlay />
              </div>

            </div>

            <div className={s.info}>

              <div className={s.top}>

                <h3>
                  {movie.tieuDe}
                </h3>

                <span className={s.rating}>
                  {movie.danhGia}
                  <span>/10</span>
                </span>

              </div>

              <p className={s.date}>
                CÔNG CHIẾU
              </p>

              <p className={s.time}>
                {new Date(
                  movie.ngayCongChieu
                ).toLocaleDateString(
                  "vi-VN"
                )}
              </p>

              <div className={s.bottom}>

                <span>
                  THỜI LƯỢNG
                </span>

                <b>
                  {movie.thoiLuong} phút
                </b>

              </div>

            </div>

          </div>

        ))}

      </div>

    </div>
  );
};

export default Upcoming;
