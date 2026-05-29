import styles from "./TheaterManager.module.css";

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
    MdChair,
    MdMeetingRoom,
    MdPhone,
    MdLocationOn,
    MdReport,
    MdLocalOffer,

} from "react-icons/md";

import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import rapChieuApi from "../../services/rapChieuApi";

const s = styles;

const TheaterManager = () => {
    const [darkMode, setDarkMode] = useState(() => {
        return localStorage.getItem("darkMode") === "true";
    });
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const [theaters, setTheaters] = useState([]);

    const [formData, setFormData] = useState({
        tenRap: "",
        diaChi: "",
        soDienThoai: "",
        moTa: "",

        phongChieus: [
            {
                tenPhong: "",
                soHang: 5,
                soCot: 5,
            },
        ],
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

        fetchTheaters();

    }, []);

    const fetchTheaters = async () => {

        try {

            const response =
                await rapChieuApi.getAllRapChieu();

            setTheaters(response);

        } catch (error) {

            console.error(error);

        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleRoomChange = (
        index,
        field,
        value
    ) => {

        const updatedRooms =
            [...formData.phongChieus];

        updatedRooms[index][field] = value;

        setFormData({
            ...formData,
            phongChieus: updatedRooms,
        });
    };

    const addRoom = () => {

        setFormData({
            ...formData,

            phongChieus: [
                ...formData.phongChieus,

                {
                    tenPhong: "",
                    soHang: 5,
                    soCot: 5,
                },
            ],
        });
    };

    const removeRoom = (index) => {

        const updatedRooms =
            formData.phongChieus.filter(
                (_, i) => i !== index
            );

        setFormData({
            ...formData,
            phongChieus: updatedRooms,
        });
    };

    const handleSubmit = async () => {

        try {

            await rapChieuApi.createRapChieu(
                formData
            );

            await fetchTheaters();

            resetForm();

        } catch (error) {

            console.error(error);

        }
    };

    const handleEdit = (theater) => {

        setEditingId(theater.maRap);

        setFormData({
            tenRap: theater.tenRap || "",
            diaChi: theater.diaChi || "",
            soDienThoai: theater.soDienThoai || "",
            moTa: theater.moTa || "",
            phongChieu: theater.phongChieu || "",
        });
    };

    const handleDelete = async (id) => {

        const confirmDelete = window.confirm(
            "Bạn có chắc muốn xóa rạp này?"
        );

        if (!confirmDelete) return;

        try {

            await rapChieuApi.deleteRapChieu(id);

            await fetchTheaters();

        } catch (error) {

            console.error(error);

        }
    };

    const resetForm = () => {

        setFormData({
            tenRap: "",
            diaChi: "",
            soDienThoai: "",
            moTa: "",

            phongChieus: [
                {
                    tenPhong: "",
                    soHang: 5,
                    soCot: 5,
                },
            ],
        });
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
                    <h1>Quản lý rạp chiếu</h1>

                    <button className={s.addBtn}>
                        <MdAdd />
                        Thêm rạp
                    </button>
                </div>

                {/* FORM */}
                <div className={s.form_container}>

                    <div className={s.section_title}>
                        <h2>Thông tin rạp</h2>
                    </div>

                    <div className={s.form_grid}>

                        <div className={s.form_group}>
                            <label>Tên rạp</label>

                            <div className={s.input_box}>
                                <span><MdAnalytics /></span>

                                <input
                                    type="text"
                                    name="tenRap"
                                    value={formData.tenRap}
                                    onChange={handleChange}
                                    placeholder="Nhập tên rạp"
                                />
                            </div>
                        </div>

                        <div className={s.form_group}>
                            <label>Số điện thoại</label>

                            <div className={s.input_box}>
                                <span><MdPhone /></span>

                                <input
                                    type="text"
                                    name="soDienThoai"
                                    value={formData.soDienThoai}
                                    onChange={handleChange}
                                    placeholder="Nhập số điện thoại"
                                />
                            </div>
                        </div>

                        <div className={`${s.form_group} ${s.full}`}>
                            <label>Địa chỉ</label>

                            <div className={s.input_box}>
                                <span><MdLocationOn /></span>

                                <input
                                    type="text"
                                    name="diaChi"
                                    value={formData.diaChi}
                                    onChange={handleChange}
                                    placeholder="Nhập địa chỉ"
                                />
                            </div>
                        </div>

                        <div className={`${s.form_group} ${s.full}`}>
                            <label>Mô tả</label>

                            <textarea
                                rows="4"
                                name="moTa"
                                value={formData.moTa}
                                onChange={handleChange}
                                placeholder="Mô tả rạp..."
                            />
                        </div>
                    </div>

                    {/* ROOM SECTION */}

                    <div className={s.room_header}>

                        <h2>Danh sách phòng chiếu</h2>

                        <button
                            className={s.addRoomBtn}
                            onClick={addRoom}
                        >
                            <MdAdd />
                            Thêm phòng
                        </button>
                    </div>

                    <div className={s.room_list}>

                        {formData.phongChieus.map(
                            (room, index) => (

                                <div
                                    key={index}
                                    className={s.room_card}
                                >

                                    <div className={s.room_top}>

                                        <h3>
                                            <MdMeetingRoom />
                                            Phòng {index + 1}
                                        </h3>

                                        {formData.phongChieus.length > 1 && (
                                            <button
                                                className={s.deleteRoomBtn}
                                                onClick={() => removeRoom(index)}
                                            >
                                                <MdDelete />
                                            </button>
                                        )}
                                    </div>

                                    <div className={s.room_grid}>

                                        <div className={s.form_group}>
                                            <label>Tên phòng</label>

                                            <input
                                                type="text"
                                                value={room.tenPhong}
                                                onChange={(e) =>
                                                    handleRoomChange(
                                                        index,
                                                        "tenPhong",
                                                        e.target.value
                                                    )
                                                }
                                                placeholder="Phòng VIP 1"
                                            />
                                        </div>

                                        <div className={s.form_group}>
                                            <label>Số hàng</label>

                                            <input
                                                type="number"
                                                value={room.soHang}
                                                onChange={(e) =>
                                                    handleRoomChange(
                                                        index,
                                                        "soHang",
                                                        e.target.value
                                                    )
                                                }
                                            />
                                        </div>

                                        <div className={s.form_group}>
                                            <label>Số cột</label>

                                            <input
                                                type="number"
                                                value={room.soCot}
                                                onChange={(e) =>
                                                    handleRoomChange(
                                                        index,
                                                        "soCot",
                                                        e.target.value
                                                    )
                                                }
                                            />
                                        </div>
                                    </div>

                                    <div className={s.room_preview}>

                                        <MdChair />

                                        Tổng ghế:

                                        <b>
                                            {room.soHang * room.soCot}
                                        </b>

                                    </div>
                                </div>
                            )
                        )}
                    </div>

                    <button
                        className={s.saveBtn}
                        onClick={handleSubmit}
                    >
                        <MdSave />

                        {editingId
                            ? "Cập nhật rạp"
                            : "Tạo rạp chiếu"}
                    </button>
                </div>

                {/* TABLE */}
                <div className={s.table_container}>
                    <h2>Danh sách rạp chiếu</h2>

                    <table>
                        <thead>
                            <tr>
                                <th>Tên rạp</th>
                                <th>Địa chỉ</th>
                                <th>SĐT</th>
                                <th>Phòng chiếu</th>
                                <th>Hành động</th>
                            </tr>
                        </thead>

                        <tbody>
                            {theaters.map((theater) => (
                                <tr key={theater.maRap}>
                                    <td>{theater.tenRap}</td>
                                    <td>{theater.diaChi}</td>
                                    <td>{theater.soDienThoai}</td>
                                    <td>{theater.phongChieu}</td>

                                    <td>
                                        <div className={s.actions}>
                                            <button
                                                className={s.editBtn}
                                                onClick={() => handleEdit(theater)}
                                            >
                                                <MdEdit />
                                            </button>

                                            <button
                                                className={s.deleteBtn}
                                                onClick={() => handleDelete(theater.maRap)}
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
                    <h2>Thông tin rạp</h2>

                    <div className={s.info_item}>
                        <p>Tổng rạp chiếu</p>
                        <h3>{theaters.length}</h3>
                    </div>

                    <div className={s.info_item}>
                        <p>Phòng chiếu hoạt động</p>
                        <h3>24</h3>
                    </div>

                    <div className={s.info_item}>
                        <p>Số ghế trung bình</p>
                        <h3>120</h3>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TheaterManager;