import {
    parseTicketQuantity,
    isBookingRequest
} from "../helpers/chatbotBookingHelper";

export const handleBooking = (
    text,
    movie,
    showtimes
) => {
    if (!movie) return null;
    if (!showtimes) return null;
    if (!isBookingRequest(message)) return null;

    const qty =
        parseTicketQuantity(text);

    if (
        !qty ||
        !isBookingRequest(text)
    ) {
        return null;
    }

    if (!movie) {

        return {

            type: "text",

            text:
                "🎟️ Bạn muốn đặt vé phim nào?"
        };
    }

    const matchedShowtimes =
        showtimes.filter(
            showtime =>

                showtime.maPhim ===
                movie.maPhim

                &&

                new Date(
                    showtime.thoiGianKetThuc
                ) > new Date()
        );

    return {

        type: "showtime_list",

        text:
            `🎟️ Hiện ${movie.tieuDe} có các suất chiếu (yêu cầu ${qty} vé):`,

        showtimes:
            matchedShowtimes,

        nbTickets:
            qty
    };
};
