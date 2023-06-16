const moment = require('moment-timezone');
const {TIMEZONE = 'Asia/Jakarta'} = process.env;

function isValidYear(year) {
    return !isNaN(year) && year.toString().length === 4;
}

function isValidMonth(month) {
    return month >= 0 && month < 12;
}

function getDatesOfMonth(year, month) {
    const dates = [];
    const startOfMonth = moment({year, month}).tz(TIMEZONE);
    const daysInMonth = startOfMonth.daysInMonth();

    for (let day = 1; day <= daysInMonth; day++) {
        const date = startOfMonth.date(day);
        const dayOfWeek = date.day();

        const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

        const dateWithDayOfWeek = {
            string: date.format('YYYY-MM-DD'),
            unix: date.unix(),
            dayOfWeek: daysOfWeek[dayOfWeek],
        };

        dates.push(dateWithDayOfWeek);
    }

    return dates;
}

module.exports = {
    isValidYear,
    isValidMonth,
    getDatesOfMonth,
};