import {
  MdContentCopy,
  MdLocalOffer,
  MdAccessTime
} from "react-icons/md";

import {
  useEffect,
  useState
} from "react";

import dealApi from "../../services/dealApi";
import styles from "./Deal.module.css";

const s = styles;

function Deal() {

  const [deals, setDeals] =
    useState([]);

  useEffect(() => {

    fetchDeals();

  }, []);

  const fetchDeals = async () => {

    try {

      const response =
        await dealApi.getAll();

      console.log("Response:", response);
      console.log("Type:", typeof response);
      console.log("Is Array:", Array.isArray(response));

      console.log(response);

      setDeals(response || []);

    }
    catch (error) {

      console.error(error);

    }
  };

  const copyCode = (code) => {

    navigator.clipboard
      .writeText(code);

    alert(
      `Đã sao chép mã: ${code}`
    );
  };

  return (
    <div className={s.container}>

      <h1 className={s.title}>
        Khuyến mãi
      </h1>

      <div className={s.list}>

        {deals.map((deal) => (

          <div
            key={
              deal.maKhuyenMai
            }
            className={s.card}
          >

            <div className={s.header}>

              <MdLocalOffer
                className={s.icon}
              />

              <span>
                Mã giảm giá
              </span>

            </div>

            <h2 className={s.code}>
              {deal.maCode}
            </h2>

            <p className={s.content}>
              {deal.noiDung}
            </p>

            <div className={s.discount}>
              Giảm {parseInt(deal.giaKhuyenMai)}%
            </div>

            <div className={s.time}>

              <MdAccessTime />

              <span>

                {
                  new Date(
                    deal.ngayBatDau
                  ).toLocaleDateString(
                    "vi-VN"
                  )
                }

                {" - "}

                {
                  new Date(
                    deal.thoiHan
                  ).toLocaleDateString(
                    "vi-VN"
                  )
                }

              </span>

            </div>

            <button
              className={s.copy_btn}
              onClick={() =>
                copyCode(
                  deal.maCode
                )
              }
            >
              <MdContentCopy />

              Sao chép mã
            </button>

          </div>

        ))}

      </div>

    </div>
  );
}

export default Deal;
