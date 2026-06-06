import styles from "./BookingManager.module.css";
import bookingApi from "../../services/bookingApi";
import {
    MdClose,
    MdDashboard,
    MdMovie,
    MdHomeWork,
    MdConfirmationNumber,
    MdSchedule,
    MdFastfood,
    MdLocalOffer,
    MdLogout,
    MdMenu,
    MdLightMode,
    MdDarkMode,
} from "react-icons/md";

import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";

const s = styles;

const BookingManager = () => {

    const [darkMode, setDarkMode] = useState(() => {
        return localStorage.getItem("darkMode") === "true";
    });

    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const [activeTab, setActiveTab] = useState("paying");

    const [expandedId, setExpandedId] = useState(null);

    const [bookings, setBookings] = useState([]);

    useEffect(() => {

        if (darkMode) {
            document.body.classList.add("dark_theme_variables");
        } else {
            document.body.classList.remove("dark_theme_variables");
        }

        localStorage.setItem("darkMode", darkMode);

    }, [darkMode]);

    useEffect(() => {

        fetchBookings();

    }, []);

    const fetchBookings = async () => {

        try {

            const response =
                await bookingApi.getAllBookings();

            console.log(response.data.data);

            setBookings(
                response.data.data
            );

        } catch (error) {

            console.error(error);

        }
    };

    const filteredBookings = bookings.filter(
        booking => booking.status === activeTab
    );

    const userData = localStorage.getItem("user");

    const payingCount =
        bookings.filter(
            b => b.status === "paying"
        ).length;

    const paidCount =
        bookings.filter(
            b => b.status === "paid"
        ).length;

    const cancelledCount =
        bookings.filter(
            b => b.status === "cancelled"
        ).length;

    const user = userData
        ? JSON.parse(userData)
        : null;

    return (

        <div className={s.container}>

            {/* SIDEBAR */}
            <aside className={`${s.aside} ${isSidebarOpen ? s.open : ""}`}>
                <div className={s.top}>
                    <div className={s.logo}>
                        <h2>RACSO</h2>
                    </div>
                    <div className={s.close} onClick={() => setIsSidebarOpen(false)}>
                        <span><MdClose /></span>
                    </div>
                </div>

                {/* sidebar start */}
                <div className={s.sidebar}>
                    <NavLink
                        to="/admin/home"
                        className={({ isActive }) => isActive ? s.active : ""}
                    >
                        <span><MdDashboard /></span>
                        <h3>Doanh thu</h3>
                    </NavLink>
                    <NavLink
                        to="/admin/movie-manager"
                        className={({ isActive }) => isActive ? s.active : ""}
                    >
                        <span><MdMovie /></span>
                        <h3>Cập nhật phim</h3>
                    </NavLink>
                    <NavLink
                        to="/admin/theater-manager"
                        className={({ isActive }) => isActive ? s.active : ""}
                    >
                        <span><MdHomeWork /></span>
                        <h3>Cập nhật rạp chiếu</h3>
                    </NavLink>
                    <NavLink
                        to="/admin/booking-manager"
                        className={({ isActive }) => isActive ? s.active : ""}
                    >
                        <span><MdConfirmationNumber /></span>
                        <h3>Đơn đặt vé</h3>
                    </NavLink>
                    <NavLink
                        to="/admin/showtime-manager"
                        className={({ isActive }) => isActive ? s.active : ""}
                    >
                        <span><MdSchedule /></span>
                        <h3>Cập nhật xuất chiếu</h3>
                    </NavLink>
                    <NavLink
                        to="/admin/food-manager"
                        className={({ isActive }) => isActive ? s.active : ""}
                    >
                        <span><MdFastfood /></span>
                        <h3>Bắp nước</h3>
                    </NavLink>
                    <NavLink
                        to="/admin/promotion-manager"
                        className={({ isActive }) => isActive ? s.active : ""}
                    >
                        <span><MdLocalOffer /></span>
                        <h3>Khuyến mãi</h3>
                    </NavLink>
                    <a href="#">
                        <span><MdLogout /></span>
                        <h3>Logout</h3>
                    </a>

                </div>
                {/* sidebar end */}
            </aside>

            {/* MAIN */}
            <main>

                {/* HEADER */}
                <div className={s.header}>

                    <h1>Đơn đặt vé</h1>

                </div>

                {/* SUB NAV */}
                <div className={s.sub_nav}>

                    <button
                        className={
                            activeTab === "paying"
                                ? s.active
                                : ""
                        }
                        onClick={() => setActiveTab("paying")}
                    >
                        Đang thanh toán
                    </button>

                    <button
                        className={
                            activeTab === "paid"
                                ? s.active
                                : ""
                        }
                        onClick={() => setActiveTab("paid")}
                    >
                        Đã thanh toán
                    </button>

                    <button
                        className={
                            activeTab === "cancelled"
                                ? s.active
                                : ""
                        }
                        onClick={() => setActiveTab("cancelled")}
                    >
                        Đã hủy
                    </button>

                </div>

                {/* BOOKING LIST */}
                <div className={s.booking_container}>

                    {
                        filteredBookings.map((booking) => (

                            <div
                                className={s.booking_card}
                                key={booking.id}
                            >

                                {/* TOP */}
                                <div
                                    className={s.booking_top}
                                    onClick={() =>
                                        setExpandedId(
                                            expandedId === booking.id
                                                ? null
                                                : booking.id
                                        )
                                    }
                                >

                                    <div className={s.booking_info}>

                                        <h2>{booking.movie}</h2>

                                        <p>
                                            <MdLocationOn />
                                            {booking.theater}
                                        </p>

                                        <p>
                                            <MdChair />
                                            {booking.seats.length} vé
                                        </p>

                                        <p>
                                            <MdAccessTime />
                                            {booking.showtime}
                                        </p>

                                    </div>

                                    <div className={s.expand_icon}>

                                        {
                                            expandedId === booking.id
                                                ? <MdKeyboardArrowUp />
                                                : <MdKeyboardArrowDown />
                                        }

                                    </div>

                                </div>

                                {/* DETAIL */}
                                {
                                    expandedId === booking.id && (

                                        <div className={s.detail_container}>

                                            <div className={s.detail_item}>
                                                <MdLocalMovies />
                                                <div>
                                                    <h4>Tên phim</h4>
                                                    <p>{booking.movie}</p>
                                                </div>
                                            </div>

                                            <div className={s.detail_item}>
                                                <MdChair />
                                                <div>
                                                    <h4>Số ghế</h4>
                                                    <p>
                                                        {booking.seats.join(", ")}
                                                    </p>
                                                    <span>
                                                        {Number(
                                                            booking.ticketPrice
                                                        ).toLocaleString()} VNĐ
                                                    </span>
                                                </div>
                                            </div>

                                            <div className={s.detail_item}>
                                                <MdLocationOn />
                                                <div>
                                                    <h4>Rạp chiếu</h4>
                                                    <p>{booking.theater}</p>
                                                </div>
                                            </div>

                                            <div className={s.detail_item}>
                                                <MdLocationOn />
                                                <div>
                                                    <h4>Địa chỉ</h4>
                                                    <p>{booking.address}</p>
                                                </div>
                                            </div>

                                            <div className={s.detail_item}>
                                                <MdMovie />
                                                <div>
                                                    <h4>Phòng chiếu</h4>
                                                    <p>{booking.room}</p>
                                                </div>
                                            </div>

                                            <div className={s.detail_item}>
                                                <MdAccessTime />
                                                <div>
                                                    <h4>Xuất chiếu</h4>
                                                    <p>{booking.showtime}</p>
                                                </div>
                                            </div>

                                            <div className={s.detail_item}>
                                                <MdCombo />
                                                <div>
                                                    <h4>Bắp nước</h4>
                                                    <p>{booking.food}</p>

                                                    <span>
                                                        {Number(
                                                            booking.foodPrice
                                                        ).toLocaleString()} VNĐ
                                                    </span>
                                                </div>
                                            </div>

                                            <div className={s.detail_item}>
                                                <MdPayments />
                                                <div>
                                                    <h4>Tổng tiền</h4>

                                                    <p>
                                                        {Number(
                                                            booking.totalPrice
                                                        ).toLocaleString()} VNĐ
                                                    </p>
                                                </div>
                                            </div>

                                            <div className={s.detail_item}>
                                                <MdDiscount />
                                                <div>
                                                    <h4>Mã giảm giá</h4>
                                                    <p>
                                                        {
                                                            booking.promotionCode
                                                            || "Không áp dụng"
                                                        }
                                                    </p>

                                                    <span>
                                                        {
                                                            booking.promotionPercent
                                                                ? `-${booking.promotionPercent}%`
                                                                : "0%"
                                                        }
                                                    </span>
                                                </div>
                                            </div>

                                            <div className={s.total_box}>
                                                Tổng thanh toán:
                                                <span>
                                                    {
                                                        Number(
                                                            booking.totalPayment
                                                        )
                                                            .toLocaleString()
                                                    } VNĐ
                                                </span>
                                            </div>

                                        </div>

                                    )
                                }

                            </div>

                        ))
                    }

                </div>

            </main>

            {/* RIGHT */}
            <div className={s.right}>

                <div className={s.top}>
                    <button
                        className={s.menu_bar}
                        onClick={() => setIsSidebarOpen(true)}
                    >
                        <MdMenu />
                    </button>

                    <div
                        className={s.theme_toggler}
                        onClick={() => setDarkMode(!darkMode)}
                    >
                        <span className={!darkMode ? s.active : ""}>
                            <MdLightMode />
                        </span>

                        <span className={darkMode ? s.active : ""}>
                            <MdDarkMode />
                        </span>
                    </div>
                    <div className={s.profile}>
                        <div className={s.info}>

                            <p>
                                <b>
                                    {user?.tenNguoiDung || "Admin"}
                                </b>
                            </p>

                            <p>
                                {user?.vaiTro?.tenVaiTro || "Admin"}
                            </p>

                            <small className={s.text_muted}></small>
                        </div>

                        <div className={s.profile_photo}>
                            <img
                                src={
                                    user?.anhDaiDien ||
                                    "/icon.jpg"
                                }
                                alt=""
                            />
                        </div>
                    </div>
                </div>

                <div className={s.right_card}>

                    <h2>Thống kê đơn vé</h2>

                    <div className={s.info_item}>
                        <p>Đang thanh toán</p>
                        <h3>{payingCount}</h3>
                    </div>

                    <div className={s.info_item}>
                        <p>Đã xác nhận</p>
                        <h3>{paidCount}</h3>
                    </div>

                    <div className={s.info_item}>
                        <p>Đã hủy</p>
                        <h3>{cancelledCount}</h3>
                    </div>

                </div>

            </div>

        </div>

    );
};

export default BookingManager;