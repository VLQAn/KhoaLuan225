export const handleCinemaInfo = (
    text,
    cinema
) => {

    if (!cinema) {
        return null;
    }

    if (
        text.includes("dia chi")
        ||
        text.includes("o dau")
    ) {

        return {

            type: "text",

            text:
                `📍 ${cinema.tenRap}\n\n` +
                `Địa chỉ: ${cinema.diaChi}`
        };
    }

    if (
        text.includes("so dien thoai")
        ||
        text.includes("lien he")
    ) {

        return {

            type: "text",

            text:
                `☎️ ${cinema.tenRap}\n\n` +
                `${cinema.soDienThoai}`
        };
    }

    return null;
};
