import styles from "./BookingManager.module.css";

import {
    MdClose,
    MdDashboard,
    MdMovie,
    MdAnalytics,
    MdFastfood,
    MdMenu,
    MdLightMode,
    MdDarkMode,
    MdLogout,
    MdConfirmationNumber,
    MdCheckCircle,
    MdCancel,
    MdAccessTime,
    MdLocationOn,
    MdChair,
    MdLocalMovies,
    MdFastfood as MdCombo,
    MdPayments,
    MdDiscount,
    MdToggleOn,
    MdToggleOff,
    MdKeyboardArrowDown,
    MdKeyboardArrowUp,
    MdMessage,
    MdShoppingCart,
    MdReport,
    MdAddBox,

} from "react-icons/md";

import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";

const s = styles;

const BookingManager = () => {

    const [darkMode, setDarkMode] = useState(() => {
        return localStorage.getItem("darkMode") === "true";
    });

    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const [autoApprove, setAutoApprove] = useState(true);

    const [activeTab, setActiveTab] = useState("pending");

    const [expandedId, setExpandedId] = useState(null);

    const bookings = [
        {
            id: 1,
            movie: "Avengers: Endgame",
            theater: "CGV Vincom",
            address: "Vincom Plaza Kon Tum",
            room: "Phòng 1",
            showtime: "19:30 - 10/05/2026",
            seats: ["A1", "A2"],
            food: "Combo Couple",
            total: "180000",
            discount: "20FREEMOVIE",
            payment: "Momo",
            status: "pending",
        },
        {
            id: 2,
            movie: "Batman",
            theater: "Galaxy Cinema",
            address: "Nguyễn Huệ, TP.HCM",
            room: "Phòng VIP",
            showtime: "21:00 - 11/05/2026",
            seats: ["B5", "B6", "B7"],
            food: "",
            total: "450000",
            discount: "",
            payment: "ZaloPay",
            status: "confirmed",
        },
        {
            id: 3,
            movie: "Spider Man",
            theater: "Lotte Cinema",
            address: "Đà Nẵng",
            room: "Phòng 3",
            showtime: "18:00 - 12/05/2026",
            seats: ["C1"],
            food: "Pepsi + Popcorn",
            total: "180000",
            discount: "SPIDER50",
            payment: "Tiền mặt",
            status: "cancelled",
        }
    ];

    useEffect(() => {

        if (darkMode) {
            document.body.classList.add("dark_theme_variables");
        } else {
            document.body.classList.remove("dark_theme_variables");
        }

        localStorage.setItem("darkMode", darkMode);

    }, [darkMode]);

    const filteredBookings = bookings.filter(
        (booking) => booking.status === activeTab
    );

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
                        <span><MdAnalytics /></span>
                        <h3>Cập nhật rạp chiếu</h3>
                    </NavLink>
                    <NavLink
                        to="/admin/booking-manager"
                        className={({ isActive }) => isActive ? s.active : ""}
                    >
                        <span><MdMessage /></span>
                        <h3>Đơn đặt vé</h3>
                        <span className={s.msg_count}>10</span>
                    </NavLink>
                    <NavLink
                        to="/admin/showtime-manager"
                        className={({ isActive }) => isActive ? s.active : ""}
                    >
                        <span><MdShoppingCart /></span>
                        <h3>Cập nhật xuất chiếu</h3>
                    </NavLink>
                    <NavLink
                        to="/admin/food-manager"
                        className={({ isActive }) => isActive ? s.active : ""}
                    >
                        <span><MdAddBox /></span>
                        <h3>Bắp nước</h3>
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

                    <h1>Xác nhận đơn đặt vé</h1>

                </div>

                {/* SUB NAV */}
                <div className={s.sub_nav}>

                    <button
                        className={
                            activeTab === "pending"
                                ? s.active
                                : ""
                        }
                        onClick={() => setActiveTab("pending")}
                    >
                        Chờ xác nhận
                    </button>

                    <button
                        className={
                            activeTab === "confirmed"
                                ? s.active
                                : ""
                        }
                        onClick={() => setActiveTab("confirmed")}
                    >
                        Đã xác nhận
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

                {
                    activeTab === "pending" && (
                        <div
                            className={s.auto_toggle}
                            onClick={() => setAutoApprove(!autoApprove)}
                        >

                            {
                                autoApprove
                                    ? <MdToggleOn />
                                    : <MdToggleOff />
                            }

                            <span>
                                {
                                    autoApprove
                                        ? "Duyệt tự động"
                                        : "Duyệt thủ công"
                                }
                            </span>

                        </div>)
                }

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
                                                    <span>110.000 VNĐ</span>
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
                                                    <p>
                                                        {
                                                            booking.food
                                                                ? booking.food
                                                                : "Không có"
                                                        }
                                                    </p>
                                                    <span>90.000 VNĐ</span>
                                                </div>
                                            </div>

                                            <div className={s.detail_item}>
                                                <MdPayments />
                                                <div>
                                                    <h4>Thanh toán</h4>
                                                    <p>{booking.payment}</p>
                                                    <span>200.000 VNĐ</span>
                                                </div>
                                            </div>

                                            <div className={s.detail_item}>
                                                <MdDiscount />
                                                <div>
                                                    <h4>Mã giảm giá</h4>
                                                    <p>
                                                        {
                                                            booking.discount
                                                                ? booking.discount
                                                                : "Không áp dụng"
                                                        }
                                                    </p>
                                                    <span>-20%</span>
                                                </div>
                                            </div>

                                            <div className={s.total_box}>
                                                Tổng giá:
                                                <span>
                                                    {
                                                        Number(booking.total)
                                                            .toLocaleString()
                                                    } VNĐ
                                                </span>
                                            </div>

                                            {
                                                activeTab === "pending" && (

                                                    <div className={s.action_buttons}>

                                                        <button className={s.confirm_btn}>
                                                            <MdCheckCircle />
                                                            Xác nhận
                                                        </button>

                                                        <button className={s.cancel_btn}>
                                                            <MdCancel />
                                                            Hủy đơn
                                                        </button>

                                                    </div>

                                                )
                                            }

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
                            <p><b>Babar</b></p>
                            <p>Admin</p>
                            <small className={s.text_muted}></small>
                        </div>
                        <div className={s.profile_photo}>
                            <img src="/galaxy.jpg" alt="" />
                        </div>
                    </div>
                </div>

                <div className={s.right_card}>

                    <h2>Thống kê đơn vé</h2>

                    <div className={s.info_item}>
                        <p>Chờ xác nhận</p>
                        <h3>12</h3>
                    </div>

                    <div className={s.info_item}>
                        <p>Đã xác nhận</p>
                        <h3>48</h3>
                    </div>

                    <div className={s.info_item}>
                        <p>Đã hủy</p>
                        <h3>6</h3>
                    </div>

                </div>

            </div>

        </div>

    );
};

export default BookingManager;