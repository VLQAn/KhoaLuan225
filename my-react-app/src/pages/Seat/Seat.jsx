import styles from "./Seat.module.css";
import React, {
    useEffect,
    useState
} from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import seatApi from "../../services/seatApi";
import xuatChieuApi from "../../services/xuatChieuApi";
import giaVeApi from "../../services/giaVeApi";

const s = styles;

const Seat = () => {
    const navigate = useNavigate();
    const { state } = useLocation();

    const [selectedSeats, setSelectedSeats] = useState([]);
    const [soldSeats, setSoldSeats] = useState([]);
    const [seats, setSeats] = useState([]);
    const [xuatChieu, setXuatChieu] = useState(null);
    const [giaVe, setGiaVe] = useState(0);

    const toggleSeat = (seat) => {

        if (seat.daDat) return;

        setSelectedSeats(prev => {

            const exists =
                prev.find(
                    s => s.maGhe === seat.maGhe
                );

            if (exists) {

                return prev.filter(
                    s => s.maGhe !== seat.maGhe
                );
            }

            return [...prev, seat];
        });
    };

    const loadXuatChieu = async () => {
        try {
            const data = await xuatChieuApi.getById(maXuatChieu);

            if (data?.thoiGianBatDau) {
                data.thoiGianBatDau =
                    data.thoiGianBatDau.replace("Z", "");
            }

            if (data?.thoiGianKetThuc) {
                data.thoiGianKetThuc =
                    data.thoiGianKetThuc.replace("Z", "");
            }

            setXuatChieu(data);

        } catch (err) {
            console.log(err);
        }
    };

    const loadGiaVe = async () => {

        try {

            const res =
                await giaVeApi.getByXuatChieu(
                    maXuatChieu
                );

            setGiaVe(
                Number(res.data.gia)
            );

        } catch (error) {

            console.log(error);
        }
    };

    const price = giaVe;

    const seatTotal = selectedSeats.length * price;
    const total = selectedSeats.length * price;

    const { maXuatChieu } =
        useParams();

    useEffect(() => {
        if (!maXuatChieu) return;

        loadSeatMap();
        loadXuatChieu();
        loadGiaVe();
    }, [maXuatChieu]);

    const loadSeatMap = async () => {
        try {
            const response =
                await seatApi.getSeatMap(maXuatChieu);

            const seatData = response.data?.seats || [];

            setSeats(seatData);

            const booked = seatData
                .filter(seat => seat.daDat)
                .map(seat => seat.tenGhe);

            setSoldSeats(booked);

        } catch (error) {
            console.log(error);
        }
    };

    const groupedSeats = seats.reduce((acc, seat) => {

        if (!acc[seat.hangGhe]) {
            acc[seat.hangGhe] = [];
        }

        acc[seat.hangGhe].push(seat);

        return acc;

    }, {});

    Object.keys(groupedSeats).forEach(row => {
        groupedSeats[row].sort(
            (a, b) => a.soGhe - b.soGhe
        );
    });

    const formatVND = (value) => {
        if (!value) return "0 VNĐ";

        return Number(value).toLocaleString("vi-VN") + " VNĐ";
    };

    return (<div className={s.container}>
        {/* LEFT: SEAT */}
        <div className={s.left}>
            <h2>Chọn ghế</h2>

            {/* Screen */}
            <div className={s.screen}>
                Màn hình
            </div>

            <div className={s.map}>
                {Object.entries(groupedSeats).map(
                    ([row, rowSeats]) => (

                        <div
                            key={row}
                            className={s.row}
                        >
                            <span className={s.label}>
                                {row}
                            </span>

                            <div className={s.seats}>
                                {rowSeats.map((seat) => (

                                    <div
                                        key={seat.maGhe}
                                        className={`
                                ${s.seat}
                                ${seat.daDat
                                                ? s.sold
                                                : ""
                                            }
                                ${selectedSeats.some(s => s.maGhe === seat.maGhe)
                                                ? s.active
                                                : ""
                                            }
                                ${seat.loaiGhe === "vip"
                                                ? s.vip
                                                : ""
                                            }
                            `}
                                        onClick={() => toggleSeat(seat)}
                                    >
                                        {seat.soGhe}
                                    </div>

                                ))}
                            </div>

                            <span className={s.label}>
                                {row}
                            </span>
                        </div>

                    )
                )}
            </div>

            {/* Legend */}
            <div className={s.legend}>
                <div><span className={`${s.box} ${s.sold}`}></span> Ghế đã bán</div>
                <div><span className={`${s.box} ${s.active}`}></span> Ghế đang chọn</div>
                <div><span className={`${s.box} ${s.normal}`}></span> Ghế thường <b>{formatVND(giaVe)}</b></div>
            </div>
        </div>

        {/* RIGHT: INFO */}
        <div className={s.right}>
            <div className={s.card}>
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
                            {xuatChieu?.thoiGianBatDau &&
                                new Date(xuatChieu.thoiGianBatDau)
                                    .toLocaleTimeString("vi-VN", {
                                        hour: "2-digit",
                                        minute: "2-digit"
                                    })}
                        </b>

                        {" - "}

                        Ngày chiếu: <b>
                            {xuatChieu?.thoiGianBatDau &&
                                new Date(xuatChieu.thoiGianBatDau)
                                    .toLocaleDateString("vi-VN")}
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
                        Giá: <b className={s.price}>{formatVND(seatTotal)}</b>
                    </p>
                </div>

                <hr />

                {/* Total */}
                <div className={s.total}>
                    <span>Tổng cộng:</span>
                    <span className={s.price}>
                        {formatVND(total)}
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
                            navigate(`/food/${maXuatChieu}`, {
                                state: {
                                    maXuatChieu,
                                    selectedSeats,
                                    total,
                                    seatPrice: seatTotal,
                                    giaVe: giaVe
                                }
                            })
                        }
                    >
                        Tiếp tục
                    </button>
                </div>
            </div>
        </div>
    </div >
    );
};

export default Seat;