import styles from "./Showtime.module.css";
import { useNavigate, useLocation, useParams } from "react-router-dom";

const s = styles;

const showtimes = [
    {
        cinema: "CGV Nha Trang",
        times: ["18:00", "20:30", "22:00"],
    },
    {
        cinema: "Lotte Cinema",
        times: ["17:30", "19:45"],
    },
];

const Showtime = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const { state: movie } = useLocation();

    return (<div className={s.container}> <h1>Chọn suất chiếu</h1>

        {showtimes.map((c, i) => (
            <div key={i} className={s.cinema}>
                <h3>{c.cinema}</h3>

                <div className={s.times}>
                    {c.times.map((t, idx) => (
                        <button
                            key={idx}
                            onClick={() =>
                                navigate("/seat", {
                                    state: {
                                        movie,
                                        cinema: c.cinema,
                                        time: t,
                                    },
                                })
                            }
                        >
                            {t}
                        </button>
                    ))}
                </div>
            </div>
        ))}
    </div>

    );
};

export default Showtime;
