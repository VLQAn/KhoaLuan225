import styles from "./Home.module.css";
import { Link } from "react-router-dom";
import { FaTwitter, FaFacebook, FaInstagram, FaSearch, FaGoogle, FaStar, FaPlay } from "react-icons/fa";

import icon1 from "../../assets/cast_crew.png";
import icon2 from "../../assets/award.png";
import icon3 from "../../assets/gallery.png";
import icon4 from "../../assets/more.png";

const icons = [icon1, icon2, icon3, icon4];

import film1 from "../../assets/f1.jpg";
import film2 from "../../assets/f2.jpg";
import film3 from "../../assets/f3.jpg";
import film4 from "../../assets/f4.jpg";
import film5 from "../../assets/f5.jpg";

const films = [film1, film2, film3, film4, film5];

const related = [
  { title: "Hàng xóm của tôi là Totoro", year: 1988 },
  { title: "Lâu đài di động của Howl", year: 2004 },
  { title: "Cô bé người cá Ponyo", year: 2008 },
  { title: "Công chúa Mononoke", year: 1997 },
  { title: "Nausicaa: Nàng công chúa ở thung lũng gió", year: 1984 },
];

const s = styles;

const Home = () => {
  return (
    <div className="container">
      {/* BANNER */}
      <div className={s.banner}>
        <div className={s.header}>
          <div className={s.menu}></div>
          <div className={s.logo}>RACSO</div>

          <div className={s.icons}>
            <span><FaSearch /></span>
            <span><FaFacebook /></span>
            <span><FaGoogle /></span>
            <span>
              <Link to="/register">Đăng nhập / Đăng ký</Link>
            </span>
          </div>
        </div>
      </div>

      {/* CONTENT */}
      <div className={s.content_container}>
        <div className={s.card}>

          {/* CONTENT HEADER */}
          <div className={s.info_header}>
            <div>
              <h1>
                VÙNG ĐẤT LINH HỒN <span>(2001)</span>
              </h1>
              <p className={s.genre}>Hoat Hình | Phiêu Lưu | Gia đình</p>

              <div className={s.stars}>
                {[...Array(5)].map((_, i) => <FaStar key={i} />)}
              </div>
            </div>

            <div className={s.info}>
              <p><b>GIỚI HẠN:</b> 12+</p>
              <p><b>THỜI LƯỢNG:</b> 125 phút</p>
              <p><b>DOANH THU:</b> 415.900.000.000 VNĐ</p>
              <p><b>NGÀY PHÁT HÀNH:</b> 28/03/2003</p>
            </div>
          </div>

          {/* MAIN CONTENT */}
          <div className={s.content}>

            {/* LEFT */}
            <div className={s.left}>
              <img
                src="https://animehay.mx/wp-content/uploads/2026/01/vung-dat-linh-hon-animehay.jpg"
                alt=""
              />

              <div className={s.descrip}>
                <div className={s.meta}>
                  <p><b>DẠO DIỄN</b><br />Hayao Miyazaki</p>
                  <p><b>TÁC GIẢ</b><br />Hayao Miyazaki</p>
                  <p><b>DIỄN VIÊN</b><br />Rumi Hiiragi, Miyu Irino</p>
                </div>

                <p className={s.plot}>
                  <b>MÔ TẢ</b><br />Vùng đất linh hồn (Spirited Away) là một bộ phim hoạt hình phiêu lưu giả tưởng của Nhật Bản được đạo diễn bởi Hayao Miyazaki và sản xuất bởi Studio Ghibli. Bộ phim kể về câu chuyện của một cô bé tên Chihiro,...
                </p>

                <button className={s.btn}>ĐẶT VÉ</button>

              </div>
            </div>
            {/* RIGHT */}
            <div className={s.right}>

              <div className={s.info_menu}>
                {["Đoàn phim", "Giải thưởng", "Trưng bày", "Thêm"].map((item, i) => (
                  <div key={i} className={s.menu_item}>
                    <div className={s.circle}>
                      <img src={icons[i]} alt="" />
                    </div>
                    <p>{item}</p>
                  </div>
                ))}
              </div>

              <div className={s.trailer}>
                <h3>TRAILER</h3>

                <div className={s.video}>
                  <img
                    src="https://media.vov.vn/sites/default/files/styles/large/public/2021-07/c66f29f6e575486aa40db56441fa503d.jpg"
                    alt=""
                  />
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>

      {/* RELATED */}
      <div className={s.related}>
        <div className={s.re_title}>
          <span className={s.line}></span>
          <h2>PHIM ĐANG CHIẾU KHÁC</h2>
          <span className={s.line}></span>
        </div>
        
        <div className={s.list}>
          {related.map((m, i) => (
            <div key={i} className={s.re_card}>
              <div className={s.poster}>
                <img src={films[i]} alt="" />
              </div>
              <p>{m.title}</p>
              <span>{m.year}</span>
            </div>
          ))}
        </div>
      </div>

      {/* FOOTER */}
      <div className={s.footer}>
        <div className={s.footer_container}>
          {/* Column 1 */}
          <div className={s.footer_col}>
            <h2 className={s.logo}>RACSO</h2>
            <p>
              48 Cao Thắng, Quận Hải Châu, TP. Đà Nẵng
            </p>
            <p>Tel: +84 (0)97 510 8905</p>
            <p className={s.email}>Email</p>

            <div className={s.socials}>
              <span><FaFacebook /></span>
              <span><FaTwitter /></span>
              <span><FaInstagram /></span>
            </div>
          </div>

          {/* Column 2 */}
          <div className={s.footer_col}>
            <h3>NHẬN THÔNG BÁO MỚI</h3>
            <p>
              Luôn cập nhật những thông tin mới nhất về Racso bằng cách
              đăng ký nhận bản tin hàng tháng của chúng tôi...
            </p>

            <input type="text" placeholder="Tên" />
            <input type="email" placeholder="Email" />
            <button>ĐĂNG KÝ</button>
          </div>

          {/* Column 3 */}
          <div className={s.footer_col}>
            <h3>TRÍCH DẪN</h3>
            <p className={s.quote}>
              "What we do in life echoes in eternity."
              (Những gì chúng ta làm khi còn sống sẽ vang vọng đến tận cõi vĩnh hằng.)
            </p>
            <p className={s.author}>Ridley Scott</p>
            <p className={s.movie}>Gladiator (2000)</p>
          </div>

          {/* Column 4 */}
          <div className={s.footer_col}>
            <h3>MENU</h3>

            <div className={s.menu_top}>
              <span>Điện ảnh</span>
              <span>Giải trí</span>
            </div>

            <div className={s.menu_links}>
              <div>
                <p>Giới thiệu</p>
                <p>Liên hệ</p>
                <p>Điều khoản dịch vụ</p>
                <p>Chính sách bảo mật</p>
                <p>Trang chủ</p>
              </div>

              <div>
                <p>Tuyển dụng</p>
                <p>Quảng cáo</p>
                <p>FAQs</p>
                <p>Thương hiệu</p>
              </div>
            </div>
          </div>
        </div>
        {/* Bottom bar */}
        <div className={s.footer_bottom}>
          Copyright © 2024 Racso. All rights reserved.
        </div>
      </div>
    </div>
  );
};

export default Home;