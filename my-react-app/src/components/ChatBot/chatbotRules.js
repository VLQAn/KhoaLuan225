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

    const extractMovieQuery = (text) => {
        let query = text;

        [
            "la phim gi",
            "phim gi",
            "phim la gi",
            "la gi",
            "thong tin phim",
            "thong tin",
            "la phim",
            "noi dung phim",
            "noi dung",
            "mo ta",
            "tom tat",
            "dao dien",
            "dien vien",
            "phim nay la gi"
        ].forEach(pattern => {
            query = query.replaceAll(pattern, "");
        });

        return query
            .trim()
            .replace(/\s+/g, " ");
    };

    const detectMovieInfoType = (text) => {
        const normalized = normalizeText(text);

        if (
            normalized.includes("noi dung") ||
            normalized.includes("mo ta") ||
            normalized.includes("tom tat")
        ) {
            return "summary";
        }

        if (normalized.includes("dao dien")) {
            return "director";
        }

        if (
            normalized.includes("dien vien") ||
            normalized.includes("ai dong")
        ) {
            return "actor";
        }

        return null;
    };

    const findMovieByKeyword = (
        text,
        movies
    ) => {

        const normalizedText =
            normalizeText(text).trim();

        if (!normalizedText) {
            return null;
        }

        const moviePhrase =
            normalizedText
                .replace(/\s+/g, " ");

        const exactMatch =
            movies.find(movie =>
                normalizeText(movie.tieuDe).includes(
                    moviePhrase
                )
            );

        if (exactMatch) {
            return exactMatch;
        }

        const queryWords =
            moviePhrase.split(" ").filter(Boolean);

        let bestMatch = null;
        let bestScore = 0;

        movies.forEach(movie => {
            const movieName =
                normalizeText(movie.tieuDe);

            const movieWords =
                movieName.split(" ");

            const score = queryWords.reduce(
                (count, word) =>
                    movieWords.includes(word)
                        ? count + 1
                        : count,
                0
            );

            if (score > bestScore) {
                bestScore = score;
                bestMatch = movie;
            }
        });

        return bestScore >= 2 ? bestMatch : null;
    };

    const detectMovieDetailQuery = (text) => {
        const normalized = normalizeText(text).trim();

        return (
            normalized.includes("la phim gi") ||
            normalized.includes("phim gi") ||
            normalized.includes("phim la gi") ||
            normalized.includes("thong tin phim") ||
            normalized.includes("thong tin")
        );
    };

    const isMovieTitleQuery = (text, movie) => {
        if (!movie) return false;

        const normalizedText = normalizeText(text).trim();
        const movieName = normalizeText(movie.tieuDe).trim();

        if (!normalizedText || !movieName) return false;

        return (
            normalizedText === movieName ||
            movieName.includes(normalizedText) ||
            normalizedText.includes(movieName)
        );
    };

    const movieInfoQuery =
        extractMovieQuery(originalText);

    const movieInfoType =
        detectMovieInfoType(originalText);

    const movie =
        findMovieByKeyword(
            movieInfoQuery,
            movies
        );

    if (movie) {
        if (movieInfoType) {
            return {
                type: "movie_info",
                infoType: movieInfoType,
                movie: {
                    title: movie.tieuDe,
                    description: movie.moTa,
                    director: movie.daoDien,
                    actors: movie.dienVien
                }
            };
        }

        if (
            detectMovieDetailQuery(originalText) ||
            isMovieTitleQuery(originalText, movie)
        ) {
            return {
                type: "movie",
                movie
            };
        }
    }

    /* =====================================
       NHẬN DIỆN ĐẶT VÉ KÈM SỐ LƯỢNG
    ===================================== */
    const parseTicketQuantity = (text) => {
        const normalized = normalizeText(text);

        // Match digits like '2 vé' or '2 ve'
        const digitMatch = normalized.match(/(\d+)\s*(ve|vé)*/);
        if (digitMatch) return Number(digitMatch[1]);

        // Vietnamese words map
        const wordsMap = {
            'một': 1, 'mot': 1,
            'hai': 2, 'ba': 3,
            'bốn': 4, 'bon': 4,
            'năm': 5, 'nam': 5,
            'sáu': 6, 'sau': 6,
            'bảy': 7, 'bay': 7,
            'tám': 8, 'tam': 8,
            'chín': 9, 'chin': 9,
            'mười': 10, 'muoi': 10
        };

        for (const [k, v] of Object.entries(wordsMap)) {
            if (normalized.includes(k + " ve") || normalized.includes(k + " vé") || normalized.includes(k + " ve")) {
                return v;
            }
        }

        return null;
    };

    const qty = parseTicketQuantity(originalText);

    const isBookingRequest = () => {
        const normalized = originalText;

        // direct keyword matches
        if (bookingKeywords.some(k => normalized.includes(k))) return true;

        // patterns like 'dat ... ve' or 'dat 2 ve' or 'dat 2'
        if (/dat\s+.*ve/.test(normalized)) return true;
        if (/dat\s+\d+/.test(normalized)) return true;

        // contains both 'dat' and 've' in any order
        if (normalized.includes('dat') && normalized.includes('ve')) return true;

        return false;
    };

    if (qty && isBookingRequest()) {
        // if movie identified above, return showtime list for that movie
        const matchedMovie = movie;

        if (matchedMovie) {
            const matchedShowtimes = showtimes.filter(s => s.maPhim === matchedMovie.maPhim && new Date(s.thoiGianKetThuc) > new Date());

            const textReply = `🎟️ Hiện ${matchedMovie.tieuDe} có các suất chiếu (yêu cầu ${qty} vé):`;

            return {
                type: "showtime_list",
                text: textReply,
                showtimes: matchedShowtimes,
                nbTickets: qty
            };
        }
    }

    if (intent === "recommendation") {

        const genreKeywords = [
            "hanh dong", "phieu luu", "khoa hoc vien tuong", "vien tuong",
            "kinh di", "tam ly", "tinh cam", "hai", "hoat hinh", "gia dinh",
            "bi an", "trinh tham", "tai lieu", "chien tranh", "lich su",
            "am nhac", "the thao", "vien tay", "than thoai", "sieu anh hung",
            "anime", "hoc duong", "chinh kich", "toi pham", "sinh ton",
            "gia tuong", "lang man", "teen", "zombie", "tham hoa", "vo thuat"
        ];

        const hasNumber = /\d/.test(originalText);
        const hasGenre = genreKeywords.some(g => originalText.includes(g));

        // Có số lượng cụ thể hoặc nhắc thể loại => để AI backend xử lý
        // (AI mới hiểu được kết hợp limit + genre)
        if (!hasNumber && !hasGenre) {

            const bestMovies =
                movies
                    .filter(movie => movie.trangThai === "dang_chieu")
                    .sort((a, b) => Number(b.danhGia || 0) - Number(a.danhGia || 0));

            return {
                type: "movie_list",
                title: "⭐ Phim đáng xem hôm nay",
                movies: bestMovies.slice(0, 5)
            };
        }

        // ngược lại: rơi xuống cuối hàm, return null, nhường cho AI
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

    const containsMovieTitle = (
        text,
        movies
    ) => {
        const normalizedText =
            normalizeText(text);

        return movies.some(movie => {
            const movieName =
                normalizeText(movie.tieuDe || "");

            return (
                movieName &&
                normalizedText.includes(movieName)
            );
        });
    };

    /* =====================================
       HƯỚNG DẪN ĐẶT VÉ
    ===================================== */

    if (
        processedText.includes("dat ve") &&
        !containsMovieTitle(originalText, movies)
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
