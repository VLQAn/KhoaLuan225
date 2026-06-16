import { useState, useEffect, useRef } from "react";
import { FaComments, FaPaperPlane } from "react-icons/fa";
import styles from "./ChatBot.module.css";
import chatbotRules from "./chatbotRules";
import movieApi from "../../services/movieApi";
import khuyenMaiApi from "../../services/khuyenMaiApi";
import { useNavigate } from "react-router-dom";
import xuatChieuApi from "../../services/xuatChieuApi";
import chatBotService from "../../services/chatBotService";

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

    const handleSend = async () => {

        if (!input.trim()) return;

        const userMessage = {
            sender: "user",
            text: input
        };

        const botResponse =
            chatbotRules(
                input,
                movies,
                promotions,
                showtimes,
                cinemas
            );

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

            const aiReply =
                await chatBotService.askAI(input);

            if (
                aiReply.type ===
                "booking_showtimes"
            ) {

                setMessages(prev => [
                    ...prev,
                    userMessage,
                    {
                        sender: "bot",
                        type: "showtime_list",
                        text:
                            `🎟️ Chọn suất chiếu phim ${aiReply.movieTitle}`,
                        showtimes:
                            aiReply.showtimes
                    }
                ]);

                setInput("");

                return;
            }

            if (
                aiReply.type === "booking" &&
                aiReply.action === "select_movie"
            ) {

                setMessages(prev => [
                    ...prev,
                    userMessage,
                    {
                        sender: "bot",
                        text: aiReply.reply
                    }
                ]);

                setTimeout(() => {

                    navigate(
                        `/movie/${aiReply.movieId}`
                    );

                }, 1500);

                setInput("");

                return;
            } {

                setMessages(prev => [
                    ...prev,
                    userMessage,
                    {
                        sender: "bot",
                        text: aiReply.reply
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
            <button
                className={s.floatingBtn}
                onClick={() => setOpen(!open)}
            >
                <FaComments />
            </button>

            {
                open && (
                    <div className={s.chatBox}>

                        <div className={s.header}>
                            🎬 RACSO BOT
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
                                        msg.type === "showtime_list" ? (

                                            <div>

                                                <h4>
                                                    {msg.text}
                                                </h4>

                                                <div className={s.showtimeList}>

                                                    {
                                                        msg.showtimes.map(showtime => (

                                                            <button
                                                                key={showtime.maXuatChieu}
                                                                className={s.showtimeBtn}
                                                                onClick={() => {

                                                                    navigate(
                                                                        `/seat/${showtime.maXuatChieu}`
                                                                    );

                                                                    setOpen(false);
                                                                }}
                                                            >
                                                                {
                                                                    new Date(
                                                                        showtime.thoiGianBatDau
                                                                    ).toLocaleString("vi-VN")
                                                                }
                                                            </button>

                                                        ))
                                                    }

                                                </div>

                                            </div>

                                        ) : msg.type === "movie_list" ? (

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

                                                            <p>
                                                                🎭 {
                                                                    movie.theLoai
                                                                        ?.map(
                                                                            t => t.tenTheLoai
                                                                        )
                                                                        .join(", ")
                                                                }
                                                            </p>

                                                            <p>
                                                                ⏱ {movie.thoiLuong} phút
                                                            </p>

                                                        </div>

                                                    ))
                                                }

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
                                                                    `/showtime/${msg.movie.maPhim}`
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
