import styles from "./Checkout.module.css";
import { useLocation } from "react-router-dom";

const s = styles;

const Checkout = () => {
    const { state } = useLocation();

    const total = state.seats.length * 75000;

    return (<div className={s.container}> <h1>Thanh toán</h1>

        <p>🎬 {state.movie.title}</p>
        <p>🏢 {state.cinema}</p>
        <p>⏰ {state.time}</p>
        <p>💺 {state.seats.join(", ")}</p>

        <h2>Tổng tiền: {total.toLocaleString()} VND</h2>

        <button className={s.btn}>Thanh toán</button>
    </div>
    );
};

export default Checkout;
