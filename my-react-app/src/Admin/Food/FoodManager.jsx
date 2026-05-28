import styles from "./FoodManager.module.css";

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

    const [foods, setFoods] = useState([
        {
            id: 1,
            name: "Combo Couple",
            category: "Combo",
            price: "199000",
            image: "/combo1.jpg",
            status: true,
        },
        {
            id: 2,
            name: "Bắp Caramel",
            category: "Bắp",
            price: "79000",
            image: "/popcorn.jpg",
            status: true,
        },
        {
            id: 3,
            name: "Pepsi Large",
            category: "Nước",
            price: "49000",
            image: "/pepsi.jpg",
            status: false,
        }
    ]);

    const [formData, setFormData] = useState({
        name: "",
        category: "",
        price: "",
        image: "",
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
            name: "",
            category: "",
            price: "",
            image: "",
            status: true,
        });

        setEditingId(null);
    };

    const handleSubmit = () => {

        if (
            !formData.name ||
            !formData.category ||
            !formData.price
        ) return;

        if (editingId) {

            setFoods(
                foods.map((food) =>
                    food.id === editingId
                        ? { ...formData, id: editingId }
                        : food
                )
            );

        } else {

            setFoods([
                ...foods,
                {
                    ...formData,
                    id: Date.now(),
                }
            ]);
        }

        resetForm();
    };

    const handleEdit = (food) => {

        setEditingId(food.id);
        setFormData(food);
    };

    const handleDelete = (id) => {

        setFoods(
            foods.filter((food) => food.id !== id)
        );
    };

    const handleToggle = (id) => {

        setFoods(
            foods.map((food) =>
                food.id === id
                    ? {
                        ...food,
                        status: !food.status
                    }
                    : food
            )
        );
    };

    const userData = localStorage.getItem("user");

    const user = userData
        ? JSON.parse(userData)
        : null;

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
                        <label>Tên món</label>

                        <div className={s.input_box}>
                            <span><MdRestaurantMenu /></span>

                            <input
                                type="text"
                                name="name"
                                placeholder="Nhập tên món"
                                value={formData.name}
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
                                name="description"
                                placeholder="Nhập mô tả món"
                                value={formData.description}
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
                                name="price"
                                placeholder="Nhập giá món"
                                value={formData.price}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div className={s.form_group}>
                        <label>Ảnh món</label>

                        <div className={s.input_box}>
                            <input
                                type="text"
                                name="image"
                                placeholder="/combo.jpg"
                                value={formData.image}
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
                                <th>Loại</th>
                                <th>Giá</th>
                                <th>Trạng thái</th>
                                <th>Hành động</th>
                            </tr>

                        </thead>

                        <tbody>

                            {foods.map((food) => (

                                <tr key={food.id}>

                                    <td>
                                        <img
                                            src={food.image}
                                            alt=""
                                            className={s.food_image}
                                        />
                                    </td>

                                    <td>{food.name}</td>

                                    <td>{food.category}</td>

                                    <td>
                                        {Number(food.price).toLocaleString()} VNĐ
                                    </td>

                                    <td>

                                        <button
                                            className={
                                                food.status
                                                    ? s.toggle_on
                                                    : s.toggle_off
                                            }
                                            onClick={() => handleToggle(food.id)}
                                        >

                                            {
                                                food.status
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
                                                onClick={() => handleDelete(food.id)}
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
                                foods.filter(food => food.status).length
                            }
                        </h3>
                    </div>

                    <div className={s.info_item}>
                        <p>Món đã tắt</p>

                        <h3>
                            {
                                foods.filter(food => !food.status).length
                            }
                        </h3>
                    </div>

                </div>

            </div>

        </div>
    );
};

export default FoodManager;