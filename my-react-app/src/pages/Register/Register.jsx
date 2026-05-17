import styles from "./Register.module.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const s = styles;

const Register = () => {

  const navigate = useNavigate();

  const [isActive, setIsActive] = useState(false);
  const [showForgot, setShowForgot] = useState(false);

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
  const handleLogin = (e) => {

    e.preventDefault();

    const savedUser = JSON.parse(
      localStorage.getItem("user")
    );

    if (
      savedUser?.email === loginData.email &&
      savedUser?.password === loginData.password
    ) {

      localStorage.setItem(
        "isLogin",
        true
      );

      alert("Đăng nhập thành công!");

      navigate("/");

    } else {

      alert("Sai email hoặc mật khẩu!");
    }
  };

  // ================= REGISTER =================
  const handleRegister = (e) => {

    e.preventDefault();

    if (
      registerData.password !==
      registerData.confirmPassword
    ) {

      alert("Mật khẩu xác nhận không đúng!");
      return;
    }

    const newUser = {
      username: registerData.username,
      email: registerData.email,
      password: registerData.password,
      totalSpent: 0,
    };

    localStorage.setItem(
      "user",
      JSON.stringify(newUser)
    );

    alert("Đăng ký thành công!");

    setIsActive(false);
  };

  // ================= FORGOT =================
  const handleForgot = () => {

    if (!forgotEmail) {
      alert("Vui lòng nhập email!");
      return;
    }

    alert(
      `Liên kết đặt lại mật khẩu đã gửi đến ${forgotEmail}`
    );

    setShowForgot(false);
    setForgotEmail("");
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
              onClick={() => setIsActive(true)}
            >
              Đăng ký
            </button>
          </div>

          <div className={`${s.toggle_panel} ${s.toggle_right}`}>

            <h1>Chào mừng trở lại!</h1>

            <p>Đã có tài khoản?</p>

            <button
              className={s.btn + " " + s.login_btn}
              onClick={() => setIsActive(false)}
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

              <p>
                Nhập email để nhận liên kết đặt lại mật khẩu
              </p>

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
                onClick={handleForgot}
              >
                Gửi yêu cầu
              </button>

              <button
                className={s.close_btn}
                onClick={() => setShowForgot(false)}
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