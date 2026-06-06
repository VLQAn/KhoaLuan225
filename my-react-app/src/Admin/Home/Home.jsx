import styles from "./Home.module.css";
import {
    MdClose,
    MdDashboard,
    MdMovie,
    MdAddBox,
    MdLogout,
    MdTrendingUp,
    MdLocalMall,
    MdStackedLineChart,
    MdMenu,
    MdLightMode,
    MdDarkMode,
    MdLocalOffer,
    MdHomeWork,
    MdConfirmationNumber,
    MdSchedule,
    MdFastfood
} from "react-icons/md";

import { useState, useEffect, useRef } from "react";
import { NavLink } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import dashboardApi from "../../services/dashboardApi";

const s = styles;

const Home = () => {
    const navigate = useNavigate();
    const [darkMode, setDarkMode] = useState(() => {
        return localStorage.getItem("darkMode") === "true";
    });
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [activeTab, setActiveTab] = useState("today");

    const [dashboard, setDashboard] = useState({
        raps: [],
        topMovies: [],
        topFoods: [],
        goldenShowtimes: []
    });

    const revenues = {
        today: {
            sales: "256",
            expenses: "19.080.000 VNĐ",
            income: "78%",
            label: "Last 24 Hours",
        },

        week: {
            sales: "1.730",
            expenses: "224.450.000 VNĐ",
            income: "89%",
            label: "Last 7 Days",
        },

        month: {
            sales: "580.000.000 VNĐ",
            expenses: "250.000.000 VNĐ",
            income: "330.000.000 VNĐ",
            label: "Last 30 Days",
        },

        year: {
            sales: "6.200.000.000 VNĐ",
            expenses: "3.100.000.000 VNĐ",
            income: "3.100.000.000 VNĐ",
            label: "Last 12 Months",
        }
    };

    const seatRows = ["J", "I", "H", "G", "F", "E", "D", "C", "B", "A"];

    const hotSeats = [
        "J3", "J4", "J5", "J6", "J7", "J8",
        "I3", "I4", "I5", "I6", "I7",
        "H3", "H4", "H5", "H6", "H7",
        "G5", "G6",
    ];

    const mediumSeats = [
        "H2",
        "G3", "G4", "G7", "G8",
        "F4", "F5", "F6",
        "E5", "E6",
        "D5",
    ];

    useEffect(() => {

        if (darkMode) {
            document.body.classList.add("dark_theme_variables");
        } else {
            document.body.classList.remove("dark_theme_variables");
        }

        localStorage.setItem("darkMode", darkMode);

    }, [darkMode]);

    useEffect(() => {

        const fetchDashboard =
            async () => {

                try {

                    const data =
                        await dashboardApi
                            .getDashboard();

                    console.log(data);

                    setDashboard(data);

                } catch (error) {

                    console.error(error);
                }
            };

        fetchDashboard();

    }, []);

    const currentRevenue = revenues[activeTab];
    const revenueDetailRef = useRef(null);
    const seatAnalyticsRef = useRef(null);

    const userData = localStorage.getItem("user");

    const user = userData
        ? JSON.parse(userData)
        : null;

    const handleLogout = () => {

        localStorage.removeItem("token");

        localStorage.removeItem("user");

        localStorage.removeItem("isLogin");

        navigate("/register");
    };

    return (
        <div className={s.container}>
            {/*aside section start */}
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
                    <a
                        href="#"
                        onClick={(e) => {

                            e.preventDefault();

                            handleLogout();
                        }}
                    >
                        <span><MdLogout /></span>
                        <h3>Logout</h3>
                    </a>

                </div>
                {/* sidebar end */}
            </aside>
            {/*aside section end */}
            {/* main section start */}
            <main>
                <h1>Bảng điều khiển</h1>

                {/* SUB NAV */}
                <div className={s.sub_nav}>
                    <div className={s.date}>
                        <input type="date" />
                    </div>

                    <button
                        className={
                            activeTab === "today"
                                ? s.active
                                : ""
                        }
                        onClick={() => setActiveTab("today")}
                    >
                        Hôm nay
                    </button>

                    <button
                        className={
                            activeTab === "week"
                                ? s.active
                                : ""
                        }
                        onClick={() => setActiveTab("week")}
                    >
                        Tuần này
                    </button>

                    <button
                        className={
                            activeTab === "month"
                                ? s.active
                                : ""
                        }
                        onClick={() => setActiveTab("month")}
                    >
                        Tháng này
                    </button>

                    <button
                        className={
                            activeTab === "year"
                                ? s.active
                                : ""
                        }
                        onClick={() => setActiveTab("year")}
                    >
                        Năm này
                    </button>

                </div>

                <div className={s.insights}>
                    {/* start selling */}
                    <div className={s.sales}>
                        <span><MdTrendingUp /></span>
                        <div className={s.middle}>
                            <div className={s.left}>
                                <h3>Tổng vé bán ra</h3>
                                <h1>
                                    {dashboard?.tongVeBan ?? 0}
                                </h1>
                            </div>

                            <div className={s.progress}>
                                <svg>
                                    <circle r="30" cy="40" cx="40"></circle>
                                </svg>
                                <div className={s.number}>80%</div>
                            </div>
                        </div>
                        <small>{currentRevenue.label}</small>
                    </div>
                    {/* end selling */}

                    {/* start expenses */}
                    <div className={s.expenses}
                        onClick={() =>
                            revenueDetailRef.current?.scrollIntoView({
                                behavior: "smooth",
                                block: "start",
                            })
                        }>
                        <span><MdLocalMall /></span>
                        <div className={s.middle}>
                            <div className={s.left}>
                                <h3>Tổng doanh thu</h3>
                                <h1>
                                    {Number(
                                        dashboard?.tongDoanhThu || 0
                                    ).toLocaleString("vi-VN")}
                                    {" "}VNĐ
                                </h1>
                            </div>

                            <div className={s.progress}>
                                <svg>
                                    <circle r="30" cy="40" cx="40"></circle>
                                </svg>
                                <div className={s.number}>80%</div>
                            </div>
                        </div>
                        <small>{currentRevenue.label}</small>
                    </div>
                    {/* end expenses */}

                    {/* start income */}
                    <div
                        className={s.income}
                        onClick={() =>
                            seatAnalyticsRef.current?.scrollIntoView({
                                behavior: "smooth",
                                block: "start",
                            })
                        }
                    >
                        <span><MdStackedLineChart /></span>
                        <div className={s.middle}>
                            <div className={s.left}>
                                <h3>Tỉ lệ lắp đầy ghế</h3>
                                <h1>
                                    {dashboard?.tiLeLapDay ?? 0}%
                                </h1>
                            </div>

                            <div className={s.progress}>
                                <svg>
                                    <circle r="30" cy="40" cx="40"></circle>
                                </svg>
                                <div className={s.number}>100%</div>
                            </div>
                        </div>
                        <small>{currentRevenue.label}</small>
                    </div>
                    {/* end income */}
                </div>

                {/* start recent order */}
                <div className={s.recent_order}>
                    <h1>Cụm rạp/ Chi nhánh</h1>
                    <table>
                        <thead>
                            <tr>
                                <th>Rạp</th>
                                <th>Vé bán</th>
                                <th>Doanh thu</th>
                                <th>Lấp đầy</th>
                            </tr>
                        </thead>
                        <tbody>

                            {dashboard?.raps?.map(
                                rap => (

                                    <tr key={rap.maRap}>

                                        <td>
                                            {rap.tenRap}
                                        </td>

                                        <td>
                                            {rap.veBan}
                                        </td>

                                        <td>
                                            {Number(
                                                rap.doanhThu
                                            ).toLocaleString("vi-VN")}
                                            VNĐ
                                        </td>

                                        <td
                                            className={s.primary}
                                        >
                                            {rap.lapDay}%
                                        </td>

                                    </tr>
                                )
                            )}

                        </tbody>
                    </table>
                </div>
                {/* end recent order */}

                {/* START REVENUE DETAIL */}
                <div className={s.revenue_detail} ref={revenueDetailRef}>
                    <div className={s.revenue_header}>
                        <h1>Thống kê doanh thu</h1>
                    </div>

                    <div className={s.revenue_content}>
                        {/* LEFT */}
                        <div className={s.revenue_chart_card}>
                            <h2>Tỷ lệ doanh thu</h2>

                            <div className={s.pie_chart}></div>

                            <div className={s.chart_legend}>
                                <div>
                                    <span className={s.ticket_dot}></span>
                                    Doanh thu vé - 82%
                                </div>

                                <div>
                                    <span className={s.food_dot}></span>
                                    Bắp nước - 18%
                                </div>
                            </div>

                            <div className={s.revenue_numbers}>
                                <div>
                                    <h3>Doanh thu vé</h3>
                                    <h2>475.000.000 VNĐ</h2>
                                </div>

                                <div>
                                    <h3>Doanh thu bắp nước</h3>
                                    <h2>105.000.000 VNĐ</h2>
                                </div>
                            </div>
                        </div>

                        {/* RIGHT */}
                        <div className={s.food_top_card}>
                            <h2>Top combo bán chạy</h2>

                            {dashboard?.topFoods?.map(food => (

                                <div
                                    key={food.maMon}
                                    className={s.combo_item}
                                >

                                    <div>
                                        <h3>{food.tenMon}</h3>

                                        <small>
                                            {food.tongBan} phần
                                        </small>
                                    </div>

                                    <span className={s.combo_img}>
                                        <img
                                            src={food.hinhAnh}
                                            alt={food.tenMon}
                                        />
                                    </span>

                                </div>

                            ))}
                        </div>
                    </div>
                </div>
                {/* END REVENUE DETAIL */}

                {/* START SEAT ANALYTICS */}

                <div className={s.seat_analytics} ref={seatAnalyticsRef}>
                    <div className={s.seat_header}>
                        <h1>Phân tích tỷ lệ lấp đầy ghế</h1>
                        <p>Khu vực màu đỏ là vị trí được đặt nhiều nhất</p>
                    </div>

                    <div className={s.cinema_layout}>
                        <div className={s.screen}>
                            SCREEN
                        </div>

                        <div className={s.seat_map}>
                            {seatRows.map((row) => (
                                <div key={row} className={s.seat_row}>
                                    <span className={s.row_label}>{row}</span>

                                    {[...Array(10)].map((_, index) => {
                                        const seatId = `${row}${index + 1}`;

                                        let seatClass = s.low;

                                        if (hotSeats.includes(seatId)) {
                                            seatClass = s.hot;
                                        } else if (mediumSeats.includes(seatId)) {
                                            seatClass = s.medium;
                                        }

                                        return (
                                            <div
                                                key={seatId}
                                                className={`${s.seat_box} ${seatClass}`}
                                            >
                                                {index + 1}
                                            </div>
                                        );
                                    })}
                                </div>
                            ))}
                        </div>

                        <div className={s.seat_legend}>
                            <div>
                                <span className={`${s.legend_box} ${s.hot}`}></span>
                                Đặt nhiều
                            </div>

                            <div>
                                <span className={`${s.legend_box} ${s.medium}`}></span>
                                Trung bình
                            </div>

                            <div>
                                <span className={`${s.legend_box} ${s.low}`}></span>
                                Ít đặt
                            </div>
                        </div>
                    </div>
                </div>

                {/* END SEAT ANALYTICS */}
            </main>
            {/* main section end */}
            {/* right section start */}
            <div className={s.right}>
                <div className={s.top}>
                    <button className={s.menu_bar} onClick={() => setIsSidebarOpen(true)}>
                        <span><MdMenu /></span>
                    </button>
                    <div className={s.theme_toggler} onClick={() => setDarkMode(!darkMode)}>
                        <span className={!darkMode ? s.active : ""}><MdLightMode /></span>
                        <span className={darkMode ? s.active : ""}><MdDarkMode /></span>
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

                {/* Start recent update */}
                <div className={s.recent_updates}>
                    <h2>Top phim</h2>

                    <div className={s.updates}>

                        {dashboard?.topMovies?.map(movie => (

                            <div
                                key={movie.maPhim}
                                className={s.update}
                            >

                                <div className={s.profile_photo}>
                                    <img
                                        src={movie.anhPoster}
                                        alt={movie.tieuDe}
                                    />
                                </div>

                                <div className={s.message}>
                                    <p>
                                        <b>{movie.tieuDe}</b>
                                    </p>

                                    <small>
                                        {movie.tongVe} vé
                                    </small>
                                </div>

                            </div>

                        ))}

                    </div>
                </div>
                {/* End recent update */}

                {/* Start sale analytic */}
                <div className={s.sales_analytics}>
                    <h2>Xuất chiếu vàng</h2>

                    <div className={s.item + " " + s.onlion}>
                        <div className={s.icon}>
                            <span><MdDarkMode /></span>
                        </div>
                        <div className={s.right_text}>
                            <div className={s.info}>
                                <h3>Xuất</h3>
                                <h4 className={s.danger}>19:30</h4>
                            </div>
                            <h3>Tỷ lệ kín ghế</h3>
                            <h4 className={s.danger}>97%</h4>
                        </div>
                    </div>

                    <div className={s.item + " " + s.onlion}>
                        <div className={s.icon}>
                            <span><MdDarkMode /></span>
                        </div>
                        <div className={s.right_text}>
                            <div className={s.info}>
                                <h3>Xuất</h3>
                                <h4 className={s.danger}>22:00</h4>
                            </div>
                            <h3>Tỷ lệ kín ghế</h3>
                            <h4 className={s.danger}>70%</h4>
                        </div>
                    </div>

                    <div className={s.item + " " + s.onlion}>
                        <div className={s.icon}>
                            <span><MdLightMode /></span>
                        </div>
                        <div className={s.right_text}>
                            <div className={s.info}>
                                <h3>Xuất</h3>
                                <h4 className={s.danger}>9:00</h4>
                            </div>
                            <h3>Tỷ lệ kín ghế</h3>
                            <h4 className={s.danger}>22%</h4>
                        </div>
                    </div>
                </div>
                {/* End sale analytic */}
            </div>
            {/* end right section */}

        </div>
    );
}

export default Home;