import styles from "./Food.module.css";
import React, {
    useEffect,
    useState
} from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useParams } from "react-router-dom";
import xuatChieuApi from "../../services/xuatChieuApi";
import bapNuocApi from "../../services/bapNuocApi";

const s = styles;

const Food = () => {
    const { state } = useLocation();
    const navigate = useNavigate();

    const [cart, setCart] = useState({});

    const selectedSeats = state?.selectedSeats || [];

    const seatPrice =
        state?.seatPrice || 0;

    const giaVe =
        state?.giaVe || 0;

    const { maXuatChieu } = useParams();

    const [xuatChieu, setXuatChieu] = useState(null);

    const [foods, setFoods] = useState([]);

    const [maRap, setMaRap] = useState(null);

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

    const foodTotal = foods.reduce((sum, f) => {
        return sum + (cart[f.maMon] || 0) * Number(f.gia);
    }, 0);

    const total = (state?.total || 0) + foodTotal;

    useEffect(() => {
        if (!maXuatChieu) return;

        const loadData = async () => {
            try {
                // 1. Lấy xuất chiếu
                const xuatChieuRes = await xuatChieuApi.getById(maXuatChieu);

                const xuatChieuData = xuatChieuRes;

                setXuatChieu(xuatChieuData);

                const rap = xuatChieuData?.phong_chieu?.maRap;
                if (!rap) return;

                console.log("RAP:", rap);

                // 2. Lấy đồ ăn theo rạp (API backend đã filter sẵn)
                const foodRes = await bapNuocApi.getFoodsByRap(rap);

                console.log("FOODS API:", foodRes);

                setFoods(foodRes.data || []);

            } catch (err) {
                console.log(err);
            }
        };

        loadData();
    }, [maXuatChieu]);

    const formatVND = (value) => {
        if (!value) return "0 VNĐ";

        return Number(value).toLocaleString("vi-VN") + " VNĐ";
    };

    const displayDate = xuatChieu?.thoiGianBatDau
        ? new Date(xuatChieu.thoiGianBatDau)
        : null;

    return (
        <div className={s.container}>
            {/* LEFT */}
            <div className={s.left}>
                <h2 className={s.title}>Chọn bắp nước</h2>

                {foods.map((f) => (
                    <div key={f.maMon} className={s.card}>
                        <img src={f.hinhAnh} alt={f.tenMon} />

                        <div className={s.info}>
                            <h3>{f.tenMon}</h3>
                            <p>{f.moTa}</p>
                            <span>Giá: {formatVND(f.gia)}</span>
                        </div>

                        <div className={s.qty}>
                            <button onClick={() => updateQty(f.maMon, -1)}>-</button>
                            <span>{cart[f.maMon] || 0}</span>
                            <button onClick={() => updateQty(f.maMon, 1)}>+</button>
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
                        <img src={xuatChieu?.phim?.anhPoster} alt="poster" />

                        <div className={s.info}>
                            <h3>{xuatChieu?.phim?.tieuDe}</h3>
                            <p>2D Phụ đề</p>
                        </div>
                    </div>

                    {/* Cinema */}
                    <div className={s.cinema}>
                        <b>{xuatChieu?.phong_chieu?.rap_chieu?.tenRap}</b> - {xuatChieu?.phong_chieu?.tenPhong}
                        <p>
                            Suất: <b>
                                {displayDate?.toLocaleTimeString("vi-VN", {
                                    hour: "2-digit",
                                    minute: "2-digit"
                                })}
                            </b>

                            {" - "}

                            Ngày chiếu: <b>
                                {displayDate?.toLocaleDateString("vi-VN")}
                            </b>
                        </p>
                    </div>

                    <hr />

                    {/* Seats */}
                    <div className={s.seatInfo}>
                        <p>
                            <b>{selectedSeats.length}x</b> Ghế đơn
                        </p>
                        <p>
                            Ghế: <b>{selectedSeats.map(s => s.tenGhe).join(", ") || "Chưa chọn"}</b>
                        </p>

                        <p className={s.subPrice + " " + s.total}>
                            Giá: <b className={s.price}>{formatVND(seatPrice)}</b>
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
                                .filter(f => cart[f.maMon])
                                .map(f => (
                                    <div key={f.maMon} className={s.foodItem}>
                                        <span>{f.tenMon}</span>
                                        <span>x{cart[f.maMon] || 0}</span>
                                    </div>
                                ))
                        )}

                        <div className={s.foodTotal + " " + s.total}>
                            <span>Tiền đồ ăn:</span>
                            <span className={s.price}>{formatVND(foodTotal)}</span>
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
                            disabled={selectedSeats.length === 0}
                            onClick={() =>
                                navigate("/checkout", {
                                    state: {
                                        maXuatChieu,

                                        selectedSeats,

                                        cart,

                                        foods,

                                        total,

                                        xuatChieu,

                                        seatPrice,

                                        giaVe
                                    }
                                })
                            }
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
