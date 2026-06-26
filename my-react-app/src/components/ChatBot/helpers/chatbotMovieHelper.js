import { normalizeText } from "../helpers/chatbotUtils";

export const normalizeMovieText = (text = "") => {

    return normalizeText(text)
        .replace(/[^\w\s]/g, " ")
        .replace(/\s+/g, " ")
        .trim();

};

export const extractMovieQuery = (text) => {

    let query = text;

    [
        "la phim gi",
        "phim gi",
        "phim la gi",
        "la gi",
        "thong tin phim",
        "thong tin",
        "la phim",
        "noi dung phim",
        "noi dung",
        "mo ta",
        "tom tat",
        "dao dien",
        "dien vien"
    ].forEach(pattern => {

        query =
            query.replaceAll(pattern, "");

    });

    return query.trim();

};

export const calculateSimilarity = (
    query,
    movieTitle
) => {

    query =
        normalizeMovieText(query);

    movieTitle =
        normalizeMovieText(movieTitle);

    if (
        movieTitle.includes(query)
    ) {
        return 1;
    }

    const queryWords =
        query.split(" ");

    const movieWords =
        movieTitle.split(" ");

    const matched =
        queryWords.filter(
            word =>
                movieWords.includes(word)
        ).length;

    return matched / queryWords.length;

};

export const extractMovieAliases = (
    movieTitle
) => {

    return normalizeMovieText(movieTitle)
        .split("/")
        .map(x => x.trim())
        .filter(Boolean);

};

export const findMovieByKeyword = (
    text,
    movies
) => {

    const normalizedText =
        normalizeText(text);

    let bestMovie = null;
    let bestScore = 0;

    movies.forEach(movie => {

        const aliases =
            extractMovieAliases(
                movie.tieuDe
            );

        let score = 0;

        aliases.forEach(alias => {

            const words =
                alias
                    .split(" ")
                    .filter(
                        word =>
                            word.length >= 2
                    );

            const queryWords =
                normalizedText.split(" ");

            const matched =
                words.filter(
                    word =>
                        queryWords.includes(word)
                ).length;

            score =
                Math.max(
                    score,
                    matched
                );

            if (
                normalizedText.includes(alias)
            ) {
                score += 100;
            }

        });

        if (score > 0) {
            console.log(
                movie.tieuDe,
                score
            );
        }

        if (
            score > bestScore &&
            score > 0
        ) {

            bestScore = score;
            bestMovie = movie;

        }

    });

    console.log(
        "BEST MOVIE:",
        bestMovie?.tieuDe,
        "SCORE:",
        bestScore
    );

    return bestScore > 0
        ? bestMovie
        : null;

};

export const detectMovieDetailQuery = (
    text
) => {

    const normalized =
        normalizeText(text);

    return (
        normalized.includes("la phim gi")
        ||
        normalized.includes("thong tin")
        ||
        normalized.includes("phim gi")
    );

};

export const isMovieTitleQuery = (
    text,
    movie
) => {

    if (!movie)
        return false;

    return (
        normalizeText(text)
        ===
        normalizeText(movie.tieuDe)
    );

};
