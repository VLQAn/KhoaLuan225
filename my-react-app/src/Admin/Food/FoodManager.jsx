import styles from "./FoodManager.module.css";
import bapNuocApi from "../../services/bapNuocApi";
import rapChieuApi from "../../services/rapChieuApi";

import {
    MdClose,
    MdDashboard,
    MdMovie,
    MdAnalytics,
    MdFastfood,
    MdLogout,
    MdMenu,
    MdLightMode,
    MdDarkMode,
    MdEdit,
    MdDelete,
    MdSave,
    MdAdd,
    MdRestaurantMenu,
    MdLocalDrink,
    MdToggleOn,
    MdToggleOff,
    MdMessage,
    MdShoppingCart,
    MdReport,
    MdAddBox,
    MdLocalOffer,
    MdDescription,
} from "react-icons/md";

import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";

const s = styles;

const FoodManager = () => {

    const [darkMode, setDarkMode] = useState(() => {
        return localStorage.getItem("darkMode") === "true";
    });

    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const [foods, setFoods] = useState([]);

    const [formData, setFormData] = useState({
        tenMon: "",
        gia: "",
        hinhAnh: "",
        moTa: "",
        trangThai: true,
        maRap: "",
    });

    const [editingId, setEditingId] = useState(null);

    const [toast, setToast] = useState("");

    const [theaters, setTheaters] = useState([]);

    const [selectedTheater, setSelectedTheater] = useState("");

    useEffect(() => {

        if (darkMode) {
            document.body.classList.add("dark_theme_variables");
        } else {
            document.body.classList.remove("dark_theme_variables");
        }

        localStorage.setItem("darkMode", darkMode);

    }, [darkMode]);

    useEffect(() => {

        fetchFoods();
        fetchTheaters();

    }, []);

    const handleChange = (e) => {

        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const resetForm = () => {

        setFormData({

            tenMon: "",

            moTa: "",

            gia: "",

            hinhAnh: "",

            trangThai: "DANG_BAN",

            maRap: parseInt(formData.maRap),
        });

        setEditingId(null);
    };

    const handleSubmit = async () => {

        try {
            if (
                !formData.tenMon ||
                !formData.gia ||
                !formData.maRap
            ) {
                alert("Vui lòng chọn rạp");
                return;
            }

            const payload = {
                maRap: parseInt(formData.maRap),
                tenMon: formData.tenMon,
                gia: Number(formData.gia),
                hinhAnh: formData.hinhAnh,
                moTa: formData.moTa,
                trangThai: formData.trangThai
                    ? "DANG_BAN"
                    : "NGUNG_KINH_DOANH"
            };

            console.log(payload);

            if (editingId) {

                await bapNuocApi.updateFood(
                    editingId,
                    payload
                );

            } else {

                await bapNuocApi.createFood(
                    payload
                );
            }

            fetchFoods();

            resetForm();

        } catch (error) {

            console.log(error.response.data.errors);

            console.error(error);
        }
    };

    const handleEdit = (food) => {

        setEditingId(food.maMon);

        setFormData({

            tenMon: food.tenMon || "",

            moTa: food.moTa || "",

            gia: food.gia || "",

            hinhAnh: food.hinhAnh || "",

            trangThai:
                food.trangThai || "DANG_BAN",

            maRap: parseInt(food.maRap) || "",
        });
    };

    const handleDelete = (id) => {

        setFoods(
            foods.filter((food) => food.id !== id)
        );
    };

    const handleToggle = async (food) => {
        try {
            const newStatus =
                food.trangThai === "DANG_BAN"
                    ? "NGUNG_KINH_DOANH"
                    : "DANG_BAN";

            await bapNuocApi.updateStatus(food.maMon, newStatus);

            setToast(
                newStatus === "DANG_BAN"
                    ? "Mở bán món thành công"
                    : "Tắt bán món thành công"
            );

            fetchFoods();

            setTimeout(() => setToast(""), 2500);

        } catch (error) {
            console.error(error);
        }
    };

    const fetchFoods = async () => {

        try {

            const response =
                await bapNuocApi.getAllFoods();

            setFoods(response.data);

        } catch (error) {

            console.error(error);
        }
    };

    const fetchTheaters = async () => {

        try {

            const response =
                await rapChieuApi.getAllRapChieu();

            setTheaters(response);

        } catch (error) {

            console.error(error);

        }
    };

    const userData = localStorage.getItem("user");

    const user = userData
        ? JSON.parse(userData)
        : null;

    const filteredFoods = selectedTheater
        ? foods.filter(
            food =>
                String(food.maRap) ===
                String(selectedTheater)
        )
        : foods;

    return (

        <div className={s.container}>

            {toast && (
                <div className={styles.toast}>
                    {toast}
                </div>
            )}

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

                    <h1>Quản lý bắp nước</h1>

                    <button
                        className={s.addBtn}
                        onClick={resetForm}
                    >
                        <MdAdd />
                        Thêm món
                    </button>

                </div>

                {/* FORM */}
                <div className={s.form_container}>
                    <div className={s.form_group}>

                        <label>Lọc theo rạp</label>

                        <div className={s.input_box}>

                            <select
                                value={selectedTheater}
                                onChange={(e) => {

                                    const value = e.target.value;

                                    setSelectedTheater(value);

                                    setFormData({
                                        ...formData,
                                        maRap: value
                                    });
                                }}
                            >

                                <option value="">
                                    Tất cả rạp
                                </option>

                                {theaters.map((theater) => (

                                    <option
                                        key={theater.maRap}
                                        value={theater.maRap}
                                    >
                                        {theater.tenRap}
                                    </option>

                                ))}

                            </select>

                        </div>

                    </div>

                    <div className={s.form_group}>
                        <label>Tên món</label>

                        <div className={s.input_box}>
                            <span><MdRestaurantMenu /></span>

                            <input
                                type="text"
                                name="tenMon"
                                value={formData.tenMon}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div className={s.form_group}>
                        <label>Mô tả</label>

                        <div className={s.input_box}>
                            <span><MdDescription /></span>

                            <input
                                type="text"
                                name="moTa"
                                placeholder="Nhập mô tả món"
                                value={formData.moTa}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div className={s.form_group}>
                        <label>Giá món</label>

                        <div className={s.input_box}>
                            <span>VNĐ</span>

                            <input
                                type="number"
                                name="gia"
                                placeholder="Nhập giá món"
                                value={formData.gia}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div className={s.form_group}>
                        <label>Ảnh món</label>

                        <div className={s.input_box}>
                            <input
                                type="text"
                                name="hinhAnh"
                                placeholder="/combo.jpg"
                                value={formData.hinhAnh}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <button
                        className={s.saveBtn}
                        onClick={handleSubmit}
                    >
                        <MdSave />
                        {editingId ? "Cập nhật món" : "Lưu món"}
                    </button>

                </div>

                {/* TABLE */}
                <div className={s.table_container}>

                    <h2>Danh sách món</h2>

                    <table>

                        <thead>

                            <tr>
                                <th>Ảnh</th>
                                <th>Tên món</th>
                                <th>Mô tả</th>
                                <th>Giá</th>
                                <th>Trạng thái</th>
                                <th>Hành động</th>
                            </tr>

                        </thead>

                        <tbody>

                            {filteredFoods.map((food) => (

                                <tr key={food.maMon}>

                                    <td>
                                        <img
                                            src={food.hinhAnh}
                                            alt=""
                                            className={s.food_image}
                                        />
                                    </td>

                                    <td>{food.tenMon}</td>

                                    <td>{food.moTa}</td>

                                    <td>
                                        {Number(food.gia).toLocaleString()} VNĐ
                                    </td>

                                    <td>

                                        <button
                                            className={
                                                food.trangThai === "DANG_BAN"
                                                    ? s.toggle_on
                                                    : s.toggle_off
                                            }
                                            onClick={() => handleToggle(food)}
                                        >

                                            {
                                                food.trangThai === "DANG_BAN"
                                                    ? <MdToggleOn />
                                                    : <MdToggleOff />
                                            }

                                        </button>

                                    </td>

                                    <td>

                                        <div className={s.actions}>

                                            <button
                                                className={s.editBtn}
                                                onClick={() => handleEdit(food)}
                                            >
                                                <MdEdit />
                                            </button>

                                            <button
                                                className={s.deleteBtn}
                                                onClick={() => handleDelete(food.maMon)}
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

                    <h2>Thống kê món</h2>

                    <div className={s.info_item}>
                        <p>Tổng món</p>
                        <h3>{foods.length}</h3>
                    </div>

                    <div className={s.info_item}>
                        <p>Món đang bán</p>

                        <h3>
                            {
                                foods.filter(
                                    food => food.trangThai === "DANG_BAN"
                                ).length
                            }
                        </h3>
                    </div>

                    <div className={s.info_item}>
                        <p>Món đã tắt</p>

                        <h3>
                            {
                                foods.filter(
                                    food => food.trangThai !== "DANG_BAN"
                                ).length
                            }
                        </h3>
                    </div>

                </div>

            </div>

        </div>
    );
};

export default FoodManager;