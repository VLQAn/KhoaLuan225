import styles from "./MovieDetail.module.css";
import { FaPlay } from "react-icons/fa";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import {
    MdMovie,
    MdAccessTime,
    MdDateRange
} from "react-icons/md";

import { useEffect, useState } from "react";
import xuatChieuApi from "../../services/xuatChieuApi";

const s = styles;

const MovieDetail = () => {
    // Hooks
    const navigate = useNavigate();
    const { id } = useParams();
    const { state: movie } = useLocation();

    const [showtimes, setShowtimes] = useState([]);
    const [selectedDate, setSelectedDate] = useState("");

    // Hàm fetch dữ liệu lịch chiếu cho phim
    const fetchShowtimes = async () => {
        try {

            const response =
                await xuatChieuApi.getAvailable();

            console.log(response);

            const data =
                response?.data || response || [];

            const movieShowtimes =
                data.filter(
                    item =>
                        item.maPhim === Number(id)
                );

            setShowtimes(movieShowtimes);

        } catch (error) {

            console.error(error);
        }
    };

    const formatDateVN = (dateStr) => {
        return new Date(dateStr)
            .toLocaleDateString("vi-VN");
    };

    const formatTimeVN = (dateStr) => {
        return new Date(dateStr)
            .toLocaleTimeString("vi-VN", {
                hour: "2-digit",
                minute: "2-digit",
            });
    };

    // useEffect để fetch dữ liệu khi component mount hoặc khi id thay đổi
    useEffect(() => {
        fetchShowtimes();
    }, [id]);

    // Dữ liệu tính toán cho phần hiển thị thông tin phim
    const uniqueDates = [
        ...new Set(
            showtimes.map(item =>
                formatDateVN(item.thoiGianBatDau)
            )
        )
    ];

    useEffect(() => {

        if (
            uniqueDates.length > 0 &&
            !selectedDate
        ) {
            setSelectedDate(uniqueDates[0]);
        }

    }, [showtimes]);

    const filteredShowtimes = showtimes.filter(
        item =>
            formatDateVN(item.thoiGianBatDau) === selectedDate
    );

    const groupedByCinema =
        filteredShowtimes.reduce(
            (acc, item) => {

                const cinema =
                    item.phong_chieu
                        .rap_chieu
                        .tenRap;

                if (!acc[cinema]) {
                    acc[cinema] = [];
                }

                acc[cinema].push(item);

                return acc;

            },
            {}
        );

    const movieData = {
        title: movie?.tieuDe,
        img: movie?.anhPoster,
        banner: movie?.anhBanner,
        rating: movie?.danhGia,
        time: `${movie?.thoiLuong} phút`,
        date: new Date(
            movie?.ngayCongChieu
        ).toLocaleDateString("vi-VN"),
        director: movie?.daoDien,
        cast: movie?.dienVien?.split(",") || [],
        genre:
            movie?.theLoai
                ?.map(item => item.tenTheLoai)
                .join(", "),
        desc: movie?.moTa,
    };

    return (
        <div className={s.container}>
            {/* Banner */}
            <div className={s.banner} style={{ backgroundImage: `url(${movieData.banner})` }}>
                <div className={s.overlay}></div>
            </div>

            {/* Info */}
            <div className={s.content}>
                <div className={s.poster}>
                    <img src={movieData.img} alt={movieData.title} />

                    <div className={s.play}>
                        <FaPlay />
                    </div>
                </div>

                <div className={s.info}>
                    <div className={s.top}>
                        <h1>{movieData.title}</h1>
                        <span className={s.rating}>
                            {movieData.rating} <span>/10</span>
                        </span>
                    </div>

                    <p className={s.meta}>
                        <MdMovie className={s.icon} />
                        {movieData.genre}
                    </p>
                    <p className={s.meta}>
                        <MdAccessTime className={s.icon} />
                        {movieData.time}
                    </p>
                    <p className={s.meta}>
                        <MdDateRange className={s.icon} />
                        {movieData.date}
                    </p>
                    <div className={s.extra_info}>

                        <p>
                            <span>Đạo diễn:</span>
                            {movieData.director}
                        </p>

                        <p>
                            <span>Diễn viên:</span>
                            {movieData.cast.join(", ")}
                        </p>

                    </div>

                    <p className={s.desc}>{movieData.desc}</p>
                </div>
            </div>

            {/* Showtime */}
            <div className={s.showtime}>
                <div className={s.showtime_header}>
                    <h2>Lịch chiếu</h2>

                    <div className={s.date_list}>
                        {uniqueDates.map((date) => (

                            <div
                                key={date}
                                className={`${s.date_item}
        ${selectedDate === date
                                        ? s.active
                                        : ""
                                    }`}
                                onClick={() =>
                                    setSelectedDate(date)
                                }
                            >
                                <span>{date}</span>
                            </div>

                        ))}
                    </div>

                </div>

                {Object.entries(
                    groupedByCinema
                ).map(
                    ([cinema, shows]) => (

                        <div
                            key={cinema}
                            className={s.cinema}
                        >
                            <h3
                                className={s.cinema_name}
                            >
                                {cinema}
                            </h3>

                            <div
                                className={s.times}
                            >
                                {shows.map(show => (

                                    <button
                                        key={
                                            show.maXuatChieu
                                        }
                                        onClick={() =>
                                            navigate(
                                                `/seat/${show.maXuatChieu}`
                                            )
                                        }
                                    >
                                        {formatTimeVN(show.thoiGianBatDau)}
                                    </button>

                                ))}
                            </div>
                        </div>

                    )
                )}
            </div>
        </div>
    );
};

export default MovieDetail;
