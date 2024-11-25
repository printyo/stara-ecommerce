/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./public/*.{html, js}"],
    theme: {
        extend: {
            fontFamily: {
                // didot
                rozha: ["Rozha One", "serif"],
                afacad: ["Afacad", "serif"],
            },
        },
    },
    plugins: [],
};
