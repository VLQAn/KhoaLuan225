import styles from "./MovieManager.module.css";
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
    MdSave,
    MdEdit,
    MdDelete,
    MdLocalOffer,
} from "react-icons/md";

import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";

import movieApi from "../../services/movieApi";
import theLoaiApi from "../../services/theLoaiApi";

const s = styles;

const MovieManager = () => {
    const [darkMode, setDarkMode] = useState(() => {
        return localStorage.getItem("darkMode") === "true";
    });
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const [movies, setMovies] = useState([]);

    const [theLoai, setTheLoai] = useState([]);

    const [formData, setFormData] = useState({
        maPhim: "",
        tieuDe: "",
        moTa: "",
        thoiLuong: "",
        ngayCongChieu: "",
        anhPoster: "",
        anhBanner: "",
        danhGia: "",
        dienVien: "",
        daoDien: "",
        trangThai: "",
        theLoai: [],
    });

    const [editingId, setEditingId] = useState(null);

    const [showGenreDropdown, setShowGenreDropdown]
        = useState(false);

    useEffect(() => {
        fetchMovies();

        fetchTheLoai();
    }, []);

    const fetchMovies = async () => {
        try {

            const response =
                await movieApi.getAllMovies();

            setMovies(response.data.data);

        } catch (error) {

            console.error(error);

        }
    };

    const fetchTheLoai = async () => {

        try {

            const response =
                await theLoaiApi.getAllGenres();

            setTheLoai(
                response.data.data
            );

        } catch (error) {

            console.error(error);
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

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async () => {

        try {

            if (editingId) {

                await movieApi.updateMovie(
                    editingId,
                    formData
                );

            } else {

                await movieApi.createMovie(
                    formData
                );
            }

            fetchMovies();

            resetForm();

            setEditingId(null);

        } catch (error) {

            console.log(
                error.response.data
            );

            console.log(movie);

            console.error(error);

        }
    };

    const handleEdit = (movie) => {

        setFormData({

            maPhim: movie.maPhim || "",

            tieuDe: movie.tieuDe || "",

            moTa: movie.moTa || "",

            thoiLuong: movie.thoiLuong || "",

            ngayCongChieu:
                movie.ngayCongChieu
                    ? movie.ngayCongChieu.split("T")[0]
                    : "",

            anhPoster:
                movie.anhPoster || "",

            anhBanner:
                movie.anhBanner || "",

            danhGia:
                movie.danhGia || "",

            dienVien:
                movie.dienVien || "",

            daoDien:
                movie.daoDien || "",

            trangThai:
                movie.trangThai || "",

            theLoai:
                movie.theLoai?.map(
                    (item) =>
                        item.maTheLoai
                ) || [],
        });

        setEditingId(movie.maPhim);
    };

    const handleDelete = async (id) => {

        const confirmDelete =
            window.confirm(
                "Bạn có chắc muốn xóa phim?"
            );

        if (!confirmDelete) return;

        try {

            await movieApi.deleteMovie(id);

            fetchMovies();

        } catch (error) {

            console.error(error);

        }
    };

    const handleChangeStatus = async (
        id,
        trangThai
    ) => {

        try {

            await movieApi.changeStatus(
                id,
                trangThai
            );

            fetchMovies();

        } catch (error) {

            console.error(error);

        }
    };

    const handleTheLoaiChange = (
        maTheLoai
    ) => {

        setFormData((prev) => {

            const exists =
                prev.theLoai.includes(
                    maTheLoai
                );

            if (exists) {

                return {
                    ...prev,

                    theLoai:
                        prev.theLoai.filter(
                            (id) =>
                                id !== maTheLoai
                        ),
                };
            }

            return {

                ...prev,

                theLoai: [
                    ...prev.theLoai,
                    maTheLoai,
                ],
            };
        });
    };

    const resetForm = () => {
        setFormData({
            maPhim: "",
            tieuDe: "",
            moTa: "",
            thoiLuong: "",
            ngayCongChieu: "",
            anhPoster: "",
            anhBanner: "",
            danhGia: "",
            dienVien: "",
            daoDien: "",
            trangThai: "",
            theLoai: [],
        });
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
                <div className={s.header}>
                    <h1>Quản lý phim</h1>

                    <button className={s.addBtn}>
                        <MdAdd />
                        Thêm phim
                    </button>
                </div>

                {/* FORM */}
                <div className={s.form_container}>
                    <div className={s.form_group}>
                        <label>Tiêu đề</label>
                        <input
                            type="text"
                            name="tieuDe"
                            value={formData.tieuDe}
                            onChange={handleChange}
                        />
                    </div>

                    <div className={s.form_group}>
                        <label>Trạng thái</label>

                        <select
                            name="trangThai"
                            value={formData.trangThai}
                            onChange={handleChange}
                        >
                            <option value="">
                                Chọn trạng thái
                            </option>

                            <option value="dang_chieu">
                                Đang chiếu
                            </option>

                            <option value="sap_chieu">
                                Sắp chiếu
                            </option>

                            <option value="ngung_chieu">
                                Ngừng chiếu
                            </option>
                        </select>
                    </div>

                    <div className={s.form_group}>
                        <label>Thể loại</label>

                        <div className={s.genre_dropdown}>

                            {/* INPUT HIỂN THỊ */}
                            <div
                                className={s.genre_select}
                                onClick={() =>
                                    setShowGenreDropdown(
                                        !showGenreDropdown
                                    )
                                }
                            >

                                {
                                    formData.theLoai.length > 0
                                        ? theLoai
                                            .filter((item) =>
                                                formData.theLoai.includes(
                                                    item.maTheLoai
                                                )
                                            )
                                            .map(
                                                (item) =>
                                                    item.tenTheLoai
                                            )
                                            .join(", ")

                                        : "Chọn thể loại"
                                }

                            </div>

                            {/* DROPDOWN */}
                            {
                                showGenreDropdown && (

                                    <div className={s.genre_options}>

                                        {
                                            theLoai.map((genre) => (

                                                <label
                                                    key={genre.maTheLoai}
                                                    className={s.genre_option}
                                                >

                                                    <input
                                                        type="checkbox"

                                                        checked={
                                                            formData.theLoai.includes(
                                                                genre.maTheLoai
                                                            )
                                                        }

                                                        onChange={() =>
                                                            handleTheLoaiChange(
                                                                genre.maTheLoai
                                                            )
                                                        }
                                                    />

                                                    {genre.tenTheLoai}

                                                </label>
                                            ))
                                        }

                                    </div>
                                )
                            }

                        </div>
                    </div>

                    <div className={s.form_group}>
                        <label>Thời lượng</label>
                        <input
                            type="number"
                            name="thoiLuong"
                            value={formData.thoiLuong}
                            onChange={handleChange}
                        />
                    </div>

                    <div className={s.form_group}>
                        <label>Ngày công chiếu</label>
                        <input
                            type="date"
                            name="ngayCongChieu"
                            value={formData.ngayCongChieu}
                            onChange={handleChange}
                        />
                    </div>

                    <div className={s.form_group}>
                        <label>Ảnh poster</label>
                        <input
                            type="text"
                            name="anhPoster"
                            value={formData.anhPoster}
                            onChange={handleChange}
                        />
                    </div>

                    <div className={s.form_group}>
                        <label>Ảnh banner</label>
                        <input
                            type="text"
                            name="anhBanner"
                            value={formData.anhBanner}
                            onChange={handleChange}
                        />
                    </div>

                    <div className={s.form_group}>
                        <label>Đánh giá</label>
                        <input
                            type="number"
                            step="0.1"
                            name="danhGia"
                            value={formData.danhGia}
                            onChange={handleChange}
                        />
                    </div>

                    <div className={s.form_group}>
                        <label>Diễn viên</label>
                        <input
                            type="text"
                            name="dienVien"
                            value={formData.dienVien}
                            onChange={handleChange}
                        />
                    </div>

                    <div className={s.form_group}>
                        <label>Đạo diễn</label>
                        <input
                            type="text"
                            name="daoDien"
                            value={formData.daoDien}
                            onChange={handleChange}
                        />
                    </div>

                    <div className={`${s.form_group} ${s.full}`}>
                        <label>Mô tả</label>
                        <textarea
                            rows="4"
                            name="moTa"
                            value={formData.moTa}
                            onChange={handleChange}
                        />
                    </div>

                    <button className={s.saveBtn} onClick={handleSubmit}>
                        <MdSave />
                        {editingId ? "Cập nhật phim" : "Lưu phim"}
                    </button>
                </div>

                {/* TABLE */}
                <div className={s.table_container}>
                    <table>
                        <thead>
                            <tr>
                                <th>Poster</th>
                                <th>Tên phim</th>
                                <th>Thể loại</th>
                                <th>Thời lượng</th>
                                <th>Đánh giá</th>
                                <th>Trạng thái</th>
                                <th>Hành động</th>
                            </tr>
                        </thead>

                        <tbody>
                            {movies.map((movie) => (
                                <tr key={movie.maPhim}>
                                    <td>
                                        <img
                                            src={movie.anhPoster}
                                            alt=""
                                            className={s.poster}
                                        />
                                    </td>

                                    <td>{movie.tieuDe}</td>
                                    <td>
                                        {
                                            movie.theLoai
                                                ?.map(
                                                    (item) =>
                                                        item.tenTheLoai
                                                )
                                                .join(", ")
                                        }
                                    </td>
                                    <td>{movie.thoiLuong} phút</td>
                                    <td>{movie.danhGia}</td>
                                    <td>
                                        {
                                            movie.trangThai === "dang_chieu"
                                                ? "Đang chiếu"
                                                : movie.trangThai === "sap_chieu"
                                                    ? "Sắp chiếu"
                                                    : "Ngừng chiếu"
                                        }
                                    </td>

                                    <td>
                                        <div className={s.actions}>
                                            <button
                                                className={s.editBtn}
                                                onClick={() => handleEdit(movie)}
                                            >
                                                <MdEdit />
                                            </button>

                                            <button
                                                className={s.deleteBtn}
                                                onClick={() => handleDelete(movie.maPhim)}
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
                    <h2>Thông tin</h2>

                    <div className={s.info_item}>
                        <p>Tổng số phim</p>
                        <h3>{movies.length}</h3>
                    </div>

                    <div className={s.info_item}>
                        <p>Phim đang chiếu</p>
                        <h3>12</h3>
                    </div>

                    <div className={s.info_item}>
                        <p>Phim sắp chiếu</p>
                        <h3>5</h3>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MovieManager;
