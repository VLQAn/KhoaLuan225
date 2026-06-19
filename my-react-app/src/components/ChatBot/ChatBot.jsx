import { useState, useEffect, useRef } from "react";
import { FaComments, FaPaperPlane } from "react-icons/fa";
import styles from "./ChatBot.module.css";
import chatbotRules from "./chatbotRules";
import { normalizeText } from "./chatbotUtils";
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

        const botResponse =
            chatbotRules(
                messageText,
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
                "booking_checkout"
            ) {

                setMessages(prev => [

                    ...prev,

                    userMessage,

                    {
                        sender: "bot",

                        type:
                            "booking_checkout",

                        showtimeId:
                            aiReply.showtimeId,

                        selectedSeats:
                            aiReply.selectedSeats,

                        quantity:
                            aiReply.quantity,

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
                                                                        `/seat/${showtime.maXuatChieu}?qty=${msg.nbTickets || 1}`
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

                                            </div>

                                        ) : msg.type === "booking_checkout" ? (

                                            <div className={s.checkoutCard}>

                                                <h4>
                                                    🎟️ Xác nhận đặt vé
                                                </h4>

                                                <p>
                                                    Ghế:
                                                    {msg.selectedSeats.join(", ")}
                                                </p>

                                                <button

                                                    className={s.checkoutBtn}

                                                    onClick={async () => {

                                                        try {

                                                            const res =
                                                                await chatbotCheckoutApi.getInfo();

                                                            navigate(
                                                                "/checkout",
                                                                {
                                                                    state:
                                                                        res.data
                                                                }
                                                            );

                                                            setOpen(false);

                                                        } catch (err) {

                                                            console.error(err);

                                                            alert(
                                                                "Không lấy được thông tin checkout"
                                                            );
                                                        }
                                                    }}
                                                >

                                                    Xem thông tin đặt vé

                                                </button>

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
