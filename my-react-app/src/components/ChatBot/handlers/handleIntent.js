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

        default:
            return null;
    }
};
