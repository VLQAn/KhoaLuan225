import { normalizeText } from "./chatbotUtils";
import { detectIntent } from "./chatbotIntents";
import { detectDate } from "./chatbotDate";
import { detectCinema, findCinema } from "./chatbotCinema";
import { detectTimePeriod } from "./chatbotTime";
import { isMovieDiscoveryQuery } from "./chatbotMovieDiscovery";

const chatbotRules = (
    message,
    movies,
    promotions,
    showtimes,
    cinemas,
) => {

    const text =
        normalizeText(message);

    const intent = detectIntent(text);

    /* =====================================
       TỪ KHÓA CÓ THỂ BỎ QUA
    ===================================== */
    const stopWords = [
        "thong tin",
        "chi tiet",
        "toi",
        "muon",
        "xem",
        "co",
        "nao",
        "khong",
        "toi nay",
        "hom nay",
        "giup",
        "minh",
        "xin",
        "phim",
        "cua",
        "dao",
        "dien",
        "vien",
        "tham",
        "gia"
    ];

    /* =====================================
       LÀM SẠCH YÊU CẦU
    ===================================== */
    let cleanText = text;

    stopWords.forEach(word => {

        cleanText =
            cleanText.replaceAll(
                word,
                ""
            );

    });

    const processedText =
        cleanText.trim();

    const suggestionKeywords = [
        "goi y",
        "de xuat",
        "recommend",
        "hay",
        "nen xem"
    ];

    /* =====================================
        NHẬN DIỆN Ý ĐỊNH ĐẶT VÉ
    ===================================== */

    const bookingKeywords = [
        "dat ve",
        "mua ve",
        "book ve",
        "dat cho",
        "giu cho"
    ];

    /* =====================================
        CÁC BIẾN NHẬN DIỆN
    ===================================== */

    const originalText = text;

    console.log(
        "CINEMAS:",
        cinemas
    );

    const foundCinema =
        findCinema(
            originalText,
            showtimes
        );

    const detectedDate =
        detectDate(originalText);

    const detectedTimePeriod =
        detectTimePeriod(
            originalText
        );

    const detectedCinema =
        detectCinema(
            originalText,
            showtimes
        );

    const isMovieDiscovery =
        isMovieDiscoveryQuery(
            originalText
        );

    /* =====================================
        NHẬN DIỆN RẠP CHIẾU
    ===================================== */
    const allCinemas = [];

    showtimes.forEach(showtime => {

        const cinemaName =
            normalizeText(
                showtime
                    ?.phong_chieu
                    ?.rap_chieu
                    ?.tenRap || ""
            );

        if (
            cinemaName &&
            !allCinemas.includes(cinemaName)
        ) {
            allCinemas.push(cinemaName);
        }

    });

    /* =====================================
       PHIM ĐANG CHIẾU
    ===================================== */

    if (intent === "showing_movies") {

        const showing =
            movies.filter(
                movie =>
                    movie.trangThai ===
                    "dang_chieu"
            );

        return {
            type: "text",
            text:
                showing.length > 0
                    ? "🎬 Phim đang chiếu:\n\n" +
                    showing
                        .map(
                            movie =>
                                `• ${movie.tieuDe}`
                        )
                        .join("\n")
                    : "Hiện chưa có phim đang chiếu."
        };
    }

    /* =====================================
       PHIM SẮP CHIẾU
    ===================================== */

    if (intent === "upcoming_movies") {

        const upcoming =
            movies.filter(
                movie =>
                    movie.trangThai ===
                    "sap_chieu"
            );

        return {
            type: "text",
            text:
                upcoming.length > 0
                    ? "🎥 Phim sắp chiếu:\n\n" +
                    upcoming
                        .map(
                            movie =>
                                `• ${movie.tieuDe}`
                        )
                        .join("\n")
                    : "Hiện chưa có phim sắp chiếu."
        };
    }

    /* =====================================
       KHUYẾN MÃI
    ===================================== */

    if (intent === "promotions") {

        return {
            type: "text",
            text:
                promotions.length > 0
                    ? "🎁 Khuyến mãi hiện có:\n\n" +
                    promotions
                        .map(
                            promo =>
                                `• ${promo.tenKhuyenMai}`
                        )
                        .join("\n")
                    : "Hiện chưa có chương trình khuyến mãi."
        };
    }

    /* =====================================
       TÌM PHIM THEO TỪ KHÓA
    ===================================== */

    const findMovieByKeyword = (
        text,
        movies
    ) => {

        const words =
            text.split(" ");

        return movies.find(movie => {

            const movieName =
                normalizeText(
                    movie.tieuDe
                );

            const matchedWords =
                words.filter(
                    word =>
                        movieName.includes(
                            word
                        )
                );

            return (
                matchedWords.length >= 2
            );
        });
    };

    if (intent === "recommendation") {

        const bestMovies =
            movies
                .filter(
                    movie =>
                        movie.trangThai ===
                        "dang_chieu"
                )
                .sort(
                    (a, b) =>
                        Number(b.danhGia || 0)
                        -
                        Number(a.danhGia || 0)
                );

        return {
            type: "movie_list",
            title:
                "⭐ Phim đáng xem hôm nay",
            movies:
                bestMovies.slice(0, 5)
        };
    }

    /* =====================================
       NHẬN DIỆN TÊN PHIM
    ===================================== */
    if (isMovieDiscovery) {

        let filteredShowtimes =
            [...showtimes];

        // chỉ lấy suất còn hiệu lực

        filteredShowtimes =
            filteredShowtimes.filter(
                showtime =>
                    new Date(
                        showtime.thoiGianKetThuc
                    ) > new Date()
            );

        // ngày
        if (detectedDate) {

            filteredShowtimes =
                filteredShowtimes.filter(
                    showtime => {

                        const showDate =
                            new Date(
                                showtime.thoiGianBatDau
                            );

                        if (
                            detectedDate.type ===
                            "weekend"
                        ) {

                            return (
                                showDate.getDay() === 6
                                ||
                                showDate.getDay() === 0
                            );
                        }

                        return (
                            showDate.toDateString()
                            ===
                            detectedDate.date.toDateString()
                        );
                    }
                );
        }

        //buổi sáng, chiểu, tối
        if (detectedTimePeriod) {

            filteredShowtimes =
                filteredShowtimes.filter(
                    showtime => {

                        const hour =
                            new Date(
                                showtime.thoiGianBatDau
                            ).getHours();

                        switch (
                        detectedTimePeriod
                        ) {

                            case "morning":
                                return (
                                    hour >= 6 &&
                                    hour < 12
                                );

                            case "afternoon":
                                return (
                                    hour >= 14 &&
                                    hour < 18
                                );

                            case "evening":
                                return (
                                    hour >= 18
                                );

                            default:
                                return true;
                        }
                    }
                );
        }

        // lọc rap
        if (detectedCinema) {

            filteredShowtimes =
                filteredShowtimes.filter(
                    showtime => {

                        const cinemaName =
                            normalizeText(
                                showtime
                                    ?.phong_chieu
                                    ?.rap_chieu
                                    ?.tenRap || ""
                            );

                        if (
                            detectedCinema.type ===
                            "brand"
                        ) {

                            return cinemaName.includes(
                                detectedCinema.value
                            );
                        }

                        return (
                            cinemaName ===
                            detectedCinema.value
                        );
                    }
                );
        }

        // lọc thể loại
        let matchedMovies =
            movies.filter(movie =>

                filteredShowtimes.some(
                    showtime =>
                        showtime.maPhim ===
                        movie.maPhim
                )
            );

        // chỉ lấy phim đang chiếu
        matchedMovies =
            matchedMovies.filter(
                movie =>
                    movie.trangThai ===
                    "dang_chieu"
            );

        // trả kết quả
        if (matchedMovies.length > 0) {
            let title = "🎬 Phim phù hợp";

            if (detectedGenre) {
                title =
                    `🎬 Phim ${detectedGenre}`;
            }

            if (detectedTimePeriod) {
                title += " theo khung giờ yêu cầu";
            }

            if (detectedCinema) {
                title += ` tại ${detectedCinema.value}`;
            }

            return {

                type: "movie_list",

                title: title,

                movies:
                    matchedMovies.slice(
                        0,
                        10
                    )
            };
        }

        if (matchedMovies.length === 0) {

            return {
                type: "text",
                text:
                    "🎬 Không tìm thấy phim phù hợp với yêu cầu của bạn."
            };
        }
    }

    /* =====================================
       ĐỊA CHỈ RẠP
    ===================================== */
    if (
        foundCinema &&
        (
            originalText.includes("dia chi")
            ||
            originalText.includes("o dau")
        )
    ) {

        return {

            type: "text",

            text:
                `📍 ${foundCinema.tenRap}\n\n` +

                `Địa chỉ: ${foundCinema.diaChi}`
        };
    }

    /* =====================================
       LIÊN HỆ RẠP
    ===================================== */
    if (
        foundCinema &&
        (
            originalText.includes("so dien thoai")
            ||
            originalText.includes("lien he")
        )
    ) {

        return {

            type: "text",

            text:
                `☎️ ${foundCinema.tenRap}\n\n` +

                `${foundCinema.soDienThoai}`
        };
    }

    /* =====================================
       HƯỚNG DẪN ĐẶT VÉ
    ===================================== */

    if (
        processedText.includes("dat ve")
    ) {

        return {
            type: "text",
            text:
                "Bạn có thể đặt vé theo các bước:\n\n" +
                "1. Chọn phim\n" +
                "2. Chọn suất chiếu\n" +
                "3. Chọn ghế\n" +
                "4. Thanh toán"
        };
    }

    /* =====================================
       MẶC ĐỊNH
    ===================================== */

    return null;
};

export default chatbotRules;
