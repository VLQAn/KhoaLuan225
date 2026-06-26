export const normalizeText = (text) => {

    return text
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/đ/g, "d")
        .replace(/Đ/g, "D");
};

export const getDateLabel = (date) => {

    switch (date) {

        case "today":
            return "hôm nay";

        case "tomorrow":
            return "ngày mai";

        case "Monday":
            return "thứ 2";

        case "Tuesday":
            return "thứ 3";

        case "Wednesday":
            return "thứ 4";

        case "Thursday":
            return "thứ 5";

        case "Friday":
            return "thứ 6";

        case "Saturday":
            return "thứ 7";

        case "Sunday":
            return "chủ nhật";

        case "weekend":
            return "cuối tuần";

        case "this_week":
            return "tuần này";

        case "next_week":
            return "tuần sau";

        case "this_month":
            return "tháng này";

        case "next_month":
            return "tháng sau";

        case "holiday_2_9":
            return "lễ 2/9";

        case "tet":
            return "Tết";

        case "next_weekend":
            return "cuối tuần sau";

        case "start_of_month":
            return "đầu tháng";

        case "end_of_month":
            return "cuối tháng";

        case "christmas":
            return "Giáng Sinh";

        case "new_year":
            return "năm mới";

        default:
            return date;
    }
};