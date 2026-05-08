import styles from "./Home.module.css";
import {
    MdClose,
    MdSettings,
    MdDashboard,
    MdMovie,
    MdMovieCreation,
    MdOndemandVideo,
    MdLiveTv,
    MdTheaters,
    MdAnalytics,
    MdMessage,
    MdShoppingCart,
    MdAddBox,
    MdLogout,
    MdReport,
    MdTrendingUp,
    MdLocalMall,
    MdStackedLineChart,
    MdMenu,
    MdLightMode,
    MdDarkMode,
    MdAdd,
} from "react-icons/md";

import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";

const s = styles;

const Home = () => {
    const [darkMode, setDarkMode] = useState(() => {
        return localStorage.getItem("darkMode") === "true";
    });
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [activeTab, setActiveTab] = useState("today");

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

    useEffect(() => {

        if (darkMode) {
            document.body.classList.add("dark_theme_variables");
        } else {
            document.body.classList.remove("dark_theme_variables");
        }

        localStorage.setItem("darkMode", darkMode);

    }, [darkMode]);

    const currentRevenue = revenues[activeTab];

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
            {/*aside section end */}
            {/* main section start */}
            <main>
                <h1>Doanh thu</h1>

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
                                <h1>{currentRevenue.sales}</h1>
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
                    <div className={s.expenses}>
                        <span><MdLocalMall /></span>
                        <div className={s.middle}>
                            <div className={s.left}>
                                <h3>Tổng doanh thu</h3>
                                <h1>{currentRevenue.expenses}</h1>
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
                    <div className={s.income}>
                        <span><MdStackedLineChart /></span>
                        <div className={s.middle}>
                            <div className={s.left}>
                                <h3>Tỉ lệ lắp đầy ghế</h3>
                                <h1>{currentRevenue.income}</h1>
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
                            <tr>
                                <td>Galaxy Vĩnh Trung</td>
                                <td>430</td>
                                <td>120Tr</td>
                                <td className={s.primary}>80%</td>
                            </tr>

                            <tr>
                                <td>Galaxy Thanh Khê</td>
                                <td>310</td>
                                <td>88Tr</td>
                                <td className={s.primary}>71%</td>
                            </tr>

                            <tr>
                                <td>Galaxy Hải Châu</td>
                                <td>510</td>
                                <td>145Tr</td>
                                <td className={s.primary}>92%</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                {/* end recent order */}
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
                            <p><b>Babar</b></p>
                            <p>Admin</p>
                            <small className={s.text_muted}></small>
                        </div>
                        <div className={s.profile_photo}>
                            <img src="/galaxy.jpg" alt="" />
                        </div>
                    </div>
                </div>

                {/* Start recent update */}
                <div className={s.recent_updates}>
                    <h2>Top phim</h2>
                    <div className={s.updates}>
                        <div className={s.update}>
                            <div className={s.profile_photo}>
                                <img src="https://i.pinimg.com/1200x/1a/74/70/1a7470b2ef79024725d3319ffc09f2c0.jpg" alt="top1" />
                            </div>
                            <div className={s.message}>
                                <p><b>Avengers Endgame</b>6.589 vé</p>
                            </div>
                        </div>
                        <div className={s.update}>
                            <div className={s.profile_photo}>
                                <img src="https://i.pinimg.com/736x/7e/2c/48/7e2c48b7fc699cf06d44fd422534f99f.jpg" alt="top2" />
                            </div>
                            <div className={s.message}>
                                <p><b>Zoo Topia 2</b> 6.235 vé</p>
                            </div>
                        </div>
                        <div className={s.update}>
                            <div className={s.profile_photo}>
                                <img src="https://i.pinimg.com/736x/bb/d9/a9/bbd9a910ee5386927c2ee1e8e4ddaa34.jpg" alt="top3" />
                            </div>
                            <div className={s.message}>
                                <p><b>Mưa đỏ</b> 5.626 vé</p>
                            </div>
                        </div>
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