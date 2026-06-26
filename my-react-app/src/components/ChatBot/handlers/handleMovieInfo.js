import { detectMovieDetailQuery, isMovieTitleQuery } from "../helpers/chatbotMovieHelper";

export const handleMovieInfo = (
    context
) => {

    const {

        movie,

        message,

        infoType

    } = context;

    if (!movie)
        return null;

    if (infoType) {

        return {

            type: "movie_info",

            infoType,

            movie: {

                title: movie.tieuDe,

                description: movie.moTa,

                director: movie.daoDien,

                actors: movie.dienVien,

                duration: movie.thoiLuong,

                releaseDate: movie.ngayCongChieu,

                genre: movie.theLoai,

                rating: movie.danhGia

            }

        };

    }

    if (

        detectMovieDetailQuery(message)

        ||

        isMovieTitleQuery(
            message,
            movie
        )

    ) {

        return {

            type: "movie",

            movie

        };

    }

    return null;

};
