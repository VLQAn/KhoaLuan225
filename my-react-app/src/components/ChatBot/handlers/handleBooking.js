import {
    parseTicketQuantity,
    isBookingRequest
} from "../helpers/chatbotBookingHelper";

import { bookingKeywords } from "../constants/bookingKeywords";

export const handleBooking = (text, movie, showtimes) => {

    if (!movie) return null;
    if (!showtimes) return null;

    const qty = parseTicketQuantity(text);

    if (!qty || !isBookingRequest(text, bookingKeywords)) {
        return null;
    }

    const matchedShowtimes = showtimes.filter(
        showtime =>
            showtime.maPhim === movie.maPhim &&
            new Date(showtime.thoiGianKetThuc) > new Date()
    );

    return {
        type: "showtime_query",
        text: `🎟️ Hiện ${movie.tieuDe} có các suất chiếu (yêu cầu ${qty} vé):`,
        showtimes: matchedShowtimes,
        nbTickets: qty
    };
};
