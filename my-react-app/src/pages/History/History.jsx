import { MdMovie, MdLocationOn, MdAccessTime, MdEventSeat } from "react-icons/md";

import { useState } from "react";
import styles from "./History.module.css";

import { useNavigate } from "react-router-dom";

const s = styles;

const data = [
  {
    id: 1,
    movie: "Avengers: Endgame",
    poster: "https://i.pinimg.com/1200x/0d/af/73/0daf73d3471efc7ae0392b9255773ee9.jpg",
    cinema: "CGV Vincom",
    add: "Nha Trang",
    time: "19:30 - 25/04/2026",
    seats: ["A1", "A2"],
    food: ["Bắp", "Pepsi"],
    total: 180000,
    status: "Đã xem phim",
    reviewed: false,
  },

  {
    id: 2,
    movie: "Deadpool 2",
    cinema: "Galaxy Nha Trang",
    add: "Nha Trang",
    time: "19:30 - 21/08/2025",
    seats: ["D10", "D11", "D12"],
    food: [],
    total: 240000,
    status: "Đã hủy",
    reviewed: false,
  },

  {
    id: 3,
    movie: "Spider-Man",
    cinema: "CGV",
    add: "Đà Nẵng",
    time: "20:00 - 15/06/2026",
    seats: ["B5"],
    food: ["Combo đôi"],
    total: 150000,
    status: "Đã thanh toán",
    reviewed: false,
  },
];

const History = () => {
  const navigate = useNavigate();

  return (
    <div className={s.container}>
      <h1 className={s.title}>Lịch sử đặt vé</h1>

      <div className={s.history_list}>
        {data.map((item, i) => (
          <div key={i} className={s.history_card}>
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
              <h4>{item.total.toLocaleString()}đ</h4>
              <span
                className={`${s.status}
  ${item.status === "Đã thanh toán"
                    ? s.status_paid
                    : item.status === "Đã xem phim"
                      ? s.status_watched
                      : s.status_cancel
                  }`}
              >
                {item.status}
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