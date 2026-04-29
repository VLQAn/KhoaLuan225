import styles from "./Upcoming.module.css";
import { FaPlay } from "react-icons/fa";

const s = styles;

const movies = [
  {
    title: "Avartar 3: Fire and Ash",
    img: "https://i.pinimg.com/736x/fc/64/f4/fc64f4ef0381331d52a80b204ce75749.jpg",
    rating: 9.5,
    time: "150 phút",
    date: "08/09/2025",
  },
  {
    title: "GOAT",
    img: "https://i.pinimg.com/736x/b0/fa/a2/b0faa2e1f9e9e690797a299f605636b0.jpg",
    rating: 9.7,
    time: "135 phút",
    date: "04/07/2025",
  },
  {
    title: "Zootopia 2",
    img: "https://i.pinimg.com/736x/18/de/51/18de511cdd9147882a416e8618ea07db.jpg",
    rating: 9.1,
    time: "155 phút",
    date: "16/08/2025",
  },
  {
    title: "Weapons",
    img: "https://i.pinimg.com/736x/b6/5b/11/b65b1122a62d854ed818c69dd3bd2c3b.jpg",
    rating: 7.3,
    time: "120 phút",
    date: "15/10/2025",
  },
  {
    title: "Captain America: Brave New World",
    img: "https://i.pinimg.com/736x/7d/b4/7a/7db47a4f2af662065b63d40b99128a9a.jpg",
    rating: 8.3,
    time: "120 phút",
    date: "08/09/2025",
  },
  {
    title: "Demon Slayer: Vô hạn thành",
    img: "https://i.pinimg.com/736x/39/9b/83/399b83aa72375e3e8aad65b57656f646.jpg",
    rating: 7.4,
    time: "130 phút",
    date: "04/07/2025",
  },
];

const Upcoming = () => {
  return (
    <div className={s.container}>
      <h1 className={s.title}>Phim sắp chiếu</h1>

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

export default Upcoming;