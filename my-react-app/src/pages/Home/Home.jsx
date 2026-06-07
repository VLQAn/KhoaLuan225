import styles from "./Home.module.css";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { FaTwitter, FaFacebook, FaInstagram, FaSearch, FaGoogle, FaStar, FaPlay, FaComments } from "react-icons/fa";

import icon1 from "../../assets/cast_crew.png";
import icon2 from "../../assets/award.png";
import icon3 from "../../assets/gallery.png";
import icon4 from "../../assets/more.png";

const icons = [icon1, icon2, icon3, icon4];

import { useEffect, useState, useRef } from "react";
import movieApi from "../../services/movieApi";

const s = styles;

const Home = () => {
  /* =========================
   NAVIGATION
========================= */
  const navigate = useNavigate();

  /* =========================
   SEARCH
========================= */
  const [showSearch, setShowSearch] = useState(false);
  const [searchText, setSearchText] = useState("");

  /* =========================
   MOVIES
========================= */
  const [allMovies, setAllMovies] = useState([]);
  const [bannerMovies, setBannerMovies] = useState([]);
  const [currentBanner, setCurrentBanner] = useState(0);

  /* =========================
 COMPUTED DATA
========================= */
  const featuredMovie =
    bannerMovies.length > 0
      ? bannerMovies[0]
      : null;

  const currentMovie =
    bannerMovies[currentBanner] || {};

  const relatedMovies =
    allMovies
      .filter(
        movie =>
          movie.maPhim !== featuredMovie?.maPhim
      )
      .slice(0, 5);

  const user = JSON.parse(
    localStorage.getItem("user")
  );

  /* =========================
   LOAD MOVIES
========================= */
  useEffect(() => {

    const loadMovies = async () => {

      try {

        const response =
          await movieApi.getAllMovies();

        const data =
          response?.data?.data || [];

        const showingMovies = data.filter(
          movie => movie.trangThai === "dang_chieu"
        );

        // Toàn bộ phim đang chiếu
        setAllMovies(showingMovies);

        // Top 5 đánh giá cao nhất
        setBannerMovies(
          [...showingMovies]
            .sort(
              (a, b) =>
                Number(b.danhGia || 0) -
                Number(a.danhGia || 0)
            )
            .slice(0, 5)
        );

      } catch (err) {

        console.log(err);

      }

    };

    loadMovies();

  }, []);

  /* =========================
   AUTO BANNER SLIDE
========================= */
  useEffect(() => {

    if (bannerMovies.length === 0)
      return;

    const timer =
      setInterval(() => {

        setCurrentBanner(prev =>
          prev === bannerMovies.length - 1
            ? 0
            : prev + 1
        );

      }, 5000);

    return () =>
      clearInterval(timer);

  }, [bannerMovies]);

  if (bannerMovies.length === 0) {
    return (
      <div>
        Loading...
      </div>
    );
  }

  return (
    <div className="container">
      {/* BANNER */}
      <div
        className={s.banner}
        style={{
          backgroundImage:
            `url(${currentMovie.anhBanner})`
        }}
      >

        <div className={s.overlay}></div>

        <div className={s.header}>
          <div className={s.menu}></div>
          <div className={s.logo}>RACSO</div>

          <div className={s.icons}>
            <span onClick={() => setShowSearch(true)}>
              <FaSearch />
            </span>
            <span><FaFacebook /></span>
            <span><FaGoogle /></span>
            <span className={s.login_link}>
              {
                user ? (
                  <Link
                    to="/profile"
                    state={{ user }}
                  >
                    {user.tenNguoiDung}
                  </Link>
                ) : (
                  <Link to="/register">
                    Đăng nhập / Đăng ký
                  </Link>
                )
              }
            </span>
          </div>
        </div>

        <div className={s.bannerContent}>

          <span className={s.badge}>
            ĐANG CHIẾU
          </span>

          <h1>
            {currentMovie.tieuDe}
          </h1>

          <p>
            {currentMovie.moTa?.slice(0, 180)}...
          </p>

          <div className={s.metaInfo}>

            <span>
              ⭐ {currentMovie.danhGia || "N/A"}
            </span>

            <span>
              ⏱ {currentMovie.thoiLuong} phút
            </span>

          </div>

          <button
            className={s.bookBtn}
            onClick={() =>
              navigate(
                `/movie/${currentMovie.maPhim}`
              )
            }
          >
            Đặt vé ngay
          </button>

        </div>

        <button
          className={s.prev}
          onClick={() =>
            setCurrentBanner(
              currentBanner === 0
                ? bannerMovies.length - 1
                : currentBanner - 1
            )
          }
        >
          ❮
        </button>

        <button
          className={s.next}
          onClick={() =>
            setCurrentBanner(
              currentBanner === bannerMovies.length - 1
                ? 0
                : currentBanner + 1
            )
          }
        >
          ❯
        </button>

        <div className={s.dots}>
          {bannerMovies.map((_, i) => (
            <span
              key={i}
              className={
                i === currentBanner
                  ? s.activeDot
                  : ""
              }
            />
          ))}
        </div>

        <div className={s.bannerThumbs}>

          {bannerMovies.map((movie, index) => (

            <img
              key={movie.maPhim}
              src={movie.anhBanner}
              alt={movie.tieuDe}

              className={
                index === currentBanner
                  ? s.activeThumb
                  : ""
              }

              onClick={() =>
                setCurrentBanner(index)
              }
            />

          )
          )}

        </div>

      </div>

      {/* CONTENT */}
      <div className={s.content_container}>
        <div className={s.card}>

          {/* CONTENT HEADER */}
          <div className={s.info_header}>
            <div>
              <h1>
                {featuredMovie?.tieuDe}
                <span>
                  (
                  {featuredMovie?.ngayCongChieu?.slice(0, 4)}
                  )
                </span>
              </h1>

              <p className={s.genre}>
                {
                  featuredMovie?.theLoai
                    ?.map(item => item.tenTheLoai)
                    .join(" | ")
                }
              </p>

              <div className={s.stars}>
                {[...Array(5)].map((_, i) => <FaStar key={i} />)}
              </div>
            </div>

            <div className={s.info}>

              <p>
                <b>ĐÁNH GIÁ:</b>
                {" "}
                ⭐ {featuredMovie?.danhGia}
              </p>

              <p>
                <b>THỜI LƯỢNG:</b>
                {" "}
                {featuredMovie?.thoiLuong} phút
              </p>

              <p>
                <b>DOANH THU:</b>
                {" "}
                {(Number(featuredMovie?.danhGia || 0) * 100000000)
                  .toLocaleString("vi-VN")}
                {" "}VNĐ
              </p>

              <p>
                <b>NGÀY PHÁT HÀNH:</b>
                {" "}
                {featuredMovie?.ngayCongChieu}
              </p>

            </div>
          </div>

          {/* SEARCH OVERLAY */}
          <div
            className={`${s.search_overlay} ${showSearch ? s.show_search : ""
              }`}
          >
            <div className={s.search_box}>

              <input
                type="text"
                placeholder="Tìm kiếm phim..."
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
              />

              <button>
                <FaSearch />
              </button>

              <span
                className={s.close_search}
                onClick={() => setShowSearch(false)}
              >
                ✕
              </span>

            </div>

            {/* SEARCH RESULT */}
            <div className={s.search_result}>

              {
                relatedMovies
                  .filter((m) =>
                    m.tieuDe
                      .toLowerCase()
                      .includes(searchText.toLowerCase())
                  )
                  .map((m, i) => (
                    <div key={i} className={s.result_item}>

                      <img
                        src={m.anhPoster}
                        alt={m.tieuDe}
                      />

                      <div>
                        <h4>{m.tieuDe}</h4>
                        <p>
                          {new Date(
                            m.ngayCongChieu
                          ).toLocaleDateString("vi-VN")}
                        </p>
                      </div>

                    </div>
                  ))
              }

            </div>
          </div>

          {/* MAIN CONTENT */}
          <div className={s.content}>

            {/* LEFT */}
            <div className={s.left}>
              <img
                src={featuredMovie?.anhPoster}
                alt={featuredMovie?.tieuDe}
              />

              <div className={s.descrip}>
                <div className={s.meta}>

                  <p>
                    <b>ĐẠO DIỄN</b>
                    <br />
                    {featuredMovie?.daoDien}
                  </p>

                  <p>
                    <b>THỂ LOẠI</b>
                    <br />
                    {
                      featuredMovie?.theLoai
                        ?.map(item => item.tenTheLoai)
                        .join(", ")
                    }
                  </p>

                  <p>
                    <b>DIỄN VIÊN</b>
                    <br />
                    {
                      featuredMovie?.dienVien?.length > 80
                        ? featuredMovie.dienVien.slice(0, 80) + "..."
                        : featuredMovie?.dienVien
                    }
                  </p>

                </div>

                <p className={s.plot}>
                  <b>MÔ TẢ</b>
                  <br />
                  {featuredMovie?.moTa?.length > 350
                    ? featuredMovie.moTa.slice(0, 350) + "..."
                    : featuredMovie?.moTa}
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
                    src={featuredMovie?.anhBanner}
                    alt={featuredMovie?.tieuDe}
                  />

                  <div className={s.playButton}>
                    <FaPlay />
                  </div>
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
          <h2 className={s.re_title_text}>PHIM ĐANG CHIẾU KHÁC</h2>
          <span className={s.line}></span>
        </div>

        <div className={s.list}>

          {relatedMovies.map((movie) => (

            <div
              key={movie.maPhim}
              className={s.re_card}
              onClick={() =>
                navigate(`/movie/${movie.maPhim}`)
              }
            >

              <div className={s.poster}>
                <img
                  src={movie.anhPoster}
                  alt={movie.tieuDe}
                />
              </div>

              <p>{movie.tieuDe}</p>

              <span>
                {new Date(
                  movie.ngayCongChieu
                ).toLocaleDateString("vi-VN")}
              </span>

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
    </div >
  );
};

export default Home;
