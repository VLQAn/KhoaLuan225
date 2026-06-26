import { useState, useEffect, useRef } from "react";
import { FaComments, FaPaperPlane, FaTimes } from "react-icons/fa";
import styles from "./ChatBot.module.css";
import chatbotRules from "./chatbotRules";
import { normalizeText, getDateLabel } from "./helpers/chatbotUtils";
import movieApi from "../../services/movieApi";
import khuyenMaiApi from "../../services/khuyenMaiApi";
import { useNavigate } from "react-router-dom";
import xuatChieuApi from "../../services/xuatChieuApi";
import chatBotService from "../../services/chatBotService";
import chatbotCheckoutApi from "../../services/chatbotCheckoutApi";

const s = styles;

const ChatBot = () => {
    const navigate = useNavigate();

    const [showtimes, setShowtimes] =
        useState([]);

    const messagesEndRef = useRef(null);

    const [open, setOpen] = useState(false);

    const [movies, setMovies] = useState([]);
    const [promotions, setPromotions] = useState([]);

    const [messages, setMessages] = useState([
        {
            sender: "bot",
            text: "Xin chào 👋 Tôi là RACSO BOT. Tôi có thể hỗ trợ bạn."
        }
    ]);

    const [input, setInput] = useState("");

    const [cinemas, setCinemas] =
        useState([]);

    const [bookingFlow, setBookingFlow] =
        useState(false);

    useEffect(() => {

        const saved =
            localStorage.getItem("chat_history");

        if (saved) {
            setMessages(JSON.parse(saved));
        }

    }, []);

    useEffect(() => {

        localStorage.setItem(
            "chat_history",
            JSON.stringify(messages)
        );

    }, [messages]);

    useEffect(() => {

        const loadData = async () => {

            try {
                const showtimeRes =
                    await xuatChieuApi.getAvailable();

                console.log(
                    "SHOWTIMES RAW:",
                    showtimeRes
                );

                console.log(
                    "IS ARRAY:",
                    Array.isArray(showtimeRes)
                );

                setShowtimes(showtimeRes || []);

                const movieRes =
                    await movieApi.getAllMovies();

                const promoRes =
                    await khuyenMaiApi.getAll();

                setMovies(
                    movieRes?.data?.data || []
                );

                setPromotions(
                    promoRes?.data?.data || []
                );

            } catch (err) {

                console.log(err);

            }

        };

        loadData();

    }, []);

    useEffect(() => {

        messagesEndRef.current?.scrollIntoView({
            behavior: "smooth"
        });

    }, [messages]);

    const isCancelBookingCommand = (text) => {
        const normalized = normalizeText(text);
        const cancelPhrases = [
            "huy",
            "huy dat ve",
            "thoat",
            "thoat dat ve",
            "khong dat nua",
            "bo",
            "bo dat ve",
            "huy dat",
            "bo dat",
            "dung lai",
            "dung lai dat ve"
        ];

        return cancelPhrases.some(phrase =>
            normalized.includes(phrase)
        );
    };

    const handleSend = async () => {

        if (!input.trim()) return;

        const messageText = input.trim();

        setInput("");

        const userMessage = {
            sender: "user",
            text: messageText
        };

        if (isCancelBookingCommand(messageText)) {
            const botMessage = {
                sender: "bot",
                type: "text",
                text: "🛑 Đã huỷ yêu cầu đặt vé. Bạn có thể gửi yêu cầu mới khi cần."
            };
            setMessages(prev => [
                ...prev,
                userMessage,
                botMessage
            ]);
            return;
        }

        let botResponse = null;

        if (!bookingFlow) {

            botResponse =
                chatbotRules(
                    messageText,
                    movies,
                    promotions,
                    showtimes,
                    cinemas
                );
        }

        if (botResponse) {

            const botMessage = {
                sender: "bot",
                ...botResponse
            };

            setMessages(prev => [
                ...prev,
                userMessage,
                botMessage
            ]);

            setInput("");

            return;
        }


        // Fallback AI
        try {

            console.log("CALLING OPENAI...");

            // If a prior bot message provided a requested ticket quantity, attach it to the outgoing message
            const lastBotWithQty = [...messages].slice().reverse().find(m => m.sender === "bot" && m.nbTickets);
            const messageToSend = lastBotWithQty
                ? `${messageText} (yêu cầu ${lastBotWithQty.nbTickets} vé)`
                : messageText;

            const aiReply =
                await chatBotService.askAI(messageToSend);

            console.log(
                "AI REPLY:",
                aiReply
            );

            if (aiReply.type === "movie_info") {

                setMessages(prev => [

                    ...prev,

                    userMessage,

                    {
                        sender: "bot",
                        type: "movie_info",
                        infoType: aiReply.infoType,
                        movie: aiReply.movie
                    }
                ]);
                setInput("");
                return;
            }

            if (aiReply.type === "booking_showtimes") {
                setBookingFlow(true);
                let text =
                    `${aiReply.reply}\n\n`;

                aiReply.showtimes.forEach(
                    (showtime, index) => {
                        text +=
                            `${index + 1}. ${new Date(
                                showtime.thoiGianBatDau
                            ).toLocaleString("vi-VN")}\n`;
                    }
                );

                text +=
                    "\n👉 Bạn muốn mình đặt vé cho suất chiếu nào.";

                // try to infer requested ticket quantity from the reply or the user's message
                const qtyMatch = (messageToSend || messageText).match(/(\d+)\s*vé|\(yêu cầu\s*(\d+)\s*vé\)/);
                const inferredQty = qtyMatch ? Number(qtyMatch[1] || qtyMatch[2]) : null;

                setMessages(prev => [
                    ...prev,
                    userMessage,
                    {
                        sender: "bot",
                        text,
                        nbTickets: inferredQty
                    }
                ]);
                setInput("");
                return;
            }

            if (
                aiReply.type ===
                "booking_invoice"
            ) {
                setMessages(prev => [

                    ...prev,

                    userMessage,

                    {
                        sender: "bot",

                        type: "booking_invoice",

                        invoiceId:
                            aiReply.invoiceId,

                        text:
                            aiReply.reply
                    }
                ]);

                return;
            }

            if (
                aiReply.type ===
                "smart_booking_checkout"
            ) {

                setMessages(prev => [

                    ...prev,

                    userMessage,

                    {
                        sender: "bot",

                        type:
                            "smart_booking_checkout",

                        movie:
                            aiReply.movie,

                        cinema:
                            aiReply.cinema,

                        showtime:
                            aiReply.showtime,

                        quantity:
                            aiReply.quantity,

                        seats:
                            aiReply.seats,

                        checkoutUrl:
                            aiReply.checkoutUrl,

                        text:
                            aiReply.reply
                    }
                ]);

                return;
            }

            if (aiReply.type === "booking" && aiReply.action === "select_movie") {
                setMessages(prev => [
                    ...prev,
                    userMessage,
                    {
                        sender: "bot",
                        text: aiReply.reply
                    }
                ]);

                setTimeout(() => {
                    navigate(`/movie/${aiReply.movieId}`);
                }, 1500);

                setInput("");
                return;
            }

            if (aiReply.type === "showtime_query") {

                const dateLabel =
                    getDateLabel(aiReply.date);

                let text =
                    dateLabel
                        ? `🎬 ${aiReply.movie.tieuDe} có các suất chiếu vào ${dateLabel} như sau:`
                        : `🎬 ${aiReply.movie.tieuDe} có các suất chiếu như sau:`;

                const MAX_SHOWTIME = 5;

                const firstFive = aiReply.showtimes.slice(0, MAX_SHOWTIME);

                setMessages(prev => [
                    ...prev,
                    userMessage,
                    {
                        sender: "bot",
                        type: "showtime_query",
                        text: text,
                        movie: aiReply.movie,
                        showtimes: firstFive,
                        allShowtimes: aiReply.showtimes,
                        expanded: false
                    }
                ]);
                return;
            }

            if (aiReply.type === "movie" && aiReply.movie) {
                const movie = {
                    maPhim: aiReply.movie.id,
                    tieuDe: aiReply.movie.title,
                    moTa: aiReply.movie.description,
                    daoDien: aiReply.movie.director,
                    dienVien: aiReply.movie.actors,
                    danhGia: aiReply.movie.rating,
                    thoiLuong: aiReply.movie.duration,
                    trangThai: aiReply.movie.status,
                    anhPoster: aiReply.movie.poster,
                    theLoai: aiReply.movie.genres || []
                };

                setMessages(prev => [
                    ...prev,
                    userMessage,
                    {
                        sender: "bot",
                        type: "movie",
                        movie
                    }
                ]);
                setInput("");
                return;
            }

            if (aiReply.type === "top_movies" && Array.isArray(aiReply.movies)) {

                const genreLabel = aiReply.genre ? ` ${aiReply.genre}` : "";

                if (aiReply.movies.length === 1) {
                    setMessages(prev => [
                        ...prev,
                        userMessage,
                        { sender: "bot", type: "movie", movie: aiReply.movies[0] }
                    ]);
                } else {
                    setMessages(prev => [
                        ...prev,
                        userMessage,
                        {
                            sender: "bot",
                            type: "movie_list",
                            title: `🔥 Top ${aiReply.limit || aiReply.movies.length} phim${genreLabel} đánh giá cao nhất`,
                            movies: aiReply.movies
                        }
                    ]);
                }

                setInput("");
                return;
            }

            if (
                aiReply.type === "recommendation" &&
                Array.isArray(aiReply.movies)
            ) {

                setMessages(prev => [
                    ...prev,
                    userMessage,
                    {
                        sender: "bot",
                        type: "recommendation",
                        title: aiReply.title,
                        movies: aiReply.movies
                    }
                ]);

                setInput("");

                return;
            }

            if (aiReply.type === "genre_filter") {

                if (!Array.isArray(aiReply.movies) || aiReply.movies.length === 0) {
                    setMessages(prev => [
                        ...prev,
                        userMessage,
                        {
                            sender: "bot",
                            text: aiReply.reply
                                || `😢 Hiện chưa có phim ${aiReply.genre} đang chiếu.`
                        }
                    ]);
                    setInput("");
                    return;
                }

                const title = aiReply.audience
                    ? `Hiện đang có các phim dành cho ${aiReply.audience} như`
                    : `Hiện đang có các phim ${aiReply.genre.toLowerCase()} như`;

                setMessages(prev => [
                    ...prev,
                    userMessage,
                    {
                        sender: "bot",
                        type: "movie_list",
                        title,
                        movies: aiReply.movies
                    }
                ]);
                setInput("");
                return;
            }

            if (
                aiReply.type === "rating_filter" &&
                Array.isArray(aiReply.movies)
            ) {

                setMessages(prev => [
                    ...prev,
                    userMessage,
                    {
                        sender: "bot",
                        type: "rating_filter",
                        min_rating: aiReply.min_rating,
                        movies: aiReply.movies
                    }
                ]);

                setInput("");

                return;
            }

            if (aiReply.type === "movie_not_found") {
                setMessages(prev => [
                    ...prev,
                    userMessage,
                    {
                        sender: "bot",
                        text: "Xin lỗi, tôi không tìm thấy một hoặc cả hai phim bạn nhắc đến. Bạn kiểm tra lại tên phim giúp tôi nhé."
                    }
                ]);
                setInput("");
                return;
            }

            if (aiReply.type === "comparison") {
                setMessages(prev => [
                    ...prev,
                    userMessage,
                    {
                        sender: "bot",
                        type: "comparison",
                        movie1: aiReply.movie1,
                        movie2: aiReply.movie2,
                        verdict: aiReply.verdict
                    }
                ]);
                setInput("");
                return;
            }

            setMessages(prev => [
                ...prev,
                userMessage,
                {
                    sender: "bot",
                    text: aiReply.reply
                }
            ]);
            setInput("");
        } catch (error) {

            console.error(error);

            const botMessage = {
                sender: "bot",
                text: "Xin lỗi, AI hiện đang bận."
            };

            setMessages(prev => [
                ...prev,
                userMessage,
                botMessage
            ]);
        }

        setInput("");
    };

    return (
        <>
            {!open && (
                <button
                    className={s.floatingBtn}
                    onClick={() => setOpen(true)}
                >
                    <FaComments />
                </button>
            )}

            {
                open && (
                    <div className={s.chatBox}>

                        <div className={s.header}>
                            <span>🎬 RACSO BOT</span>
                            <button
                                className={s.closeBtn}
                                onClick={() => setOpen(false)}
                            >
                                <FaTimes />
                            </button>
                        </div>

                        <div className={s.messages}>

                            {messages.map((msg, index) => (

                                <div
                                    key={index}
                                    className={
                                        msg.sender === "user"
                                            ? s.user
                                            : s.bot
                                    }
                                >
                                    {
                                        msg.type === "movie_list" ? (

                                            <div>

                                                <h4>{msg.title}</h4>

                                                {
                                                    msg.movies.map(movie => (

                                                        <div
                                                            key={movie.maPhim}
                                                            className={s.movieCard}
                                                            onClick={() => {

                                                                setOpen(false);

                                                                navigate(
                                                                    `/movie/${movie.maPhim}`
                                                                );

                                                            }}
                                                        >

                                                            <img
                                                                src={movie.anhPoster}
                                                                alt={movie.tieuDe}
                                                            />

                                                            <h4>
                                                                {movie.tieuDe}
                                                            </h4>

                                                            {movie.theLoai?.length > 0 && (
                                                                <p>🎭 {movie.theLoai.map(t => t.tenTheLoai).join(", ")}</p>
                                                            )}

                                                            <p>⏱ {movie.thoiLuong} phút</p>

                                                            {movie.danhGia && (
                                                                <p>⭐ {movie.danhGia}</p>
                                                            )}

                                                        </div>

                                                    ))
                                                }

                                            </div>

                                        ) : msg.type === "recommendation" ? (

                                            <div>

                                                <h4>{msg.title}</h4>

                                                <div className={s.movieCards}>

                                                    {msg.movies.map(movie => (

                                                        <div
                                                            key={movie.maPhim}
                                                            className={s.movieCard}
                                                            onClick={() => {

                                                                navigate(
                                                                    `/movie/${movie.maPhim}`
                                                                );

                                                                setOpen(false);

                                                            }}
                                                        >

                                                            <img
                                                                src={movie.anhPoster}
                                                                alt={movie.tieuDe}
                                                            />

                                                            <h4>{movie.tieuDe}</h4>

                                                            <p>
                                                                ⭐ {movie.danhGia}
                                                            </p>

                                                            <p>
                                                                ⏱ {movie.thoiLuong} phút
                                                            </p>

                                                        </div>

                                                    ))}

                                                </div>

                                            </div>

                                        ) : msg.type === "comparison" ? (

                                            <div className={s.comparisonCard}>

                                                <div className={s.comparisonRow}>
                                                    {[msg.movie1, msg.movie2].map(movie => (
                                                        <div
                                                            key={movie.maPhim}
                                                            className={s.movieCard}
                                                            onClick={() => {
                                                                setOpen(false);
                                                                navigate(`/movie/${movie.maPhim}`);
                                                            }}
                                                        >
                                                            <img src={movie.anhPoster} alt={movie.tieuDe} />
                                                            <h4>{movie.tieuDe}</h4>
                                                            <p>⭐ {movie.danhGia}</p>
                                                            <p>⏱ {movie.thoiLuong} phút</p>
                                                            <p>
                                                                🎭 {movie.theLoai?.map(t => t.tenTheLoai).join(", ")}
                                                            </p>
                                                        </div>
                                                    ))}
                                                </div>

                                                {msg.verdict && (
                                                    <p className={s.comparisonVerdict}>
                                                        👉 {msg.verdict}
                                                    </p>
                                                )}

                                            </div>

                                        ) : msg.type === "movie_info" ? (

                                            <div>
                                                <h4>{msg.movie.title}</h4>

                                                {
                                                    msg.infoType === "summary" && (
                                                        <p>
                                                            📝 {msg.movie.description}
                                                        </p>
                                                    )
                                                }

                                                {
                                                    msg.infoType === "director" && (
                                                        <p>
                                                            🎬 Đạo diễn:
                                                            {" "}
                                                            {msg.movie.director}
                                                        </p>
                                                    )
                                                }

                                                {
                                                    msg.infoType === "actor" && (
                                                        <p>
                                                            🎭 Diễn viên:
                                                            {" "}
                                                            {msg.movie.actors}
                                                        </p>
                                                    )
                                                }

                                                {
                                                    msg.infoType === "duration" && (
                                                        <p>
                                                            ⏱ Thời lượng: {msg.movie.duration} phút
                                                        </p>
                                                    )
                                                }

                                                {msg.infoType === "rating" && (
                                                    <p>
                                                        ⭐ Đánh giá: {msg.movie.rating}/10
                                                    </p>
                                                )}

                                            </div>

                                        ) : msg.type === "smart_booking_checkout" ? (

                                            <div className={s.checkoutCard}>

                                                <h4>
                                                    🎟️ Đã tìm thấy vé phù hợp
                                                </h4>

                                                <p>
                                                    🎬 {msg.cinema.tenRap}
                                                </p>

                                                <p>
                                                    🎞️ {msg.movie.tieuDe}
                                                </p>

                                                <p>
                                                    💺 {
                                                        msg.seats
                                                            .map(
                                                                seat =>
                                                                    `${seat.hangGhe}${seat.soGhe}`
                                                            )
                                                            .join(", ")
                                                    }
                                                </p>

                                                <button
                                                    className={s.checkoutBtn}
                                                    onClick={async () => {

                                                        try {

                                                            const res =
                                                                await chatbotCheckoutApi
                                                                    .getInfo(
                                                                        msg.invoiceId
                                                                    );

                                                            navigate(
                                                                "/checkout",
                                                                {
                                                                    state: {
                                                                        ...res.data,
                                                                        invoiceId:
                                                                            msg.invoiceId,
                                                                        chatbotBooking:
                                                                            true
                                                                    }
                                                                }
                                                            );

                                                            setOpen(false);

                                                        } catch (err) {

                                                            console.error(err);

                                                            alert(
                                                                "Không lấy được hóa đơn"
                                                            );
                                                        }

                                                    }}
                                                >
                                                    Xem thông tin đặt vé
                                                </button>

                                            </div>

                                        ) : msg.type === "booking_invoice" ? (

                                            <div className={s.checkoutCard}>

                                                <h4>
                                                    🎟️ Xác nhận đặt vé
                                                </h4>

                                                <p>
                                                    {msg.text}
                                                </p>

                                                <button

                                                    className={s.checkoutBtn}

                                                    onClick={async () => {

                                                        try {

                                                            const res =
                                                                await chatbotCheckoutApi.getInfo(
                                                                    msg.invoiceId
                                                                );

                                                            navigate(
                                                                "/checkout",
                                                                {
                                                                    state: {
                                                                        ...res.data,
                                                                        chatbotBooking: true
                                                                    }
                                                                }
                                                            );

                                                            setOpen(false);

                                                        } catch (err) {

                                                            console.error(err);

                                                            alert("Không lấy được thông tin checkout");
                                                        }

                                                    }}
                                                >

                                                    Xem thông tin đặt vé

                                                </button>

                                            </div>

                                        ) : msg.type === "showtime_query" ? (

                                            <div>

                                                <p className={s.showtimeTitle}>{msg.text}</p>

                                                <div className={s.showtimeCards}>

                                                    {
                                                        msg.showtimes.map((showtime, index) => {

                                                            const rap =
                                                                showtime.phong_chieu?.rap_chieu?.tenRap
                                                                || "Không rõ rạp";

                                                            const ngay =
                                                                new Date(showtime.thoiGianBatDau)
                                                                    .toLocaleDateString("vi-VN");

                                                            const gio =
                                                                new Date(showtime.thoiGianBatDau)
                                                                    .toLocaleTimeString(
                                                                        "vi-VN",
                                                                        {
                                                                            hour: "2-digit",
                                                                            minute: "2-digit"
                                                                        }
                                                                    );

                                                            return (

                                                                <div
                                                                    key={showtime.maXuatChieu}
                                                                    className={s.showtimeCard}
                                                                >

                                                                    <div className={s.showtimeIndex}>
                                                                        #{index + 1}
                                                                    </div>

                                                                    <div className={s.showtimeInfo}>

                                                                        <div className={s.showtimeTime}>
                                                                            🕒 {gio}
                                                                        </div>

                                                                        <div className={s.showtimeDate}>
                                                                            📅 {ngay}
                                                                        </div>

                                                                        <div className={s.showtimeCinema}>
                                                                            🎬 {rap}
                                                                        </div>

                                                                    </div>

                                                                    <button
                                                                        className={s.bookShowtimeBtn}
                                                                        onClick={() => {

                                                                            navigate(
                                                                                `/seat/${showtime.maXuatChieu}`
                                                                            );

                                                                            setOpen(false);

                                                                        }}
                                                                    >
                                                                        Đặt vé
                                                                    </button>

                                                                </div>

                                                            );
                                                        })
                                                    }

                                                </div>

                                                {/* NÚT XEM THÊM / THU GỌN */}
                                                {msg.allShowtimes?.length > 5 && (
                                                    <button
                                                        className={s.showMoreBtn}
                                                        onClick={() => {
                                                            setMessages(prev =>
                                                                prev.map(m => {
                                                                    if (m !== msg) return m;

                                                                    const isExpanded = m.expanded;

                                                                    return {
                                                                        ...m,
                                                                        expanded: !isExpanded,
                                                                        showtimes: isExpanded
                                                                            ? m.allShowtimes.slice(0, 5)
                                                                            : m.allShowtimes
                                                                    };
                                                                })
                                                            );
                                                        }}
                                                    >
                                                        {msg.expanded ? "Thu gọn" : "Xem thêm"}
                                                    </button>
                                                )}

                                                {
                                                    msg.hasMore && (
                                                        <button
                                                            className={s.showMoreBtn}
                                                            onClick={() => {

                                                                setMessages(prev =>
                                                                    prev.map(m => {

                                                                        if (m !== msg)
                                                                            return m;

                                                                        return {
                                                                            ...m,
                                                                            showtimes: m.allShowtimes,
                                                                            hasMore: false
                                                                        };
                                                                    })
                                                                );

                                                            }}
                                                        >
                                                            Xem thêm
                                                        </button>
                                                    )
                                                }

                                            </div>

                                        ) : msg.type === "rating_filter" ? (

                                            <div>
                                                <p>
                                                    ⭐ Các phim có điểm đánh giá từ {msg.min_rating} trở lên
                                                </p>

                                                <div className={s.movieCards}>
                                                    {msg.movies.map((movie) => (
                                                        <div
                                                            key={movie.maPhim}
                                                            className={s.movieCard}
                                                        >
                                                            <img
                                                                src={movie.anhPoster}
                                                                alt={movie.tieuDe}
                                                            />

                                                            <h4>{movie.tieuDe}</h4>

                                                            <p>⭐ {movie.danhGia}/10</p>

                                                            <p>{movie.thoiLuong} phút</p>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>

                                        ) : msg.type === "movie" ? (

                                            <div
                                                className={s.movieCard}
                                                onClick={() => {

                                                    setOpen(false);

                                                    navigate(
                                                        `/movie/${msg.movie.maPhim}`
                                                    );

                                                }}
                                            >

                                                <img
                                                    src={msg.movie.anhPoster}
                                                    alt={msg.movie.tieuDe}
                                                />

                                                <h4>
                                                    {msg.movie.tieuDe}
                                                </h4>

                                                <p>
                                                    🎭 Thể loại: {" "}
                                                    {
                                                        msg.movie.theLoai
                                                            ?.map(
                                                                t => t.tenTheLoai
                                                            )
                                                            .join(", ")
                                                    }
                                                </p>

                                                <p>
                                                    ⏱ {msg.movie.thoiLuong} phút
                                                </p>

                                                <p>
                                                    ⭐ {msg.movie.danhGia}
                                                </p>

                                                <p>
                                                    🎬 Đạo diễn: {" "}
                                                    {msg.movie.daoDien}
                                                </p>

                                                <p>
                                                    🎭 Diễn viên: {" "}
                                                    {
                                                        msg.movie.dienVien?.length > 60
                                                            ? msg.movie.dienVien.slice(0, 60) + "..."
                                                            : msg.movie.dienVien
                                                    }
                                                </p>

                                                <p>
                                                    📝 {" "}
                                                    {
                                                        msg.movie.moTa?.length > 120
                                                            ? msg.movie.moTa.slice(0, 120) + "..."
                                                            : msg.movie.moTa
                                                    }
                                                </p>

                                                <span className={s.viewDetail}>
                                                    Xem chi tiết →
                                                </span>

                                                {
                                                    msg.movie.trangThai === "dang_chieu" && (

                                                        <button
                                                            className={s.bookBtn}
                                                            onClick={(e) => {

                                                                e.stopPropagation();

                                                                navigate(
                                                                    `/seat/${msg.movie.maPhim}`
                                                                );

                                                            }}
                                                        >
                                                            Đặt vé ngay
                                                        </button>

                                                    )
                                                }

                                            </div>

                                        ) : (

                                            msg.text

                                        )
                                    }

                                </div>

                            ))}
                            <div ref={messagesEndRef} />

                        </div>

                        <div className={s.inputArea}>

                            <input
                                type="text"
                                value={input}
                                placeholder="Nhập tin nhắn..."
                                onChange={(e) =>
                                    setInput(e.target.value)
                                }
                                onKeyDown={(e) =>
                                    e.key === "Enter" &&
                                    handleSend()
                                }
                            />

                            <button
                                onClick={handleSend}
                            >
                                <FaPaperPlane />
                            </button>

                        </div>

                    </div>
                )
            }
        </>
    );
};

export default ChatBot;
