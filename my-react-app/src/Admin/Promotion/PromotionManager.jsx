import styles from "./PromotionManager.module.css";

import {
    MdClose,
    MdDashboard,
    MdMovie,
    MdAnalytics,
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
    MdToggleOn,
    MdToggleOff,
    MdMessage,
    MdShoppingCart,
    MdAddBox,
    MdDateRange,
    MdPercent,
} from "react-icons/md";

import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";

const s = styles;

const PromotionManager = () => {

    const [darkMode, setDarkMode] = useState(() => {
        return localStorage.getItem("darkMode") === "true";
    });

    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const [promotions, setPromotions] = useState([
        {
            id: 1,
            title: "Giảm giá cuối tuần",
            code: "WEEKEND50",
            discount: 50,
            startDate: "2026-05-10",
            endDate: "2026-05-30",
            status: true,
        },
        {
            id: 2,
            title: "Khuyến mãi sinh viên",
            code: "STUDENT20",
            discount: 20,
            startDate: "2026-05-01",
            endDate: "2026-06-01",
            status: true,
        },
        {
            id: 3,
            title: "Flash Sale",
            code: "FLASH10",
            discount: 10,
            startDate: "2026-05-15",
            endDate: "2026-05-16",
            status: false,
        }
    ]);

    const [formData, setFormData] = useState({
        title: "",
        code: "",
        discount: "",
        startDate: "",
        endDate: "",
        status: true,
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
            title: "",
            code: "",
            discount: "",
            startDate: "",
            endDate: "",
            status: true,
        });

        setEditingId(null);
    };

    const handleSubmit = () => {

        if (
            !formData.title ||
            !formData.code ||
            !formData.discount ||
            !formData.startDate ||
            !formData.endDate
        ) return;

        if (editingId) {

            setPromotions(
                promotions.map((promo) =>
                    promo.id === editingId
                        ? { ...formData, id: editingId }
                        : promo
                )
            );

        } else {

            setPromotions([
                ...promotions,
                {
                    ...formData,
                    id: Date.now(),
                }
            ]);
        }

        resetForm();
    };

    const handleEdit = (promo) => {

        setEditingId(promo.id);
        setFormData(promo);
    };

    const handleDelete = (id) => {

        setPromotions(
            promotions.filter((promo) => promo.id !== id)
        );
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
                        <span><MdAnalytics /></span>
                        <h3>Cập nhật rạp chiếu</h3>
                    </NavLink>

                    <NavLink
                        to="/admin/booking-manager"
                        className={({ isActive }) => isActive ? s.active : ""}
                    >
                        <span><MdMessage /></span>
                        <h3>Đơn đặt vé</h3>
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

                    <div className={s.form_group}>
                        <label>Tên khuyến mãi</label>

                        <div className={s.input_box}>
                            <span><MdLocalOffer /></span>

                            <input
                                type="text"
                                name="title"
                                placeholder="Nhập tên khuyến mãi"
                                value={formData.title}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div className={s.form_group}>
                        <label>Mã giảm giá</label>

                        <div className={s.input_box}>
                            <span><MdDiscount /></span>

                            <input
                                type="text"
                                name="code"
                                placeholder="VD: SALE50"
                                value={formData.code}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div className={s.form_group}>
                        <label>Phần trăm giảm</label>

                        <div className={s.input_box}>
                            <span><MdPercent /></span>

                            <input
                                type="number"
                                name="discount"
                                placeholder="Nhập % giảm"
                                value={formData.discount}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div className={s.form_group}>
                        <label>Ngày bắt đầu</label>

                        <div className={s.input_box}>
                            <span><MdDateRange /></span>

                            <input
                                type="date"
                                name="startDate"
                                value={formData.startDate}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div className={s.form_group}>
                        <label>Ngày kết thúc</label>

                        <div className={s.input_box}>
                            <span><MdDateRange /></span>

                            <input
                                type="date"
                                name="endDate"
                                value={formData.endDate}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <button
                        className={s.saveBtn}
                        onClick={handleSubmit}
                    >
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
                                <th>Tên</th>
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

                                <tr key={promo.id}>

                                    <td>{promo.title}</td>

                                    <td>
                                        <span className={s.code}>
                                            {promo.code}
                                        </span>
                                    </td>

                                    <td>{promo.discount}%</td>

                                    <td>{promo.startDate}</td>

                                    <td>{promo.endDate}</td>

                                    <td>

                                        <button
                                            className={
                                                promo.status
                                                    ? s.toggle_on
                                                    : s.toggle_off
                                            }
                                            onClick={() => handleToggle(promo.id)}
                                        >

                                            {
                                                promo.status
                                                    ? <MdToggleOn />
                                                    : <MdToggleOff />
                                            }

                                        </button>

                                    </td>

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
                                                onClick={() => handleDelete(promo.id)}
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
                            <p><b>Babar</b></p>
                            <p>Admin</p>
                        </div>

                        <div className={s.profile_photo}>
                            <img src="/galaxy.jpg" alt="" />
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
                        <p>Đang hoạt động</p>

                        <h3>
                            {
                                promotions.filter(
                                    promo => promo.status
                                ).length
                            }
                        </h3>
                    </div>

                    <div className={s.info_item}>
                        <p>Đã tắt</p>

                        <h3>
                            {
                                promotions.filter(
                                    promo => !promo.status
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