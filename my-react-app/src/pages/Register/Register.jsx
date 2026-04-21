import styles from "./Register.module.css";
import { useState } from "react";

const s = styles;

const Register = () => {
  const [isActive, setIsActive] = useState(false);

  return (
    <div className={`${s.container} ${isActive ? s.active : ""}`}>
      {/* Login form */}
      <div className={`${s.form_box} ${s.login}`}>
        <form action="#">
          <h1>Đăng nhập</h1>
          <div className={s.input_box}>
            <input type="text" placeholder="Email" required />
            <i className="fa-solid fa-envelope"></i>
          </div>
          <div className={s.input_box}>
            <input type="password" placeholder="Mật khẩu" required />
            <i className="fa-solid fa-lock"></i>
          </div>
          <div className={s.forgot_link}>
            <a href="#">Quên mật khẩu?</a>
          </div>
          <button type="submit" className={s.btn}>
            Đăng nhập
          </button>
        </form>
      </div>

      {/* Register form */}
      <div className={`${s.form_box} ${s.register}`}>
        <form action="#">
          <h1>Đăng ký</h1>
          <div className={s.input_box}>
            <input type="text" placeholder="Email" required />
            <i className="fa-solid fa-envelope"></i>
          </div>
          <div className={s.input_box}>
            <input type="password" placeholder="Mật khẩu" required />
            <i className="fa-solid fa-lock"></i>
          </div>
          <div className={s.input_box}>
            <input type="password" placeholder="Xác nhận Mật khẩu" required />
            <i className="fa-solid fa-lock"></i>
          </div>
          <button type="submit" className={s.btn}>
            Đăng ký
          </button>
        </form>
      </div>

      {/*Toggle button */}
      <div className={s.toggle_box}>
        {/*Toggle box left*/}
        <div className={`${s.toggle_panel} ${s.toggle_left}`}>
          <h1>Xin chào!</h1>
          <p>Chưa có tài khoản?</p>
          <button className={s.btn + " " + s.register_btn} onClick={() => setIsActive(true)}>
            Đăng ký
          </button>
        </div>

        {/*Toggle box right*/}
        <div className={`${s.toggle_panel} ${s.toggle_right}`}>
          <h1>Chào mừng trở lại!</h1>
          <p>Đã có tài khoản?</p>
          <button className={s.btn + " " + s.login_btn} onClick={() => setIsActive(false)}>
            Đăng nhập
          </button>
        </div>
      </div>
    </div>
  );
};

export default Register