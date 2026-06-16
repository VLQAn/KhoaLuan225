// import { findBestMovieMatch }
//     from "./chatbotMovie";

// import { normalizeText }
//     from "./chatbotUtils";

// export const detectMovieComparison = (
//     text,
//     movies
// ) => {

//     const normalized =
//         normalizeText(text);

//     const separators = [
//         " hay ",
//         " voi ",
//         " vs ",
//         " so sanh "
//     ];

//     let parts = null;

//     for (const separator of separators) {

//         if (
//             normalized.includes(
//                 separator
//             )
//         ) {

//             parts =
//                 normalized.split(
//                     separator
//                 );

//             break;
//         }
//     }

//     if (
//         !parts
//         ||
//         parts.length < 2
//     ) {
//         return null;
//     }

//     const cleanText = (text) =>
//         text
//             .replace("nen xem", "")
//             .replace("so sanh", "")
//             .replace("phim", "")
//             .replace("voi", "")
//             .trim();

//     const movie1 =
//         findBestMovieMatch(
//             cleanText(parts[0]),
//             movies
//         );

//     const movie2 =
//         findBestMovieMatch(
//             cleanText(parts[1]),
//             movies
//         );

//     console.log(
//         "NORMALIZED:",
//         normalized
//     );

//     console.log(
//         "PARTS:",
//         parts
//     );

//     console.log(
//         "MOVIE1:",
//         movie1?.tieuDe
//     );

//     console.log(
//         "MOVIE2:",
//         movie2?.tieuDe
//     );

//     if (
//         movie1
//         &&
//         movie2
//         &&
//         movie1.maPhim !== movie2.maPhim
//     ) {

//         return {
//             movie1,
//             movie2
//         };
//     }

//     return null;
// };
