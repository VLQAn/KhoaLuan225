import styles from "./Seat.module.css";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const s = styles;

const rows = ["K", "J", "I", "H", "G", "F", "E", "D", "C", "B", "A"];
const soldSeats = ["I8", "I9", "G7"];

const Seat = () => {
    const navigate = useNavigate();
    const { state } = useLocation();

    const [selected, setSelected] = useState([]);

    const toggleSeat = (seat) => {
        if (soldSeats.includes(seat)) return;

        setSelected((prev) =>
            prev.includes(seat)
                ? prev.filter((s) => s !== seat)
                : [...prev, seat]
        );

    };

    const price = 75000;
    const total = selected.length * price;

    return (<div className={s.container}>
        {/* LEFT: SEAT */}
        <div className={s.left}>
            <h2>Chọn ghế</h2>

            <div className={s.map}>
                {rows.map((row) => (
                    <div key={row} className={s.row}>
                        <span className={s.label}>{row}</span>

                        <div className={s.seats}>
                            {[...Array(16)].map((_, i) => {
                                const num = i + 1;
                                const seatId = row + num;

                                if (num === 3 || num === 14) {
                                    return <div key={i} className={s.space}></div>;
                                }

                                return (
                                    <div
                                        key={seatId}
                                        className={`${s.seat}
                    ${soldSeats.includes(seatId) ? s.sold : ""}
                    ${selected.includes(seatId) ? s.active : ""}
                  `}
                                        onClick={() => toggleSeat(seatId)}
                                    >
                                        {num}
                                    </div>
                                );
                            })}
                        </div>

                        <span className={s.label}>{row}</span>
                    </div>
                ))}
            </div>

            {/* Screen */}
            <div className={s.screen}>
                Màn hình
            </div>

            {/* Legend */}
            <div className={s.legend}>
                <div><span className={`${s.box} ${s.sold}`}></span> Ghế đã bán</div>
                <div><span className={`${s.box} ${s.active}`}></span> Ghế đang chọn</div>
                <div><span className={s.box}></span> Ghế thường</div>
            </div>
        </div>

        {/* RIGHT: INFO */}
        <div className={s.right}>
            <div className={s.card}>
                {/* Header */}
                <div className={s.header}></div>

                {/* Movie */}
                <div className={s.movie}>
                    <img
                        src="https://image.tmdb.org/t/p/w500/q6725aR8Zs4IwGMXzZT8aC8lh41.jpg"
                        alt="poster"
                    />

                    <div className={s.info}>
                        <h3>{state?.movie || "Avengers: Endgame"}</h3>
                        <p>2D Phụ đề</p>
                    </div>

                    <span className={s.age}>16+</span>
                </div>

                {/* Cinema */}
                <div className={s.cinema}>
                    <b>{state?.cinema || "CGV Nha Trang"}</b> - Rạp 1
                    <p>
                        Suất: <b>{state?.time || "20:30"}</b> -{" "}
                        <b>{state?.date || "29/04/2026"}</b>
                    </p>
                </div>

                <hr />

                {/* Seats */}
                <div className={s.seatInfo}>
                    <p>
                        <b>{selected.length}x</b> Ghế đơn
                    </p>
                    <p>
                        Ghế: <b>{selected.join(", ") || "Chưa chọn"}</b>
                    </p>
                </div>

                <hr />

                {/* Total */}
                <div className={s.total}>
                    <span>Tổng cộng:</span>
                    <span className={s.price}>
                        {total.toLocaleString()} VNĐ
                    </span>
                </div>

                {/* Buttons */}
                <div className={s.actions}>
                    <button
                        className={s.back}
                        onClick={() => navigate(-1)}
                    >
                        Quay lại
                    </button>

                    <button
                        className={s.next}
                        disabled={selected.length === 0}
                        onClick={() => navigate("/payment", { state: { selected, total } })}
                    >
                        Tiếp tục
                    </button>
                </div>
            </div>
        </div>
    </div>
    );
};

export default Seat;