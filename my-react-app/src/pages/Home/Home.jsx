import "./Home.css";
import { FaTwitter, FaFacebook, FaInstagram, FaSearch, FaGoogle, FaStar, FaPlay } from "react-icons/fa";

import icon1 from "../../assets/cast_crew.png";
import icon2 from "../../assets/award.png";
import icon3 from "../../assets/gallery.png";
import icon4 from "../../assets/more.png";

const icons = [icon1, icon2, icon3, icon4];

const related = [
  { title: "Totoro", year: 1988 },
  { title: "Howl", year: 2004 },
  { title: "Ponyo", year: 2008 },
  { title: "Mononoke", year: 1997 },
  { title: "Nausicaa", year: 1984 },
];

const Home = () => {
  return (
    <div className="container">

      {/* BANNER */}
      <div className="banner">
        <div className="header">
            <div className="menu">☰</div>

            <div className="logo">RACSO</div>

            <div className="icons">
                <span><FaSearch /></span>
                <span><FaFacebook /></span>
                <span><FaGoogle /></span>
                <span>Đăng nhập/ Đăng ký</span>
            </div>
        </div>
      </div>

      {/* CONTENT */}
      <div className="container">
        <div className="card">

          {/* CONTENT HEADER */}
          <div className="info-header">
            <div>
              <h1>
                VÙNG ĐẤT LINH HỒN <span>(2001)</span>
              </h1>
              <p className="genre">Hoat Hình | Phiêu Lưu | Gia đình</p>

              <div className="stars">
                {[...Array(5)].map((_, i) => <FaStar key={i} />)}
              </div>
            </div>

            <div className="info">
              <p><b>GIỚI HẠN:</b> 12+</p>
              <p><b>THỜI LƯỢNG:</b> 125 phút</p>
              <p><b>DOANH THU:</b> 415.900.000.000 VNĐ</p>
              <p><b>NGÀY PHÁT HÀNH:</b> 28/03/2003</p>
            </div>
          </div>

          {/* MAIN CONTENT */}
          <div className="content">

            {/* LEFT */}
            <div className="left">
              <img
                src="https://animehay.mx/wp-content/uploads/2026/01/vung-dat-linh-hon-animehay.jpg"
                alt=""
              />

              <div className="descrip">
                <div className="meta">
                  <p><b>DẠO DIỄN</b><br />Hayao Miyazaki</p>
                  <p><b>TÁC GIẢ</b><br />Hayao Miyazaki</p>
                  <p><b>DIỄN VIÊN</b><br />Rumi Hiiragi, Miyu Irino</p>
                </div>

                <p className="plot">
                  <b>MÔ TẢ</b><br />Vùng đất linh hồn (Spirited Away) là một bộ phim hoạt hình phiêu lưu giả tưởng của Nhật Bản được đạo diễn bởi Hayao Miyazaki và sản xuất bởi Studio Ghibli. Bộ phim kể về câu chuyện của một cô bé tên Chihiro,...
                </p>

                <button className="btn">ĐẶT VÉ</button>

              </div>
            </div>
            {/* RIGHT */}
            <div className="right">

              <div className="info_menu">
                {["Đoàn phim", "Giải thưởng", "Trưng bày", "Thêm"].map((item, i) => (
                  <div key={i} className="menu-item">
                    <div className="circle">
                      <img src={icons[i]} alt="" />
                    </div>
                    <p>{item}</p>
                  </div>
                ))}
              </div>

              <div className="trailer">
                <h3>TRAILER</h3>

                <div className="video">
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
      <div className="related">
        <h2>RELATED MOVIES</h2>
        <div className="list">
          {related.map((m, i) => (
            <div key={i} className="card">
              <div className="poster"></div>
              <p>{m.title}</p>
              <span>{m.year}</span>
            </div>
          ))}
        </div>
      </div>

      {/* FOOTER */}
      <div className="footer">
        <p>© 2026 Movie UI</p>
      </div>
    </div>
  );
};

export default Home;