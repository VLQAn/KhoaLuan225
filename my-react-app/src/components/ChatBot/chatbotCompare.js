import { normalizeText } from "./chatbotUtils";

export const detectMovieComparison = (
    text,
    movies
) => {

    const normalized =
        normalizeText(text);

    const foundMovies =
        movies.filter(movie =>
            normalized.includes(
                normalizeText(
                    movie.tieuDe
                )
            )
        );

    if (
        foundMovies.length >= 2
    ) {

        return {
            movie1:
                foundMovies[0],

            movie2:
                foundMovies[1]
        };
    }

    return null;
};
