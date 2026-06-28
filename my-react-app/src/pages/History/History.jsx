import { MdMovie, MdLocationOn, MdAccessTime, MdEventSeat } from "react-icons/md";
import { useEffect, useState } from "react";
import historyApi from "../../services/historyApi";
import styles from "./History.module.css";
import { useNavigate } from "react-router-dom";

const s = styles;

// "20:00 - 28/06/2026" -> Date
const parseShowtime = (str) => {
  if (!str) return null;
  const match = str.match(/(\d{1,2}):(\d{2})\s*-\s*(\d{1,2})\/(\d{1,2})\/(\d{4})/);
  if (!match) return null;
  const [, hour, minute, day, month, year] = match;
  return new Date(year, month - 1, day, hour, minute);
};

const getStatusText = (status) => {
  switch (status) {
    case "Dang_Thanh_Toan":
      return "Đang thanh toán";
    case "Da_Thanh_Toan":
      return "Đã thanh toán";
    case "Da_Huy":
      return "Đã hủy";
    case "Het_Han":
      return "Đã hết hạn";
    default:
      return status;
  }
};

const History = () => {
  const navigate = useNavigate();
  const [history, setHistory] = useState([]);
  const [cancelingId, setCancelingId] = useState(null);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const response = await historyApi.getHistory();
      setHistory(response?.data || []);
    } catch (error) {
      console.error(error);
    }
  };

  const handleCancelTicket = async (item) => {
    const confirmed = window.confirm(
      `Bạn có chắc muốn hủy vé phim "${item.movie}" không? Hành động này không thể hoàn tác.`
    );
    if (!confirmed) return;

    setCancelingId(item.id);
    try {
      await historyApi.cancelTicket(item.id);

      setHistory((prev) =>
        prev.map((h) =>
          h.id === item.id ? { ...h, status: "Da_Huy" } : h
        )
      );
    } catch (error) {
      const message =
        error?.response?.data?.message ||
        "Hủy vé không thành công. Vui lòng thử lại sau.";
      alert(message);
      console.error(error);
    } finally {
      setCancelingId(null);
    }
  };

  const renderActionButton = (item, isPast) => {
    if (item.status === "Da_Huy" || item.status === "Het_Han") {
      return <button disabled>{item.status === "Het_Han" ? "Đã hết hạn" : "Đã hủy"}</button>;
    }

    if (item.status === "Da_Huy") {
      return <button disabled>Đã hủy</button>;
    }

    // Đã thanh toán + qua giờ chiếu -> coi như đã xem, cho đánh giá
    if (item.status === "Da_Thanh_Toan" && isPast) {
      return (
        <button onClick={() => navigate(`/review/${item.id}`, { state: item })}>
          {item.reviewed ? "Đã đánh giá" : "Đánh giá"}
        </button>
      );
    }

    // Đã đặt (đã thanh toán) và chưa đến giờ chiếu -> được hủy
    if (item.status === "Da_Thanh_Toan" && !isPast) {
      return (
        <button
          className={s.btn_cancel}
          disabled={cancelingId === item.id}
          onClick={() => handleCancelTicket(item)}
        >
          {cancelingId === item.id ? "Đang hủy..." : "Hủy vé"}
        </button>
      );
    }

    // Đang thanh toán (chưa hoàn tất) -> chưa cho hủy ở đây
    if (item.status === "Dang_Thanh_Toan") {
      return <button disabled>Chưa hoàn tất thanh toán</button>;
    }

    return <button disabled>Không khả dụng</button>;
  };

  return (
    <div className={s.container}>
      <h1 className={s.title}>Lịch sử đặt vé</h1>

      <div className={s.history_list}>
        {history.map((item) => {
          const showDate = parseShowtime(item.time);
          const isPast = showDate ? showDate.getTime() <= Date.now() : false;

          return (
            <div key={item.id} className={s.history_card}>
              <img src={item.poster} alt={item.movie} className={s.poster} />
              <div className={s.left}>
                <h3>{item.movie}</h3>
                <p>
                  <MdMovie className={s.icon} />
                  {item.cinema}
                </p>
                <p>
                  <MdLocationOn className={s.icon} />
                  {item.add}
                </p>
                <p>
                  <MdAccessTime className={s.icon} />
                  {item.time}
                </p>
                <p>
                  <MdEventSeat className={s.icon} />
                  {item.seats?.join(", ")}
                </p>
                {item.food?.length > 0 && (
                  <p>Bắp nước: {item.food.join(", ")}</p>
                )}
              </div>

              <div className={s.right}>
                <h4>{Number(item.total).toLocaleString("vi-VN")}đ</h4>
                <span
                  className={`${s.status} ${item.status === "Da_Thanh_Toan"
                    ? isPast
                      ? s.status_watched
                      : s.status_paid
                    : item.status === "Dang_Thanh_Toan"
                      ? s.status_pending
                      : s.status_cancel
                    }`}
                >
                  {getStatusText(item.status)}
                </span>
                {renderActionButton(item, isPast)}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default History;
