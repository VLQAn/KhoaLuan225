import styles from "./Register.module.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import authApi from "../../services/authApi";

const s = styles;

const Register = () => {

  const navigate = useNavigate();

  const [isActive, setIsActive] = useState(false);
  const [showForgot, setShowForgot] = useState(false);

  const [otp, setOtp] = useState("");

  const [newPassword, setNewPassword] =
    useState("");

  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [otpSent, setOtpSent] =
    useState(false);

  // LOGIN
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  // REGISTER
  const [registerData, setRegisterData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  // FORGOT
  const [forgotEmail, setForgotEmail] = useState("");

  // ================= LOGIN =================
  const handleLogin = async (e) => {

    e.preventDefault();

    try {

      const response =
        await authApi.login({

          email: loginData.email,

          matKhau: loginData.password,
        });

      console.log(response.data);

      // TOKEN
      const token =
        response.data.data.token;

      // USER
      const user =
        response.data.data.user;

      // SAVE LOCAL STORAGE
      localStorage.setItem(
        "token",
        token
      );

      localStorage.setItem(
        "user",
        JSON.stringify(user)
      );

      localStorage.setItem(
        "isLogin",
        true
      );

      alert("Đăng nhập thành công!");

      // CHECK ROLE
      if (user.vaiTro.maVaiTro === 1) {

        // ADMIN
        navigate("/admin/home");

      } else {

        // CUSTOMER
        navigate("/");
      }

      console.log(response.data.data.user);

    } catch (error) {

      console.log(error.response.data);

      alert(
        "Sai email hoặc mật khẩu!"
      );
    }
  };

  // ================= REGISTER =================
  const handleRegister = async (e) => {

    e.preventDefault();

    if (
      registerData.password !==
      registerData.confirmPassword
    ) {

      alert(
        "Mật khẩu xác nhận không đúng!"
      );

      return;
    }

    try {

      const response =
        await authApi.register({

          tenNguoiDung: registerData.username,

          email: registerData.email,

          matKhau: registerData.password,

          matKhau_confirmation:
            registerData.confirmPassword,
        });

      console.log(response.data);

      alert("Đăng ký thành công!");

      setIsActive(false);

    } catch (error) {

      console.error(error);

      alert("Đăng ký thất bại!");
    }
  };

  // ================= SEND OTP =================
  const handleSendOtp = async () => {

    try {

      await authApi.sendOtp(
        forgotEmail
      );

      alert(
        "OTP đã được gửi tới email"
      );

      setOtpSent(true);

    } catch (error) {

      alert(
        error.response?.data?.message
      );
    }
  };

  // ================= RESET PASSWORD =================
  const handleResetPassword =
    async () => {

      console.log({
        email: forgotEmail,
        otp: otp,
        newPassword: newPassword
      });

      if (
        newPassword !==
        confirmPassword
      ) {

        alert(
          "Xác nhận mật khẩu không khớp"
        );

        return;
      }

      try {

        await authApi.resetPassword({

          email:
            forgotEmail,

          otp,

          newPassword
        });

        alert(
          "Đổi mật khẩu thành công"
        );

        setShowForgot(false);

      } catch (error) {

        console.log(error.response?.data);

        alert(
          error.response?.data?.message ||
          "Có lỗi xảy ra"
        );
      }
    };

  return (

    <div className={s.wrapper}>

      <div className={`${s.container} ${isActive ? s.active : ""}`}>

        {/* LOGIN */}
        <div className={`${s.form_box} ${s.login}`}>

          <form onSubmit={handleLogin}>

            <h1>Đăng nhập</h1>

            <div className={s.input_box}>
              <input
                type="email"
                placeholder="Email"
                required
                value={loginData.email}
                onChange={(e) =>
                  setLoginData({
                    ...loginData,
                    email: e.target.value,
                  })
                }
              />
            </div>

            <div className={s.input_box}>
              <input
                type="password"
                placeholder="Mật khẩu"
                required
                value={loginData.password}
                onChange={(e) =>
                  setLoginData({
                    ...loginData,
                    password: e.target.value,
                  })
                }
              />
            </div>

            <div className={s.forgot_link}>
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setShowForgot(true);
                }}
              >
                Quên mật khẩu?
              </a>
            </div>

            <button type="submit" className={s.btn}>
              Đăng nhập
            </button>

          </form>
        </div>

        {/* REGISTER */}
        <div className={`${s.form_box} ${s.register}`}>

          <form onSubmit={handleRegister}>

            <h1>Đăng ký</h1>

            <div className={s.input_box}>
              <input
                type="text"
                placeholder="Tên người dùng"
                required
                value={registerData.username}
                onChange={(e) =>
                  setRegisterData({
                    ...registerData,
                    username: e.target.value,
                  })
                }
              />
            </div>

            <div className={s.input_box}>
              <input
                type="email"
                placeholder="Email"
                required
                value={registerData.email}
                onChange={(e) =>
                  setRegisterData({
                    ...registerData,
                    email: e.target.value,
                  })
                }
              />
            </div>

            <div className={s.input_box}>
              <input
                type="password"
                placeholder="Mật khẩu"
                required
                value={registerData.password}
                onChange={(e) =>
                  setRegisterData({
                    ...registerData,
                    password: e.target.value,
                  })
                }
              />
            </div>

            <div className={s.input_box}>
              <input
                type="password"
                placeholder="Xác nhận mật khẩu"
                required
                value={registerData.confirmPassword}
                onChange={(e) =>
                  setRegisterData({
                    ...registerData,
                    confirmPassword: e.target.value,
                  })
                }
              />
            </div>

            <button type="submit" className={s.btn}>
              Đăng ký
            </button>

          </form>
        </div>

        {/* TOGGLE */}
        <div className={s.toggle_box}>

          <div className={`${s.toggle_panel} ${s.toggle_left}`}>
            <h1>Xin chào!</h1>

            <p>Chưa có tài khoản?</p>

            <button
              className={s.btn + " " + s.register_btn}
              onClick={() => {
                setRegisterData({
                  username: "",
                  email: "",
                  password: "",
                  confirmPassword: "",
                });

                setIsActive(true);
              }}
            >
              Đăng ký
            </button>
          </div>

          <div className={`${s.toggle_panel} ${s.toggle_right}`}>

            <h1>Chào mừng trở lại!</h1>

            <p>Đã có tài khoản?</p>

            <button
              className={s.btn + " " + s.login_btn}
              onClick={() => {
                setLoginData({
                  email: "",
                  password: "",
                });

                setIsActive(false);
              }}
            >
              Đăng nhập
            </button>

          </div>

        </div>

      </div>

      {/* FORGOT PASSWORD */}
      {
        showForgot && (

          <div className={s.forgot_overlay}>

            <div className={s.forgot_modal}>

              <h2>Quên mật khẩu</h2>

              {!otpSent ? (
                <>
                  <p>Nhập email để nhận mã OTP</p>

                  <div className={s.input_box}>
                    <input
                      type="email"
                      placeholder="Nhập email"
                      value={forgotEmail}
                      onChange={(e) =>
                        setForgotEmail(e.target.value)
                      }
                    />
                  </div>

                  <button
                    className={s.btn}
                    onClick={handleSendOtp}
                  >
                    Gửi OTP
                  </button>
                </>
              ) : (
                <>
                  <p>Nhập OTP và mật khẩu mới</p>

                  <div className={s.input_box}>
                    <input
                      type="text"
                      placeholder="OTP"
                      value={otp}
                      onChange={(e) =>
                        setOtp(e.target.value)
                      }
                    />
                  </div>

                  <div className={s.input_box}>
                    <input
                      type="password"
                      placeholder="Mật khẩu mới"
                      value={newPassword}
                      onChange={(e) =>
                        setNewPassword(e.target.value)
                      }
                    />
                  </div>

                  <div className={s.input_box}>
                    <input
                      type="password"
                      placeholder="Xác nhận mật khẩu"
                      value={confirmPassword}
                      onChange={(e) =>
                        setConfirmPassword(e.target.value)
                      }
                    />
                  </div>

                  <button
                    className={s.btn}
                    onClick={handleResetPassword}
                  >
                    Đổi mật khẩu
                  </button>
                </>
              )}

              <button
                className={s.close_btn}
                onClick={() => {

                  setShowForgot(false);

                  setOtpSent(false);

                  setForgotEmail("");

                  setOtp("");

                  setNewPassword("");

                  setConfirmPassword("");
                }}
              >
                Đóng
              </button>

            </div>

          </div>
        )
      }

    </div>
  );
};

export default Register;
