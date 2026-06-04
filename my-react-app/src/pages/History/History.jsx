import { MdMovie, MdLocationOn, MdAccessTime, MdEventSeat } from "react-icons/md";

import { useEffect, useState } from "react";
import historyApi from "../../services/historyApi";
import styles from "./History.module.css";

import { useNavigate } from "react-router-dom";

const s = styles;

const History = () => {
  const navigate = useNavigate();
  const [history, setHistory] = useState([]);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {

    try {

      const response =
        await historyApi.getHistory();

      console.log(response);

      setHistory(
        response?.data || []
      );
    }
    catch (error) {

      console.error(error);
    }
  };

  const getStatusText = (status) => {

    switch (status) {

      case "Dang_Thanh_Toan":
        return "Đã thanh toán";

      case "Da_Xem":
        return "Đã xem phim";

      case "Da_Huy":
        return "Đã hủy";

      default:
        return status;
    }
  };

  return (
    <div className={s.container}>
      <h1 className={s.title}>Lịch sử đặt vé</h1>

      <div className={s.history_list}>
        {history.map((item) => (
          <div key={item.id} className={s.history_card}>
            <img
              src={item.poster}
              alt={item.movie}
              className={s.poster}
            />
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
                {item.seats.join(", ")}
              </p>
            </div>

            <div className={s.right}>
              <h4>
                {Number(item.total)
                  .toLocaleString("vi-VN")}đ
              </h4>
              <span
                className={`${s.status}
  ${item.status === "Dang_Thanh_Toan"
                    ? s.status_paid
                    : item.status === "Da_Xem"
                      ? s.status_watched
                      : s.status_cancel
                  }`}
              >
                {getStatusText(item.status)}
              </span>
              {
                item.status === "Đã xem phim" ? (
                  <button
                    onClick={() =>
                      navigate(`/review/${item.id}`, {
                        state: item,
                      })
                    }
                  >
                    {item.reviewed ? "Đã đánh giá" : "Đánh giá"}
                  </button>
                ) : (
                  <button disabled>
                    Không khả dụng
                  </button>
                )
              }
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default History;