import { MdMovie, MdLocationOn, MdAccessTime, MdEventSeat } from "react-icons/md";

import { useState } from "react";
import styles from "./History.module.css";

const s = styles;

const data = [
  {
    movie: "Avengers: Endgame",
    cinema: "CGV Vincom ",
    add: "Tầng Trệt (tầng 1), Trung tâm thương mại GO! (Big C cũ), Lô số 4, đường 19/5, Khu đô thị Vĩnh Điềm Trung, Xã Vĩnh Hiệp, TP. Nha Trang, Tỉnh Khánh Hòa.",
    time: "19:30 - 25/04/2026",
    seats: ["A1", "A2"],
    total: 180000,
    status: "Đã thanh toán",
  },

  {
    movie: "Deadpool 2",
    cinema: "Galaxy Nha Trang",
    add: "Tầng 3, TTTM Nha Trang Center - Số 20 Trần Phú, Phường Nha Trang, Tỉnh Khánh Hòa",
    time: "19:30 - 21/08/2025",
    seats: ["D10", "D11", "D12"],
    total: 240000,
    status: "Đã hủy",
  },
];

const History = () => {
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
              <span className={s.status}>{item.status}</span>
              <button>Đánh giá</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default History;