import styles from "./Review.module.css";

import {
    MdMovie,
    MdLocationOn,
    MdAccessTime,
    MdEventSeat,
} from "react-icons/md";

import { FaStar } from "react-icons/fa";

import { useLocation } from "react-router-dom";
import { useState } from "react";

const s = styles;

const Review = () => {

    const { state } = useLocation();

    const [movieStar, setMovieStar] = useState(0);
    const [serviceStar, setServiceStar] = useState(0);
    const [foodStar, setFoodStar] = useState(0);

    const [comment, setComment] = useState("");

    const renderStars = (value, setValue) => {

        return [...Array(5)].map((_, i) => (

            <FaStar
                key={i}
                className={
                    i < value ? s.active_star : s.star
                }
                onClick={() => setValue(i + 1)}
            />

        ));
    };

    const handleSubmit = () => {

        alert("Đánh giá thành công!");
    };

    return (

        <div className={s.container}>

            <div className={s.card}>

                {/* LEFT */}
                <div className={s.left}>

                    <div className={s.poster}>
                        <img src={state.poster} alt="" />
                    </div>

                    <div className={s.ticket_content}>

                        <h2>{state.movie}</h2>

                        <p>
                            <MdMovie />
                            {state.cinema}
                        </p>

                        <p>
                            <MdLocationOn />
                            {state.add}
                        </p>

                        <p>
                            <MdAccessTime />
                            {state.time}
                        </p>

                        <p>
                            <MdEventSeat />
                            {state.seats.join(", ")}
                        </p>

                    </div>

                </div>

                {/* RIGHT */}
                <div className={s.right}>

                    <h1>Đánh giá phim</h1>

                    <div className={s.review_item}>
                        <h3>Chất lượng phim</h3>

                        <div className={s.stars}>
                            {renderStars(movieStar, setMovieStar)}
                        </div>
                    </div>

                    <div className={s.review_item}>
                        <h3>Chất lượng dịch vụ</h3>

                        <div className={s.stars}>
                            {renderStars(serviceStar, setServiceStar)}
                        </div>
                    </div>

                    {
                        state.food.length > 0 && (
                            <div className={s.review_item}>
                                <h3>Chất lượng đồ ăn</h3>

                                <div className={s.stars}>
                                    {renderStars(foodStar, setFoodStar)}
                                </div>
                            </div>
                        )
                    }

                    <textarea
                        placeholder="Nhập đánh giá của bạn..."
                        value={comment}
                        onChange={(e) =>
                            setComment(e.target.value)
                        }
                    />

                    <button onClick={handleSubmit}>
                        Gửi đánh giá
                    </button>

                </div>

            </div>

        </div>
    );
};

export default Review;