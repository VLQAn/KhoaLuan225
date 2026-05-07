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


    useEffect(() => {

        if (darkMode) {
            document.body.classList.add("dark_theme_variables");
        } else {
            document.body.classList.remove("dark_theme_variables");
        }

        localStorage.setItem("darkMode", darkMode);

    }, [darkMode]);

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
                        <h3>Bảng điều khiển</h3>
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
                    <a href="#">
                        <span><MdMessage /></span>
                        <h3>Đơn đặt vé</h3>
                        <span className={s.msg_count}>10</span>
                    </a>
                    <NavLink
                        to="/admin/showtime-manager"
                        className={({ isActive }) => isActive ? s.active : ""}
                    >
                        <span><MdShoppingCart /></span>
                        <h3>Cập nhật xuất chiếu</h3>
                    </NavLink>

                    <a href="#">
                        <span><MdReport /></span>
                        <h3>Thống kê</h3>
                    </a>
                    <a href="#">
                        <span><MdAddBox /></span>
                        <h3>Thực đơn</h3>
                    </a>
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
                <h1>Dashboard</h1>

                <div className={s.date}>
                    <input type="date" />
                </div>

                <div className={s.insights}>
                    {/* start selling */}
                    <div className={s.sales}>
                        <span><MdTrendingUp /></span>
                        <div className={s.middle}>
                            <div className={s.left}>
                                <h3>Total Sales</h3>
                                <h1>23.565.000 VNĐ</h1>
                            </div>

                            <div className={s.progress}>
                                <svg>
                                    <circle r="30" cy="40" cx="40"></circle>
                                </svg>
                                <div className={s.number}>80%</div>
                            </div>
                        </div>
                        <small>Last 24 Hours</small>
                    </div>
                    {/* end selling */}

                    {/* start expenses */}
                    <div className={s.expenses}>
                        <span><MdLocalMall /></span>
                        <div className={s.middle}>
                            <div className={s.left}>
                                <h3>Expenses</h3>
                                <h1>13.890.000 VNĐ</h1>
                            </div>

                            <div className={s.progress}>
                                <svg>
                                    <circle r="30" cy="40" cx="40"></circle>
                                </svg>
                                <div className={s.number}>80%</div>
                            </div>
                        </div>
                        <small>Last 24 Hours</small>
                    </div>
                    {/* end expenses */}

                    {/* start income */}
                    <div className={s.income}>
                        <span><MdStackedLineChart /></span>
                        <div className={s.middle}>
                            <div className={s.left}>
                                <h3>Income</h3>
                                <h1>9.450.000 VNĐ</h1>
                            </div>

                            <div className={s.progress}>
                                <svg>
                                    <circle r="30" cy="40" cx="40"></circle>
                                </svg>
                                <div className={s.number}>100%</div>
                            </div>
                        </div>
                        <small>Last 24 Hours</small>
                    </div>
                    {/* end income */}
                </div>

                {/* start recent order */}
                <div className={s.recent_order}>
                    <h1>Recent Orders</h1>
                    <table>
                        <thead>
                            <tr>
                                <th>Procuct Name</th>
                                <th>Procuct Number</th>
                                <th>Payments</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>Mini USB</td>
                                <td>10</td>
                                <td>Due</td>
                                <td className={s.warning}>Pending</td>
                                <td className={s.primary}>Details</td>
                            </tr>

                            <tr>
                                <td>Mini USB</td>
                                <td>10</td>
                                <td>Due</td>
                                <td className={s.warning}>Pending</td>
                                <td className={s.primary}>Details</td>
                            </tr>

                            <tr>
                                <td>Mini USB</td>
                                <td>10</td>
                                <td>Due</td>
                                <td className={s.warning}>Pending</td>
                                <td className={s.primary}>Details</td>
                            </tr>

                            <tr>
                                <td>Mini USB</td>
                                <td>10</td>
                                <td>Due</td>
                                <td className={s.warning}>Pending</td>
                                <td className={s.primary}>Details</td>
                            </tr>

                            <tr>
                                <td>Mini USB</td>
                                <td>10</td>
                                <td>Due</td>
                                <td className={s.warning}>Pending</td>
                                <td className={s.primary}>Details</td>
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
                    <h2>Recent Update</h2>
                    <div className={s.updates}>
                        <div className={s.update}>
                            <div className={s.profile_photo}>
                                <img src="/galaxy_2.jpg" alt="" />
                            </div>
                            <div className={s.message}>
                                <p><b>Babar</b> Recived his order</p>
                            </div>
                        </div>
                        <div className={s.update}>
                            <div className={s.profile_photo}>
                                <img src="/galaxy_2.jpg" alt="" />
                            </div>
                            <div className={s.message}>
                                <p><b>Babar</b> Recived his order</p>
                            </div>
                        </div>
                        <div className={s.update}>
                            <div className={s.profile_photo}>
                                <img src="/galaxy_2.jpg" alt="" />
                            </div>
                            <div className={s.message}>
                                <p><b>Babar</b> Recived his order</p>
                            </div>
                        </div>
                    </div>
                </div>
                {/* End recent update */}

                {/* Start sale analytic */}
                <div className={s.sales_analytics}>
                    <h2>Sales Analytics</h2>

                    <div className={s.item + " " + s.onlion}>
                        <div className={s.icon}>
                            <span><MdShoppingCart /></span>
                        </div>
                        <div className={s.right_text}>
                            <div className={s.info}>
                                <h3>Onlion orders</h3>
                                <small className={s.text_muted}>Last seen 2 Hours</small>
                            </div>
                            <h5 className={s.danger}>-17%</h5>
                            <h3>3849</h3>
                        </div>
                    </div>

                    <div className={s.item + " " + s.onlion}>
                        <div className={s.icon}>
                            <span><MdShoppingCart /></span>
                        </div>
                        <div className={s.right_text}>
                            <div className={s.info}>
                                <h3>Onlion orders</h3>
                                <small className={s.text_muted}>Last seen 2 Hours</small>
                            </div>
                            <h5 className={s.danger}>-17%</h5>
                            <h3>3849</h3>
                        </div>
                    </div>

                    <div className={s.item + " " + s.onlion}>
                        <div className={s.icon}>
                            <span><MdShoppingCart /></span>
                        </div>
                        <div className={s.right_text}>
                            <div className={s.info}>
                                <h3>Onlion orders</h3>
                                <small className={s.text_muted}>Last seen 2 Hours</small>
                            </div>
                            <h5 className={s.danger}>-17%</h5>
                            <h3>3849</h3>
                        </div>
                    </div>
                </div>
                {/* End sale analytic */}

                <div className={s.item + " " + s.add_products}>
                    <div>
                        <span><MdAdd /></span>
                    </div>
                </div>
            </div>
            {/* end right section */}

        </div>
    );
}

export default Home;