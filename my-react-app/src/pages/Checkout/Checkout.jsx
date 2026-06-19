import styles from "./Checkout.module.css";
import { useLocation } from "react-router-dom";
import { useState } from "react";
import datVeApi from "../../services/datVeApi";
import paymentApi from "../../services/paymentApi";

const s = styles;

const Checkout = () => {

    const { state } = useLocation();

    console.log("CHECKOUT STATE", state);

    const foods =
        state?.foods || [];

    const seatPrice =
        state?.seatPrice || 0;

    const giaVe =
        state?.giaVe || 0;

    const selectedSeats =
        state?.selectedSeats || [];

    const cart =
        state?.cart || {};

    const total =
        state?.total || 0;

    const xuatChieu =
        state?.xuatChieu;

    const [paymentMethod,
        setPaymentMethod] =
        useState("vnpay");

    const formatVND = value =>
        Number(value).toLocaleString("vi-VN") + " VNĐ";

    const showDate = xuatChieu?.thoiGianBatDau
        ? new Date(
            xuatChieu.thoiGianBatDau.replace("Z", "")
        )
        : null;

    console.log(selectedSeats);

    const handlePayment = async () => {

        try {

            // Tạo hóa đơn + giữ ghế
            const bookingRes =
                await datVeApi.create({
                    maXuatChieu:
                        xuatChieu.maXuatChieu,

                    danhSachGhe:
                        selectedSeats.map(
                            seat => seat.maGhe
                        ),

                    danhSachMonAn:
                        Object.keys(cart).map(id => ({
                            maMon: Number(id),
                            soLuong: cart[id]
                        }))
                });

            console.log(
                "BOOKING:",
                bookingRes.data
            );

            const maHoaDon =
                bookingRes.data.data.hoaDon.maHoaDon;

            console.log(
                "Mã hóa đơn:",
                maHoaDon
            );

            // Lấy link VNPay
            const payRes =
                await paymentApi.createVNPay(
                    maHoaDon
                );

            console.log(
                "PAYMENT:",
                payRes.data
            );

            const paymentUrl =
                payRes.data.payment_url;

            if (!paymentUrl) {

                alert(
                    "Không nhận được link thanh toán VNPay"
                );

                return;
            }

            console.log(
                "Redirect:",
                paymentUrl
            );

            // Chuyển sang VNPay
            window.location.href =
                paymentUrl;

        } catch (error) {

            console.error(error);

            console.error(
                error.response?.data
            );

            alert(
                error.response?.data?.message
                ||
                "Có lỗi xảy ra"
            );
        }
    };

    return (
        <div className={s.container}>

            {/* LEFT */}
            <div className={s.left}>

                <h2>
                    Xác nhận thanh toán
                </h2>

                <div className={s.movieCard}>
                    <img
                        src={xuatChieu?.phim?.anhPoster}
                        alt=""
                    />

                    <div className={s.sectionInfo}>

                        <h3>
                            {xuatChieu?.phim?.tieuDe}
                        </h3>

                        <p className={s.movieType}>
                            2D Phụ đề
                        </p>

                        {/* THÔNG TIN RẠP */}
                        <div className={s.infoBlock}>
                            <h4>Thông tin rạp</h4>

                            <div className={s.infoText}>
                                <p>
                                    <b>Rạp:</b>{" "}
                                    {xuatChieu?.phong_chieu?.rap_chieu?.tenRap} - {" "}
                                </p>

                                <p>
                                    - {" "}<b>Phòng:</b>{" "}
                                    {xuatChieu?.phong_chieu?.tenPhong}
                                </p>
                            </div>
                        </div>

                        {/* SUẤT CHIẾU */}
                        <div className={s.infoBlock}>
                            <h4>Suất chiếu</h4>

                            <div className={s.infoText}>
                                <p>
                                    <b>{showDate?.toLocaleTimeString(
                                        "vi-VN",
                                        {
                                            timeZone: "Asia/Ho_Chi_Minh",
                                            hour: "2-digit",
                                            minute: "2-digit"
                                        }
                                    )}</b> - {" "}

                                </p>

                                <p>
                                    - {" "}<b>{showDate?.toLocaleDateString(
                                        "vi-VN",
                                        {
                                            timeZone: "Asia/Ho_Chi_Minh"
                                        }
                                    )}</b>{" "}

                                </p>
                            </div>
                        </div>

                        {/* GHẾ */}
                        <div className={s.infoBlock}>
                            <h4>Ghế đã chọn</h4>

                            <div className={s.ticketRow}>
                                <span>
                                    {selectedSeats
                                        .map(
                                            seat =>
                                                `${seat.hangGhe}${seat.soGhe}`
                                        )
                                        .join(", ")}
                                </span>

                                <span className={s.price}>
                                    {formatVND(seatPrice)}
                                </span>
                            </div>
                        </div>

                        {/* ĐỒ ĂN */}
                        <div className={s.infoBlock}>
                            <h4>Đồ ăn & thức uống</h4>

                            {Object.keys(cart).length === 0 ? (
                                <p className={s.infoText}>
                                    Không có
                                </p>
                            ) : (
                                foods
                                    .filter(
                                        food => cart[food.maMon]
                                    )
                                    .map(food => (
                                        <div
                                            key={food.maMon}
                                            className={s.foodRow}
                                        >
                                            <span>
                                                {food.tenMon} x
                                                {cart[food.maMon]}
                                            </span>

                                            <span className={s.price}>
                                                {formatVND(
                                                    cart[food.maMon] *
                                                    Number(food.gia)
                                                )}
                                            </span>
                                        </div>
                                    ))
                            )}
                        </div>

                    </div>
                </div>

            </div>

            {/* RIGHT */}
            <div className={s.right}>

                <div className={s.summary}>

                    <h3>
                        Thanh toán
                    </h3>

                    <div className={s.total}>
                        <span>
                            Tổng cộng
                        </span>

                        <b>
                            {
                                formatVND(
                                    total
                                )
                            }
                        </b>
                    </div>

                    <div className={s.payment}>

                        <label>
                            <input
                                type="radio"
                                checked={
                                    paymentMethod
                                    === "vnpay"
                                }
                                onChange={() =>
                                    setPaymentMethod(
                                        "vnpay"
                                    )
                                }
                            />
                            VNPay
                        </label>

                        <label>
                            <input
                                type="radio"
                                checked={
                                    paymentMethod
                                    === "momo"
                                }
                                onChange={() =>
                                    setPaymentMethod(
                                        "momo"
                                    )
                                }
                            />
                            MoMo
                        </label>

                    </div>

                    <button
                        type="button"
                        className={s.payBtn}
                        onClick={handlePayment}
                    >
                        Thanh toán ngay
                    </button>

                </div>

            </div>

        </div>
    );
};

export default Checkout;
