import styles from "./MovieList.module.css";
import { FaPlay } from "react-icons/fa";

const s = styles;

const movies = [
  {
    title: "Avengers: Endgame",
    img: "https://i.pinimg.com/webp70/1200x/95/26/68/9526684fe11e38cf6bb6fbd48e37de6a.webp",
    rating: 8.8,
    time: "150 phút",
    date: "08/09/2019",
  },
  {
    title: "Hobbs & Shaw",
    img: "https://i.pinimg.com/736x/37/03/12/370312c8081e99ef4966ad4c31de2d58.jpg",
    rating: 9.7,
    time: "135 phút",
    date: "04/07/2019",
  },
  {
    title: "John Wick 3",
    img: "https://i.pinimg.com/736x/b9/60/47/b96047782b6aa80bcedddcc5cdde6b83.jpg",
    rating: 9.1,
    time: "155 phút",
    date: "16/08/2019",
  },
  {
    title: "Deadpool 2",
    img: "https://i.pinimg.com/1200x/13/2e/88/132e8848588cd7c39cfcc1d5a7f6e1cd.jpg",
    rating: 7.3,
    time: "120 phút",
    date: "15/10/2019",
  },
  {
    title: "The Lion King",
    img: "https://i.pinimg.com/1200x/29/48/c6/2948c6b3e59b7d64df4692b7a3e20e20.jpg",
    rating: 8.3,
    time: "120 phút",
    date: "08/09/2019",
  },
  {
    title: "Mad Max",
    img: "https://i.pinimg.com/1200x/94/64/02/946402481b74c5dc7b0087faaa981ebe.jpg",
    rating: 7.4,
    time: "130 phút",
    date: "04/07/2019",
  },
  {
    title: "Aquaman",
    img: "https://i.pinimg.com/1200x/6b/41/a1/6b41a14dd81c2822134398657f5bf80b.jpg",
    rating: 8.0,
    time: "135 phút",
    date: "16/08/2019",
  },
  {
    title: "Mission Impossible",
    img: "https://i.pinimg.com/1200x/7e/a3/99/7ea399e4b592a0b969d77916a93e001a.jpg",
    rating: 7.8,
    time: "153 phút",
    date: "15/10/2019",
  },
];

const MovieList = () => {
  return (
    <div className={s.container}>
      <h1 className={s.title}>Phim đang chiếu</h1>

      <div className={s.grid}>
        {movies.map((m, i) => (
          <div key={i} className={s.card}>
            <div className={s.poster}>
              <img src={m.img} alt={m.title} />

              <div className={s.overlay}>
                <FaPlay />
              </div>
            </div>

            <div className={s.info}>
              <div className={s.top}>
                <h3>{m.title}</h3>
                <span className={s.rating}>{m.rating}<span>/10</span></span>
              </div>

              <p className={s.date}>CÔNG CHIẾU</p>
              <p className={s.time}>{m.date}</p>

              <div className={s.bottom}>
                <span>THỜI LƯỢNG</span>
                <b>{m.time}</b>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MovieList;