import styles from "./Home.module.css";
import {
    MdClose,
    MdSettings,
    MdDashboard,
    MdPeople,
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

const s = styles;

const Home = () => {
    return (
        <div className={s.container}>
            {/*aside section start */}
            <aside>
                <div className={s.top}>
                    <div className={s.logo}>
                        <h2>RACSO</h2>
                    </div>
                    <div className={s.close}>
                        <span><MdClose /></span>
                    </div>
                </div>

                {/* sidebar start */}
                <div className={s.sidebar}>
                    <a href="#">
                        <span><MdDashboard /></span>
                        <h3>Dashboard</h3>
                    </a>
                    <a href="#" className={s.active}>
                        <span><MdPeople /></span>
                        <h3>Custumers</h3>
                    </a>
                    <a href="#">
                        <span><MdAnalytics /></span>
                        <h3>Analytics</h3>
                    </a>
                    <a href="#">
                        <span><MdMessage /></span>
                        <h3>Messages</h3>
                        <span className={s.msg_count}>10</span>
                    </a>
                    <a href="#">
                        <span><MdShoppingCart /></span>
                        <h3>Products</h3>
                    </a>
                    <a href="#">
                        <span><MdReport /></span>
                        <h3>Reports</h3>
                    </a>
                    <a href="#">
                        <span><MdAddBox /></span>
                        <h3>Add products</h3>
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
                    <button id={s.menu_bar}>
                        <span><MdMenu /></span>
                    </button>
                    <div className={s.theme_toggler}>
                        <span className={s.active}><MdLightMode /></span>
                        <span><MdDarkMode /></span>
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