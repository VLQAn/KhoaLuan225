export const handleIntent = (
    intent,
    movies,
    promotions
) => {

    if (!intent)
        return null;

    switch (intent) {

        case "showing_movies":

            return {
                type: "movie_list",
                title: "🎬 Phim đang chiếu",
                movies: movies.filter(
                    movie =>
                        movie.trangThai === "dang_chieu"
                )
            };

        case "upcoming_movies":

            return {
                type: "movie_list",
                title: "🎥 Phim sắp chiếu",
                movies: movies.filter(
                    movie =>
                        movie.trangThai === "sap_chieu"
                )
            };

        case "promotions":

            return {
                type: "promotion_list",
                promotions
            };

        case "top_movies":

            return {
                type: "movie_list",
                title: "🔥 Top phim được yêu thích",
                movies: movies
                    .sort((a, b) => b.danhGia - a.danhGia)
                    .slice(0, 5)
            };

        default:
            return null;
    }
};
