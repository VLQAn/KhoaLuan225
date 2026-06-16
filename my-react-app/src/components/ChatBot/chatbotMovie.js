// import { normalizeText } from "./chatbotUtils";

// export const findBestMovieMatch = (
//     text,
//     movies
// ) => {

//     const words =
//         normalizeText(text)
//             .split(" ")
//             .filter(Boolean);

//     console.log("QUERY:", text);
//     console.log("WORDS:", words);

//     let bestMovie = null;
//     let bestScore = 0;

//     movies.forEach(movie => {

//         const movieName =
//             normalizeText(
//                 movie.tieuDe
//             );

//         const score =
//             words.filter(
//                 word =>
//                     movieName.includes(word)
//             ).length;

//         if (score > 0) {
//             console.log(
//                 movie.tieuDe,
//                 "=>",
//                 score
//             );
//         }

//         if (
//             score > bestScore
//         ) {

//             bestScore = score;
//             bestMovie = movie;

//         }

//     });

//     console.log(
//         "BEST:",
//         bestMovie?.tieuDe,
//         bestScore
//     );

//     return bestScore >= 1
//         ? bestMovie
//         : null;

// };
