import styles from "./Profile.module.css";

import {
    MdPerson,
    MdEmail,
    MdLock,
    MdPaid,
    MdEdit,
    MdSave,
} from "react-icons/md";

import { useEffect, useState } from "react";
import historyApi from "../../services/historyApi";

const s = styles;

const Profile = () => {

    const user = JSON.parse(localStorage.getItem("user"));

    const [totalSpent, setTotalSpent] = useState(0);

    const [password, setPassword] = useState(
        user?.password || ""
    );

    const [showPopup, setShowPopup] = useState(false);

    const [oldPassword, setOldPassword] = useState("");

    const [newPassword, setNewPassword] = useState("");

    const [confirmPassword, setConfirmPassword] = useState("");

    const handleChangePassword = () => {

        // kiểm tra mật khẩu cũ
        if (oldPassword !== user.password) {
            alert("Mật khẩu cũ không đúng!");
            return;
        }

        // kiểm tra xác nhận mật khẩu
        if (newPassword !== confirmPassword) {
            alert("Xác nhận mật khẩu không khớp!");
            return;
        }

        // cập nhật user
        const updatedUser = {
            ...user,
            password: newPassword,
        };

        localStorage.setItem(
            "user",
            JSON.stringify(updatedUser)
        );

        // cập nhật state
        setPassword(newPassword);

        // reset input
        setOldPassword("");
        setNewPassword("");
        setConfirmPassword("");

        // đóng popup
        setShowPopup(false);

        alert("Đổi mật khẩu thành công!");
    };

    useEffect(() => {

        const loadHistory = async () => {

            try {

                const response =
                    await historyApi.getHistory();

                const bookings =
                    response.data || [];

                const total =
                    bookings.reduce(
                        (sum, item) =>
                            sum + Number(item.total || 0),
                        0
                    );

                setTotalSpent(total);

            } catch (error) {

                console.error(
                    "Lỗi lấy lịch sử:",
                    error
                );

            }

        };

        loadHistory();

    }, []);

    return (

        <div className={s.profile_page}>

            <div className={s.card}>

                <div className={s.header}>

                    <div className={s.avatar}>
                        {user?.tenNguoiDung?.charAt(0)}
                    </div>

                    <h1>{user?.tenNguoiDung}</h1>

                    <p>Thành viên RACSO Cinema</p>

                </div>

                <div className={s.info_box}>

                    <div className={s.info_item}>
                        <MdPerson />
                        <div>
                            <span>Tên tài khoản</span>
                            <h3>{user?.tenNguoiDung}</h3>
                        </div>
                    </div>

                    <div className={s.info_item}>
                        <MdEmail />
                        <div>
                            <span>Email</span>
                            <h3>{user?.email}</h3>
                        </div>
                    </div>

                    <div className={s.info_item}>
                        <MdPaid />
                        <div>
                            <span>Tổng chi tiêu</span>
                            <h3>
                                {totalSpent.toLocaleString("vi-VN")} VNĐ
                            </h3>
                        </div>
                    </div>

                    <div className={s.info_item}>
                        <MdLock />
                        <div>
                            <span>Mật khẩu</span>
                            <h3>{password}</h3>
                        </div>
                    </div>

                </div>

                {/* BUTTON OPEN POPUP */}
                <div className={s.change_password}>

                    <button
                        className={s.open_btn}
                        onClick={() => setShowPopup(true)}
                    >
                        <MdEdit />
                        Đổi mật khẩu
                    </button>

                </div>

                {/* POPUP */}
                {
                    showPopup && (

                        <div className={s.popup_overlay}>

                            <div className={s.popup}>

                                <h2>Đổi mật khẩu</h2>

                                <input
                                    type="password"
                                    placeholder="Nhập mật khẩu cũ"
                                    value={oldPassword}
                                    onChange={(e) =>
                                        setOldPassword(e.target.value)
                                    }
                                />

                                <input
                                    type="password"
                                    placeholder="Nhập mật khẩu mới"
                                    value={newPassword}
                                    onChange={(e) =>
                                        setNewPassword(e.target.value)
                                    }
                                />

                                <input
                                    type="password"
                                    placeholder="Xác nhận mật khẩu mới"
                                    value={confirmPassword}
                                    onChange={(e) =>
                                        setConfirmPassword(e.target.value)
                                    }
                                />

                                <div className={s.popup_actions}>

                                    <button onClick={handleChangePassword}>
                                        <MdSave />
                                        Thay đổi
                                    </button>

                                    <button
                                        className={s.cancel_btn}
                                        onClick={() => setShowPopup(false)}
                                    >
                                        Hủy
                                    </button>

                                </div>

                            </div>

                        </div>
                    )
                }

            </div>

        </div>
    );
};

export default Profile;