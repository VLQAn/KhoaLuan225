import styles from "./MovieDetail.module.css";
import { FaPlay } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import { MdMovie, MdLocationOn, MdAccessTime, MdDateRange } from "react-icons/md";
import { useLocation } from "react-router-dom";
import { useState } from "react";

const s = styles;

const dates = [
    { label: "Hôm nay", date: "29/04" },
    { label: "Thứ năm", date: "30/04" },
    { label: "Thứ sáu", date: "01/05" },
];

const showtimes = [
    {
        date: "29/04",
        cinema: "CGV Nha Trang",
        times: ["18:00", "20:30", "22:00"],
    },
    {
        date: "30/04",
        cinema: "CGV Nha Trang",
        times: ["17:00", "19:30"],
    },
    {
        date: "01/05",
        cinema: "CGV Nha Trang",
        times: ["16:00", "21:00"],
    },
];

const MovieDetail = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const { state: Movie } = useLocation();
    const [selectedDate, setSelectedDate] = useState(dates[0].date);

    const movie = {
        title: Movie?.title || "Avengers: Endgame",
        img: Movie?.img || "https://i.pinimg.com/webp70/1200x/95/26/68/9526684fe11e38cf6bb6fbd48e37de6a.webp",
        banner: Movie?.banner || "https://i.pinimg.com/1200x/0b/ac/89/0bac898999f616d08e0208933bfed909.jpg",
        rating: Movie?.rating || 8.8,
        time: Movie?.time || "181 phút",
        date: Movie?.date || "26/04/2019",
        genre: "Hành động, Viễn tưởng",
        desc: "Sau Infinity War, các Avengers phải tập hợp để đảo ngược hậu quả do Thanos gây ra.",
    };

    return (
        <div className={s.container}>
            {/* Banner */}
            <div className={s.banner} style={{ backgroundImage: `url(${movie.banner})` }}>
                <div className={s.overlay}></div>
            </div>

            {/* Info */}
            <div className={s.content}>
                <div className={s.poster}>
                    <img src={movie.img} alt={movie.title} />

                    <div className={s.play}>
                        <FaPlay />
                    </div>
                </div>

                <div className={s.info}>
                    <div className={s.top}>
                        <h1>{movie.title}</h1>
                        <span className={s.rating}>
                            {movie.rating} <span>/10</span>
                        </span>
                    </div>

                    <p className={s.meta}>
                        <MdMovie className={s.icon} />
                        {movie.genre}
                    </p>
                    <p className={s.meta}>
                        <MdAccessTime className={s.icon} />
                        {movie.time}
                    </p>
                    <p className={s.meta}>
                        <MdDateRange className={s.icon} />
                        {movie.date}
                    </p>

                    <p className={s.desc}>{movie.desc}</p>
                </div>
            </div>

            {/* Showtime */}
            <div className={s.showtime}>
                <div className={s.showtime_header}>
                    <h2>Lịch chiếu</h2>

                    <div className={s.date_list}>
                        {dates.map((d, i) => (
                            <div
                                key={i}
                                className={`${s.date_item} ${selectedDate === d.date ? s.active : ""
                                    }`}
                                onClick={() => setSelectedDate(d.date)}
                            >
                                <p>{d.label}</p>
                                <span>{d.date}</span>
                            </div>
                        ))}
                    </div>

                </div>

                {showtimes
                    .filter((c) => c.date === selectedDate)
                    .map((c, i) => (
                        <div key={i} className={s.cinema}>
                            <h3>{c.cinema}</h3>

                            <div className={s.times}>
                                {c.times.map((t, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => navigate(`/seat/${idx + 1}`)}
                                    >
                                        {t}
                                    </button>
                                ))}
                            </div>
                        </div>
                    ))}
            </div>
        </div>
    );
};

export default MovieDetail;