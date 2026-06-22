import styles from "./TheaterManager.module.css";

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
    MdChair,
    MdMeetingRoom,
    MdPhone,
    MdLocationOn,
    MdLocalOffer,
    MdConfirmationNumber,
    MdSchedule,
    MdFastfood,
    MdHomeWork,

} from "react-icons/md";

import { useEffect, useState, useRef } from "react";
import { NavLink } from "react-router-dom";
import rapChieuApi from "../../services/rapChieuApi";
import { useNavigate } from "react-router-dom";

const s = styles;

const TheaterManager = () => {
    const navigate = useNavigate();
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
        phongChieus: [],
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

        setTimeout(() => {
            lastRoomRef.current?.scrollIntoView({
                behavior: "smooth",
                block: "start",
            });
        }, 100);
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

    const handleSeatChange = (
        roomIndex,
        seatIndex,
        field,
        value
    ) => {

        const updatedRooms =
            [...formData.phongChieus];

        updatedRooms[roomIndex]
            .ghe[seatIndex][field] = value;

        setFormData({
            ...formData,
            phongChieus: updatedRooms,
        });
    };

    const handleSubmit = async () => {

        try {

            if (editingId) {
                console.log(
                    JSON.stringify(formData.phongChieus, null, 2)
                );

                await rapChieuApi.updateRapChieu(
                    editingId,
                    formData
                );

            } else {

                await rapChieuApi.createRapChieu(
                    formData
                );
            }

            await fetchTheaters();

            resetForm();

            setEditingId(null);

        } catch (error) {

            console.error(error);

            console.log(formData.phongChieus);

        }
    };

    const handleEdit = (theater) => {

        setEditingId(theater.maRap);

        setFormData({
            tenRap: theater.tenRap || "",
            diaChi: theater.diaChi || "",
            soDienThoai: theater.soDienThoai || "",
            moTa: theater.moTa || "",

            phongChieus:
                theater.phong_chieu?.map((room) => ({

                    maPhong: room.maPhong,

                    tenPhong: room.tenPhong || "",

                    ghe: room.ghe || [],

                    soHang:
                        [...new Set(
                            room.ghe?.map(
                                (g) => g.hangGhe
                            ) || []
                        )].length,

                    soCot:
                        Math.max(
                            ...(room.ghe?.map(
                                (g) => g.soGhe
                            ) || [0]
                            )),
                })) || [],
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

        setEditingId(null);

        setFormData({
            tenRap: "",
            diaChi: "",
            soDienThoai: "",
            moTa: "",
            phongChieus: [],
        });
    };

    const lastRoomRef = useRef(null);

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

                        {(formData.phongChieus || []).map(
                            (room, index) => (

                                <div
                                    key={room.maPhong || index}
                                    ref={
                                        index === formData.phongChieus.length - 1
                                            ? lastRoomRef
                                            : null
                                    }
                                    className={s.room_card}
                                >

                                    <div className={s.room_top}>

                                        <h3>
                                            <MdMeetingRoom />
                                            Phòng {index + 1}
                                        </h3>

                                        {(formData.phongChieus || []).length > 1 && (
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

                                    <div className={s.seatList}>

                                        <h4>Danh sách ghế</h4>

                                        <div className={s.seatGrid}>

                                            {(room.ghe || []).map(
                                                (seat, seatIndex) => (

                                                    <div
                                                        key={seat.maGhe}
                                                        className={s.seatCard}
                                                    >

                                                        <div className={s.seatCode}>
                                                            {seat.hangGhe}
                                                            {seat.soGhe}
                                                        </div>

                                                        <select
                                                            value={seat.loaiGhe}
                                                            onChange={(e) =>
                                                                handleSeatChange(
                                                                    index,
                                                                    seatIndex,
                                                                    "loaiGhe",
                                                                    e.target.value
                                                                )
                                                            }
                                                        >
                                                            <option value="thuong">
                                                                Thường
                                                            </option>

                                                            <option value="vip">
                                                                VIP
                                                            </option>
                                                        </select>

                                                        <select
                                                            value={seat.trangThai}
                                                            onChange={(e) =>
                                                                handleSeatChange(
                                                                    index,
                                                                    seatIndex,
                                                                    "trangThai",
                                                                    e.target.value
                                                                )
                                                            }
                                                        >
                                                            <option value="hoat_dong">
                                                                Hoạt động
                                                            </option>

                                                            <option value="bao_tri">
                                                                Bảo trì
                                                            </option>
                                                        </select>

                                                    </div>
                                                )
                                            )}

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
                                    <td>
                                        {theater.phong_chieu?.length || 0}
                                    </td>

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