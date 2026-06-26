import { normalizeText } from "./helpers/chatbotUtils";

import { detectIntent } from "./detectors/chatbotIntents";
import { detectDate } from "./detectors/chatbotDate";
import { detectCinema, findCinema } from "./detectors/chatbotCinema";
import { detectTimePeriod } from "./detectors/chatbotTime";
import { detectGenre } from "./detectors/chatbotGenre";
import { isMovieDiscoveryQuery } from "./detectors/chatbotMovieDiscovery";
import { shouldUseAIRecommendation } from "./detectors/chatbotRecommendationAI";
import { detectMovieInfo } from "./detectors/chatbotMovieInfo";

import { findMovieByKeyword } from "./helpers/chatbotMovieHelper";

import { handleIntent } from "./handlers/handleIntent";
import { handleMovieInfo } from "./handlers/handleMovieInfo";
import { handleMovieShowtime } from "./handlers/handleMovieShowtime";
import { handleMovieFilter } from "./handlers/handleMovieFilter";
import { handleBooking } from "./handlers/handleBooking";
import { handleCinemaInfo } from "./handlers/handleCinemaInfo";
import { handleBookingGuide } from "./handlers/handleBookingGuide";

const chatbotRules = (
    message,
    movies,
    promotions,
    showtimes,
    cinemas
) => {

    /* =====================================
       1. NORMALIZE
    ===================================== */

    const originalText = normalizeText(message);

    /* =====================================
       2. DETECTORS
    ===================================== */

    const intent =
        detectIntent(originalText);

    const detectedDate =
        detectDate(originalText);

    const detectedTimePeriod =
        detectTimePeriod(originalText);

    const detectedCinema =
        detectCinema(
            originalText,
            showtimes
        );

    const detectedGenre =
        detectGenre(originalText);

    const detectedMovieInfo =
        detectMovieInfo(originalText);

    const foundCinema =
        findCinema(
            originalText,
            showtimes
        );

    const isMovieDiscovery =
        isMovieDiscoveryQuery(
            originalText
        );

    const shouldUseAI =
        shouldUseAIRecommendation(
            originalText
        );

    /* =====================================
       3. FIND MOVIE
    ===================================== */

    const movie =
        findMovieByKeyword(
            originalText,
            movies
        );

    console.log("TEXT:", originalText);
    console.log("MOVIE FOUND:", movie);

    /* =====================================
       4. FILTER FLAG
    ===================================== */

    const shouldFilterMovies =

        !movie && (

            isMovieDiscovery ||

            detectedGenre ||

            detectedDate ||

            detectedCinema ||

            detectedTimePeriod

        );

    /* =====================================
       5. AI REQUEST
    ===================================== */

    if (shouldUseAI) {

        return null;
    }

    /* =====================================
       6. BASIC INTENT
    ===================================== */

    const intentResult =
        handleIntent(
            intent,
            movies,
            promotions
        );

    if (intentResult) {

        return intentResult;
    }

    /* =====================================
       7. MOVIE + SHOWTIME
       Ví dụ:
       - Doraemon ngày mai
       - Conan tối nay
       - Lật Mặt CGV
    ===================================== */

    const showtimeResult =
        handleMovieShowtime(
            movie,
            showtimes,
            detectedDate,
            detectedTimePeriod,
            detectedCinema
        );

    if (showtimeResult) {

        return showtimeResult;
    }

    /* =====================================
       8. MOVIE INFO
       Ví dụ:
       - Doraemon là phim gì
       - Nội dung Conan
       - Đạo diễn Lật Mặt
    ===================================== */

    const movieInfoResult =
        handleMovieInfo({
            movie,
            infoType: detectedMovieInfo,
            message: originalText
        });

    if (movieInfoResult) {

        return movieInfoResult;
    }

    /* =====================================
       9. MOVIE FILTER
       Ví dụ:
       - Phim hoạt hình
       - Phim tối nay
       - Phim CGV
       - Phim kinh dị ngày mai
    ===================================== */

    if (shouldFilterMovies) {

        const filterResult =
            handleMovieFilter(
                movies,
                showtimes,
                detectedDate,
                detectedTimePeriod,
                detectedCinema,
                detectedGenre
            );

        if (filterResult) {

            return filterResult;
        }
    }

    /* =====================================
       10. CINEMA INFO
       Ví dụ:
       - CGV ở đâu
       - Số điện thoại Galaxy
    ===================================== */

    const cinemaResult =
        handleCinemaInfo(
            originalText,
            foundCinema
        );

    if (cinemaResult) {

        return cinemaResult;
    }

    /* =====================================
       11. BOOKING GUIDE
       Ví dụ:
       - Đặt vé
       - Hướng dẫn đặt vé
    ===================================== */

    const guideResult =
        handleBookingGuide({
            processedText: originalText,
            originalText,
            movies
        });

    if (guideResult) {

        return guideResult;
    }

    /* =====================================
       12. BOOKING
       Ví dụ:
       - Đặt 2 vé Doraemon
       - Mua 4 vé Conan
    ===================================== */

    const bookingResult =
        handleBooking(
            originalText,
            movie,
            showtimes
        );

    if (bookingResult) {

        return bookingResult;
    }

    /* =====================================
       13. FALLBACK AI
    ===================================== */

    return null;
};

export default chatbotRules;
