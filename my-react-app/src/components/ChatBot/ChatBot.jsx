import { useState, useEffect } from "react";
import { FaComments, FaPaperPlane } from "react-icons/fa";
import styles from "./ChatBot.module.css";
import chatbotRules from "./chatbotRules";
import movieApi from "../../services/movieApi";
import khuyenMaiApi from "../../services/khuyenMaiApi";
import { useNavigate } from "react-router-dom";

const s = styles;

const ChatBot = () => {
    const navigate = useNavigate();

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

    const handleSend = () => {

        if (!input.trim()) return;

        const userMessage = {
            sender: "user",
            text: input
        };

        const botResponse =
            chatbotRules(
                input,
                movies,
                promotions
            );

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
                                        msg.type === "movie"
                                            ? (
                                                <div className={s.movieCard}
                                                    onClick={() => {

                                                        setOpen(false);

                                                        navigate(
                                                            `/movie/${msg.movie.maPhim}`
                                                        );

                                                    }}>

                                                    <img
                                                        src={msg.movie.anhPoster}
                                                        alt={msg.movie.tieuDe}
                                                    />

                                                    <h4>
                                                        {msg.movie.tieuDe}
                                                    </h4>

                                                    <p>
                                                        🎭 Thể loại:
                                                        {" "}
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
                                                        🎬 Đạo diễn:
                                                        {" "}
                                                        {msg.movie.daoDien}
                                                    </p>

                                                    <p>
                                                        🎭 Diễn viên:
                                                        {" "}
                                                        {
                                                            msg.movie.dienVien?.length > 60
                                                                ? msg.movie.dienVien.slice(0, 60) + "..."
                                                                : msg.movie.dienVien
                                                        }
                                                    </p>

                                                    <p>
                                                        📝
                                                        {" "}
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
                                                        msg.movie.trangThai ===
                                                        "dang_chieu" && (

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
                                            )
                                            : msg.text
                                    }

                                </div>

                            ))}

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
