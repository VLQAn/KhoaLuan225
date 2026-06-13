import { normalizeText } from "./chatbotUtils";

export const findBestMovieMatch = (
    text,
    movies
) => {

    const words =
        normalizeText(text)
            .split(" ")
            .filter(
                word =>
                    word.length > 2
            );

    let bestMovie = null;

    let bestScore = 0;

    movies.forEach(movie => {

        const movieName =
            normalizeText(
                movie.tieuDe
            );

        const score =
            words.filter(
                word =>
                    movieName.includes(word)
            ).length;

        if (
            score > bestScore
        ) {

            bestScore = score;
            bestMovie = movie;

        }

    });

    return bestScore >= 1
        ? bestMovie
        : null;

};
