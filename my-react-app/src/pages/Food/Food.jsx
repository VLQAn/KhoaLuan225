import styles from "./Food.module.css";
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";


const s = styles;

const foods = [
    {
        id: 1,
        name: "Combo 1 medium",
        desc: "Một bắp rang bơ truyền thống cỡ vừa + 1 Pepsi cỡ vừa",
        price: 85000,
        img: "https://cdn-icons-png.flaticon.com/512/1046/1046784.png",
    },
    {
        id: 2,
        name: "Combo 1 large",
        desc: "Một bắp rang bơ truyền thống cỡ lớn + 2 Pepsi cỡ vừa + một snack bất kỳ",
        price: 120000,
        img: "https://cdn-icons-png.flaticon.com/512/1046/1046784.png",
    },
    {
        id: 3,
        name: "Combo gia đình 1",
        desc: "Một bắp rang siêu lớn chọn vị + 4 nước tự chọn cỡ vừa",
        price: 200000,
        img: "https://cdn-icons-png.flaticon.com/512/1046/1046784.png",
    },
    {
        id: 4,
        name: "Combo gia đình 2",
        desc: "Hai bắp rang siêu lớn chọn vị + 4 nước tự chọn cỡ lớn + 2 snack bất kỳ",
        price: 225000,
        img: "https://cdn-icons-png.flaticon.com/512/1046/1046784.png",
    },
];

const Food = () => {
    const { state } = useLocation();
    const navigate = useNavigate();

    const [cart, setCart] = useState({});

    const selected = state?.selected || [];

    const updateQty = (id, delta) => {
        setCart((prev) => {
            const newQty = (prev[id] || 0) + delta;
            if (newQty <= 0) {
                const clone = { ...prev };
                delete clone[id];
                return clone;
            }
            return { ...prev, [id]: newQty };
        });
    };

    const seatPrice = state?.total || 0;

    const foodTotal = foods.reduce((sum, f) => {
        return sum + (cart[f.id] || 0) * f.price;
    }, 0);

    const total = (state?.total || 0) + foodTotal;

    return (
        <div className={s.container}>
            {/* LEFT */}
            <div className={s.left}>
                <h2 className={s.title}>Chọn bắp nước</h2>

                {foods.map((f) => (
                    <div key={f.id} className={s.card}>
                        <img src={f.img} alt="" />

                        <div className={s.info}>
                            <h3>{f.name}</h3>
                            <p>{f.desc}</p>
                            <span>Giá: {f.price.toLocaleString()} VND</span>
                        </div>

                        <div className={s.qty}>
                            <button onClick={() => updateQty(f.id, -1)}>-</button>
                            <span>{cart[f.id] || 0}</span>
                            <button onClick={() => updateQty(f.id, 1)}>+</button>
                        </div>
                    </div>
                ))}
            </div>

            {/* RIGHT: INFO */}
            <div className={s.right}>
                <div className={s.right_card}>
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

                        <p className={s.subPrice + " " + s.total}>
                            Giá: <b className={s.price}>{seatPrice.toLocaleString()}đ</b>
                        </p>
                    </div>

                    <hr />

                    {/* Food */}
                    <div className={s.foodInfo}>
                        <p><b>Đồ ăn:</b></p>

                        {Object.keys(cart).length === 0 ? (
                            <p className={s.empty}>Chưa chọn</p>
                        ) : (
                            foods
                                .filter(f => cart[f.id])
                                .map(f => (
                                    <div key={f.id} className={s.foodItem}>
                                        <span>{f.name}</span>
                                        <span>x{cart[f.id]}</span>
                                    </div>
                                ))
                        )}

                        <div className={s.foodTotal + " " + s.total}>
                            <span>Tiền đồ ăn:</span>
                            <span className={s.price}>{foodTotal.toLocaleString()}đ</span>
                        </div>
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
                            onClick={() => navigate("/checkout", { state: { selected, total } })}
                        >
                            Tiếp tục
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Food;
