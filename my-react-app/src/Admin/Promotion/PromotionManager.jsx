import styles from "./PromotionManager.module.css";
import khuyenMaiApi from "../../services/khuyenMaiApi";

import {
    MdClose,
    MdDashboard,
    MdMovie,
    MdLogout,
    MdMenu,
    MdLightMode,
    MdDarkMode,

    MdEdit,
    MdDelete,
    MdSave,
    MdAdd,

    MdLocalOffer,
    MdDiscount,
    MdDateRange,
    MdPercent,

    MdHomeWork,
    MdConfirmationNumber,
    MdSchedule,
    MdFastfood,
} from "react-icons/md";

import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const s = styles;

const PromotionManager = () => {
    const navigate = useNavigate();

    const [darkMode, setDarkMode] = useState(() => {
        return localStorage.getItem("darkMode") === "true";
    });

    const [promotions, setPromotions] = useState([]);

    const fetchPromotions = async () => {
        try {
            const res = await khuyenMaiApi.getAll();

            setPromotions(res.data || []);
        } catch (err) {
            console.log(err);
        }
    };

    const [formData, setFormData] = useState({
        noiDung: "",
        maCode: "",
        giaKhuyenMai: "",
        ngayBatDau: "",
        thoiHan: "",
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

    useEffect(() => {
        fetchPromotions();
    }, []);

    const handleChange = (e) => {

        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const resetForm = () => {

        setFormData({
            noiDung: "",
            maCode: "",
            giaKhuyenMai: "",
            ngayBatDau: "",
            thoiHan: "",
            status: true,
        });

        setEditingId(null);
    };

    const formatDate = (dateString) => {
        if (!dateString) return "";
        return dateString.split(" ")[0].split("T")[0];
    };

    const toDateTime = (date, isEnd = false) => {
        if (!date) return null;

        return isEnd
            ? `${date} 23:59:59`
            : `${date} 00:00:00`;
    };

    const handleSubmit = async () => {

        if (
            !formData.noiDung ||
            !formData.maCode ||
            !formData.giaKhuyenMai ||
            !formData.ngayBatDau ||
            !formData.thoiHan
        ) return;

        const payload = {
            noiDung: formData.noiDung,
            maCode: formData.maCode,
            giaKhuyenMai: Number(formData.giaKhuyenMai),

            ngayBatDau: toDateTime(formData.ngayBatDau, false),
            thoiHan: toDateTime(formData.thoiHan, true),
        };

        try {
            if (editingId) {
                await khuyenMaiApi.update(editingId, payload);
            } else {
                await khuyenMaiApi.create(payload);
            }

            fetchPromotions();
            resetForm();

        } catch (err) {
            console.log("STATUS:", err.response?.status);
            console.log("DATA:", err.response?.data);
            console.log(err);
        }
    };

    const handleEdit = (promo) => {
        setEditingId(promo.maKhuyenMai);

        setFormData({
            noiDung: promo.noiDung || "",
            maCode: promo.maCode || "",
            giaKhuyenMai: promo.giaKhuyenMai || "",

            ngayBatDau: formatDate(promo.ngayBatDau),
            thoiHan: formatDate(promo.thoiHan),
        });
    };

    const handleDelete = async (id) => {
        try {
            await khuyenMaiApi.delete(id);
            fetchPromotions();
        } catch (err) {
            console.log("STATUS:", err.response?.status);
            console.log("DATA:", err.response?.data);
            console.log(err);
        }
    };

    const handleToggle = (id) => {

        setPromotions(
            promotions.map((promo) =>
                promo.id === id
                    ? {
                        ...promo,
                        status: !promo.status
                    }
                    : promo
            )
        );
    };

    const userData = localStorage.getItem("user");

    const user = userData
        ? JSON.parse(userData)
        : null;

    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const now = new Date();

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

                    <div
                        className={s.close}
                        onClick={() => setIsSidebarOpen(false)}
                    >
                        <span><MdClose /></span>
                    </div>
                </div>

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
            </aside>

            {/* MAIN */}
            <main>

                <div className={s.header}>

                    <h1>Quản lý khuyến mãi</h1>

                    <button
                        className={s.addBtn}
                        onClick={resetForm}
                    >
                        <MdAdd />
                        Thêm mã
                    </button>

                </div>

                {/* FORM */}
                <div className={s.form_container}>

                    {/* Nội dung */}
                    <div className={s.form_group}>
                        <label>Nội dung khuyến mãi</label>
                        <div className={s.input_box}>
                            <span><MdLocalOffer /></span>
                            <input
                                type="text"
                                name="noiDung"
                                placeholder="Nhập nội dung khuyến mãi"
                                value={formData.noiDung}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    {/* Mã code */}
                    <div className={s.form_group}>
                        <label>Mã giảm giá</label>
                        <div className={s.input_box}>
                            <span><MdDiscount /></span>
                            <input
                                type="text"
                                name="maCode"
                                placeholder="VD: SALE50"
                                value={formData.maCode}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    {/* % giảm */}
                    <div className={s.form_group}>
                        <label>Phần trăm giảm</label>
                        <div className={s.input_box}>
                            <span><MdPercent /></span>
                            <input
                                type="number"
                                name="giaKhuyenMai"
                                placeholder="Nhập % giảm"
                                value={formData.giaKhuyenMai}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    {/* ngày bắt đầu */}
                    <div className={s.form_group}>
                        <label>Ngày bắt đầu</label>
                        <div className={s.input_box}>
                            <span><MdDateRange /></span>
                            <input
                                type="date"
                                name="ngayBatDau"
                                value={formData.ngayBatDau || ""}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    {/* ngày kết thúc */}
                    <div className={s.form_group}>
                        <label>Ngày kết thúc</label>
                        <div className={s.input_box}>
                            <span><MdDateRange /></span>
                            <input
                                type="date"
                                name="thoiHan"
                                value={formData.thoiHan || ""}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <button className={s.saveBtn} onClick={handleSubmit}>
                        <MdSave />
                        {editingId ? "Cập nhật mã" : "Lưu mã"}
                    </button>

                </div>

                {/* TABLE */}
                <div className={s.table_container}>

                    <h2>Danh sách khuyến mãi</h2>

                    <table>

                        <thead>
                            <tr>
                                <th>Nội dung</th>
                                <th>Mã</th>
                                <th>Giảm giá</th>
                                <th>Ngày bắt đầu</th>
                                <th>Ngày kết thúc</th>
                                <th>Trạng thái</th>
                                <th>Hành động</th>
                            </tr>
                        </thead>

                        <tbody>
                            {promotions.map((promo) => (
                                <tr key={promo.maKhuyenMai}>

                                    {/* Nội dung */}
                                    <td>{promo.noiDung}</td>

                                    {/* Mã */}
                                    <td>
                                        <span className={s.code}>
                                            {promo.maCode}
                                        </span>
                                    </td>

                                    {/* % giảm */}
                                    <td>{parseInt(promo.giaKhuyenMai)}%</td>

                                    {/* ngày bắt đầu */}
                                    <td>{promo.ngayBatDau}</td>

                                    {/* ngày kết thúc */}
                                    <td>{promo.thoiHan?.split("T")[0]}</td>

                                    {/* trạng thái */}
                                    <td>
                                        {
                                            new Date(promo.thoiHan) < new Date()
                                                ? "Hết hạn"
                                                : "Đang hoạt động"
                                        }
                                    </td>

                                    {/* actions */}
                                    <td>
                                        <div className={s.actions}>

                                            <button
                                                className={s.editBtn}
                                                onClick={() => handleEdit(promo)}
                                            >
                                                <MdEdit />
                                            </button>

                                            <button
                                                className={s.deleteBtn}
                                                onClick={() => handleDelete(promo.maKhuyenMai)}
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
                        <span><MdMenu /></span>
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

                    <h2>Thống kê khuyến mãi</h2>

                    <div className={s.info_item}>
                        <p>Tổng mã</p>
                        <h3>{promotions.length}</h3>
                    </div>

                    <div className={s.info_item}>
                        <p>Còn hiệu lực</p>
                        <h3>
                            {
                                promotions.filter(promo =>
                                    new Date(promo.thoiHan) >= new Date()
                                ).length
                            }
                        </h3>
                    </div>

                    <div className={s.info_item}>
                        <p>Hết hạn</p>
                        <h3>
                            {
                                promotions.filter(promo =>
                                    new Date(promo.thoiHan) < new Date()
                                ).length
                            }
                        </h3>
                    </div>

                </div>

            </div>

        </div>
    );
};

export default PromotionManager;