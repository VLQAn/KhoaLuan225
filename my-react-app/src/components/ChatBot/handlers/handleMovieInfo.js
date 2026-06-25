import {

    detectMovieInfoType,

    detectMovieDetailQuery,

    isMovieTitleQuery

}
from "../helpers/chatbotMovieHelper";

export const handleMovieInfo =
(
    context
) => {

    const {
        movie,
        message
    } = context;

    if (!movie)
        return null;

    const infoType =
        detectMovieInfoType(
            message
        );

    if (infoType) {

        return {

            type:
                "movie_info",

            infoType,

            movie: {

                title:
                    movie.tieuDe,

                description:
                    movie.moTa,

                director:
                    movie.daoDien,

                actors:
                    movie.dienVien
            }
        };
    }

    if (
        detectMovieDetailQuery(
            message
        )
        ||
        isMovieTitleQuery(
            message,
            movie
        )
    ) {

        return {

            type:
                "movie",

            movie
        };
    }

    return null;
};
