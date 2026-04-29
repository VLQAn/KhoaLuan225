import styles from "./Checkout.module.css";
import { useLocation } from "react-router-dom";

const s = styles;

const Checkout = () => {
    const { state } = useLocation();

    const selected = state?.selected || [];
    const total = state?.total || 0;

    return (
        <div>
            <h2>Thanh toán</h2>

            <p>Số ghế: {selected.length}</p>
            <p>Ghế: {selected.join(", ")}</p>
            <p>Tổng tiền: {total.toLocaleString()} VNĐ</p>
        </div>
    );
};

export default Checkout;
