import styles from "./ShowtimeManager.module.css";
import xuatChieuApi from "../../services/xuatChieuApi";
import movieApi from "../../services/movieApi";
import phongChieuApi from "../../services/phongChieuApi";

import {
    MdClose,
    MdDashboard,
    MdMovie,
    MdTheaters,
    MdConfirmationNumber,
    MdSchedule,
    MdFastfood,
    MdLogout,
    MdMenu,
    MdLightMode,
    MdDarkMode,
    MdEdit,
    MdDelete,
    MdSave,
    MdAdd,
    MdAccessTime,
    MdMovieCreation,
    MdLocalOffer,
    MdHomeWork,
} from "react-icons/md";

import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const s = styles;

const ShowtimeManager = () => {
    const navigate = useNavigate();
    const [darkMode, setDarkMode] = useState(() => {
        return localStorage.getItem("darkMode") === "true";
    });
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const [showtimes, setShowtimes] = useState([]);
    const [movies, setMovies] = useState([]);
    const [rooms, setRooms] = useState([]);

    const [formData, setFormData] = useState({
        maPhim: "",
        maPhong: "",
        ngayChieu: "",
        gioChieu: "",
    });

    const [editingId, setEditingId] = useState(null);

    const [selectedStatus, setSelectedStatus] = useState("all");

    useEffect(() => {

        if (darkMode) {
            document.body.classList.add("dark_theme_variables");
        } else {
            document.body.classList.remove("dark_theme_variables");
        }

        localStorage.setItem("darkMode", darkMode);

    }, [darkMode]);

    useEffect(() => {

        fetchShowtimes();
        fetchMovies();
        fetchRooms();

    }, []);

    const formatDate = (dateString) => {

        if (!dateString) return "";

        return new Date(dateString)
            .toLocaleDateString(
                "vi-VN",
                {
                    timeZone: "Asia/Ho_Chi_Minh",
                }
            );
    };

    const formatTime = (dateString) => {

        if (!dateString) return "";

        return new Date(dateString)
            .toLocaleTimeString(
                "vi-VN",
                {
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: false,
                    timeZone: "Asia/Ho_Chi_Minh",
                }
            );
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const resetForm = () => {

        setFormData({
            maPhim: "",
            maPhong: "",
            ngayChieu: "",
            gioChieu: "",
        });
    };

    const handleSubmit = async () => {

        try {

            if (
                !formData.maPhim ||
                !formData.maPhong ||
                !formData.ngayChieu ||
                !formData.gioChieu
            ) {
                return;
            }

            const thoiGianBatDau =
                `${formData.ngayChieu} ${formData.gioChieu}:00`;

            const payload = {
                maPhim: formData.maPhim,
                maPhong: formData.maPhong,
                thoiGianBatDau,
            };

            if (editingId) {

                await xuatChieuApi.update(
                    editingId,
                    payload
                );

                setEditingId(null);

            } else {

                await xuatChieuApi.create(payload);
            }

            fetchShowtimes();

            resetForm();

        } catch (error) {

            console.log(error);

            alert(
                error?.response?.data?.message ||
                "Có lỗi xảy ra"
            );
        }
    };

    const handleEdit = (showtime) => {

        setEditingId(
            showtime.maXuatChieu
        );

        const dateObj = new Date(
            showtime.thoiGianBatDau
        );

        const year =
            dateObj.toLocaleString(
                "en-US",
                {
                    year: "numeric",
                    timeZone: "Asia/Ho_Chi_Minh",
                }
            );

        const month =
            dateObj.toLocaleString(
                "en-US",
                {
                    month: "2-digit",
                    timeZone: "Asia/Ho_Chi_Minh",
                }
            );

        const day =
            dateObj.toLocaleString(
                "en-US",
                {
                    day: "2-digit",
                    timeZone: "Asia/Ho_Chi_Minh",
                }
            );

        const hours =
            dateObj.toLocaleString(
                "en-US",
                {
                    hour: "2-digit",
                    hour12: false,
                    timeZone: "Asia/Ho_Chi_Minh",
                }
            );

        const minutes =
            dateObj.toLocaleString(
                "en-US",
                {
                    minute: "2-digit",
                    timeZone: "Asia/Ho_Chi_Minh",
                }
            );

        const date = `${year}-${month}-${day}`;
        const time = `${hours}:${minutes}`;

        setFormData({
            maPhim: showtime.maPhim,
            maPhong: showtime.maPhong,
            ngayChieu: date,
            gioChieu: time,
        });
    };

    const handleDelete = async (id) => {

        try {

            await xuatChieuApi.delete(id);

            fetchShowtimes();

        } catch (error) {

            console.log(error);

            alert(
                error?.response?.data?.message ||
                "Không thể xóa"
            );
        }
    };

    const fetchShowtimes = async () => {
        try {

            const response =
                await xuatChieuApi
                    .getMyShowtimes();

            const sortedShowtimes =
                (response || []).sort(
                    (a, b) =>
                        new Date(a.thoiGianBatDau) -
                        new Date(b.thoiGianBatDau)
                );

            setShowtimes(
                sortedShowtimes
            );

        } catch (error) {

            console.log(error);
        }
    };

    const fetchMovies = async () => {

        try {

            const response =
                await movieApi.getAllMovies();

            setMovies(
                response.data?.data || []
            );

        } catch (error) {

            console.log(error);
        }
    };

    const fetchRooms = async () => {
        try {

            const response =
                await phongChieuApi
                    .getMyRooms();

            setRooms(
                response || []
            );

        } catch (error) {

            console.log(error);
        }
    };

    const getShowtimeStatus = (showtime) => {

        const now = new Date();

        const start = new Date(
            showtime.thoiGianBatDau
        );

        const end = new Date(
            showtime.thoiGianKetThuc
        );

        if (now < start) {
            return "Sắp chiếu";
        }

        if (
            now >= start &&
            now <= end
        ) {
            return "Đang chiếu";
        }

        return "Đã chiếu";
    };

    const phimDangChieu = movies.filter(
        (movie) => movie.trangThai === "dang_chieu"
    ).length;

    const sapChieuCount = showtimes.filter(
        (s) => getShowtimeStatus(s) === "Sắp chiếu"
    ).length;

    const dangChieuCount = showtimes.filter(
        (s) => getShowtimeStatus(s) === "Đang chiếu"
    ).length;

    const daChieuCount = showtimes.filter(
        (s) => getShowtimeStatus(s) === "Đã chiếu"
    ).length;

    const filteredShowtimes = showtimes.filter((showtime) => {

        if (selectedStatus === "all") {
            return true;
        }

        return (
            getShowtimeStatus(showtime) === selectedStatus
        );
    });

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
                    <a href="#" onClick={handleLogout}>
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
                                name="maPhim"
                                value={formData.maPhim}
                                onChange={handleChange}
                            >
                                <option value="">
                                    Chọn phim
                                </option>

                                {movies.map((movie) => (

                                    <option
                                        key={movie.maPhim}
                                        value={movie.maPhim}
                                    >
                                        {movie.tieuDe}
                                    </option>

                                ))}

                            </select>
                        </div>
                    </div>

                    <div className={s.form_group}>
                        <label>Rạp chiếu</label>

                        <div className={s.input_box}>
                            <span><MdTheaters /></span>

                            <select
                                name="maPhong"
                                value={formData.maPhong}
                                onChange={handleChange}
                            >
                                <option value="">
                                    Chọn phòng
                                </option>

                                {rooms.map((room) => (

                                    <option
                                        key={room.maPhong}
                                        value={room.maPhong}
                                    >
                                        {room.tenPhong} -
                                        {room.rap_chieu?.tenRap}
                                    </option>

                                ))}

                            </select>
                        </div>
                    </div>

                    <div className={s.form_group}>
                        <label>Ngày chiếu</label>

                        <div className={s.input_box}>
                            <input
                                type="date"
                                name="ngayChieu"
                                value={formData.ngayChieu}
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
                                name="gioChieu"
                                value={formData.gioChieu}
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
                                <th>Trạng thái</th>
                                <th>Hành động</th>
                            </tr>
                        </thead>

                        <tbody>
                            {filteredShowtimes.map((showtime) => (
                                <tr key={showtime.maXuatChieu}>

                                    <td>
                                        {showtime.phim?.tieuDe}
                                    </td>

                                    <td>
                                        {showtime.phong_chieu?.rap_chieu?.tenRap}
                                    </td>

                                    <td>
                                        {showtime.phong_chieu?.tenPhong}
                                    </td>

                                    <td>
                                        {formatDate(showtime.thoiGianBatDau)}
                                    </td>

                                    <td>
                                        {formatTime(showtime.thoiGianBatDau)}
                                    </td>

                                    <td>
                                        {getShowtimeStatus(showtime)}
                                    </td>

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
                                                onClick={() =>
                                                    handleDelete(showtime.maXuatChieu)
                                                }
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

                    <h2>Thông tin xuất chiếu</h2>

                    <div
                        className={s.info_item}
                        onClick={() => setSelectedStatus("all")}
                    >
                        <p>Tất cả xuất chiếu</p>
                        <h3>{showtimes.length}</h3>
                    </div>

                    <div
                        className={s.info_item}
                        onClick={() => setSelectedStatus("Sắp chiếu")}
                    >
                        <p>Xuất sắp chiếu</p>
                        <h3>{sapChieuCount}</h3>
                    </div>

                    <div
                        className={s.info_item}
                        onClick={() => setSelectedStatus("Đang chiếu")}
                    >
                        <p>Xuất đang chiếu</p>
                        <h3>{dangChieuCount}</h3>
                    </div>

                    <div
                        className={s.info_item}
                        onClick={() => setSelectedStatus("Đã chiếu")}
                    >
                        <p>Xuất đã chiếu</p>
                        <h3>{daChieuCount}</h3>
                    </div>

                </div>

            </div>

        </div>
    );
};

export default ShowtimeManager;