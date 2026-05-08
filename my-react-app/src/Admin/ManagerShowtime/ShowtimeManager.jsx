import styles from "./ShowtimeManager.module.css";

import {
    MdClose,
    MdDashboard,
    MdMovie,
    MdAnalytics,
    MdMessage,
    MdShoppingCart,
    MdAddBox,
    MdLogout,
    MdMenu,
    MdLightMode,
    MdDarkMode,
    MdEdit,
    MdDelete,
    MdSave,
    MdAdd,
    MdAccessTime,
    MdTheaters,
    MdEventSeat,
    MdMovieCreation,
    MdReport,
} from "react-icons/md";

import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";

const s = styles;

const ShowtimeManager = () => {
    const [darkMode, setDarkMode] = useState(() => {
        return localStorage.getItem("darkMode") === "true";
    });
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const [showtimes, setShowtimes] = useState([
        {
            id: 1,
            movie: "Avengers: Endgame",
            theater: "Galaxy Nguyễn Du",
            room: "Phòng 1",
            startTime: "18:30",
            date: "2026-05-08",
            format: "IMAX"
        }
    ]);

    const [formData, setFormData] = useState({
        movie: "",
        theater: "",
        room: "",
        startTime: "",
        date: "",
        format: "",
    });

    const [editingId, setEditingId] = useState(null);

    useEffect(() => {

        if (darkMode) {
            document.body.classList.add("dark_theme_variables");
        } else {
            document.body.classList.remove("dark_theme_variables");
        }

        localStorage.setItem("darkMode", darkMode);

    }, [darkMode]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const resetForm = () => {
        setFormData({
            movie: "",
            theater: "",
            room: "",
            startTime: "",
            date: "",
            format: "",
        });
    };

    const handleSubmit = () => {

        if (editingId) {

            setShowtimes(
                showtimes.map((showtime) =>
                    showtime.id === editingId
                        ? { ...formData, id: editingId }
                        : showtime
                )
            );

            setEditingId(null);

        } else {

            setShowtimes([
                ...showtimes,
                {
                    ...formData,
                    id: Date.now(),
                }
            ]);
        }

        resetForm();
    };

    const handleEdit = (showtime) => {
        setEditingId(showtime.id);
        setFormData(showtime);
    };

    const handleDelete = (id) => {
        setShowtimes(
            showtimes.filter((showtime) => showtime.id !== id)
        );
    };

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
                <div className={s.header}>
                    <h1>Quản lý xuất chiếu</h1>

                    <button className={s.addBtn}>
                        <MdAdd />
                        Thêm xuất chiếu
                    </button>
                </div>

                {/* FORM */}
                <div className={s.form_container}>

                    <div className={s.form_group}>
                        <label>Phim</label>

                        <div className={s.input_box}>
                            <span><MdMovieCreation /></span>

                            <select
                                name="movie"
                                value={formData.movie}
                                onChange={handleChange}
                            >
                                <option value="">Chọn phim</option>
                                <option>Avengers: Endgame</option>
                                <option>Spider Man</option>
                                <option>Batman</option>
                            </select>
                        </div>
                    </div>

                    <div className={s.form_group}>
                        <label>Rạp chiếu</label>

                        <div className={s.input_box}>
                            <span><MdTheaters /></span>

                            <select
                                name="theater"
                                value={formData.theater}
                                onChange={handleChange}
                            >
                                <option value="">Chọn rạp</option>
                                <option>Galaxy Nguyễn Du</option>
                                <option>Lotte Cinema</option>
                                <option>CGV Vincom</option>
                            </select>
                        </div>
                    </div>

                    <div className={s.form_group}>
                        <label>Phòng chiếu</label>

                        <div className={s.input_box}>
                            <span><MdEventSeat /></span>

                            <select
                                name="room"
                                value={formData.room}
                                onChange={handleChange}
                            >
                                <option value="">Chọn phòng</option>
                                <option>Phòng 1</option>
                                <option>Phòng 2</option>
                                <option>Phòng VIP</option>
                            </select>
                        </div>
                    </div>

                    <div className={s.form_group}>
                        <label>Định dạng</label>

                        <div className={s.input_box}>
                            <span><MdMovie /></span>

                            <select
                                name="format"
                                value={formData.format}
                                onChange={handleChange}
                            >
                                <option value="">Chọn định dạng</option>
                                <option>2D</option>
                                <option>3D</option>
                                <option>IMAX</option>
                            </select>
                        </div>
                    </div>

                    <div className={s.form_group}>
                        <label>Ngày chiếu</label>

                        <div className={s.input_box}>
                            <input
                                type="date"
                                name="date"
                                value={formData.date}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div className={s.form_group}>
                        <label>Giờ bắt đầu</label>

                        <div className={s.input_box}>
                            <span><MdAccessTime /></span>

                            <input
                                type="time"
                                name="startTime"
                                value={formData.startTime}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <button
                        className={s.saveBtn}
                        onClick={handleSubmit}
                    >
                        <MdSave />
                        {editingId ? "Cập nhật" : "Lưu"}
                    </button>

                </div>

                {/* TABLE */}
                <div className={s.table_container}>

                    <h2>Danh sách xuất chiếu</h2>

                    <table>

                        <thead>
                            <tr>
                                <th>Phim</th>
                                <th>Rạp</th>
                                <th>Phòng</th>
                                <th>Ngày</th>
                                <th>Giờ</th>
                                <th>Định dạng</th>
                                <th>Hành động</th>
                            </tr>
                        </thead>

                        <tbody>

                            {showtimes.map((showtime) => (

                                <tr key={showtime.id}>

                                    <td>{showtime.movie}</td>
                                    <td>{showtime.theater}</td>
                                    <td>{showtime.room}</td>
                                    <td>{showtime.date}</td>
                                    <td>{showtime.startTime}</td>
                                    <td>{showtime.format}</td>

                                    <td>

                                        <div className={s.actions}>

                                            <button
                                                className={s.editBtn}
                                                onClick={() => handleEdit(showtime)}
                                            >
                                                <MdEdit />
                                            </button>

                                            <button
                                                className={s.deleteBtn}
                                                onClick={() => handleDelete(showtime.id)}
                                            >
                                                <MdDelete />
                                            </button>

                                        </div>

                                    </td>

                                </tr>

                            ))}

                        </tbody>

                    </table>

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

                    <h2>Thông tin xuất chiếu</h2>

                    <div className={s.info_item}>
                        <p>Tổng xuất chiếu</p>
                        <h3>{showtimes.length}</h3>
                    </div>

                    <div className={s.info_item}>
                        <p>Phim đang chiếu</p>
                        <h3>12</h3>
                    </div>

                    <div className={s.info_item}>
                        <p>Rạp hoạt động</p>
                        <h3>8</h3>
                    </div>

                </div>

            </div>

        </div>
    );
};

export default ShowtimeManager;