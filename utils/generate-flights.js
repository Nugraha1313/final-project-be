
require('dotenv').config();
const moment = require('moment-timezone');
const {sequelize, queryTypes} = require('../external/postgres');
const {Flights} = require('../db/models');
const {isValidYear, isValidMonth, getDatesOfMonth} = require('./moment');

const {TIMEZONE = 'Asia/Jakarta'} = process.env;
const year = Number(process.argv[2]);
const month = Number(process.argv[3]) - 1;

if (!isValidYear(year)) {
    console.log('Year input is not valid!');
    return;
}

if (!isValidMonth(month)) {
    console.log('Month input is not valid!');
    return;
}

const query = `
    SELECT
        schedules.price,
        schedules.departure_terminal_name,
        schedules.arrival_terminal_name,
        schedules.flight_number,
        schedules.free_baggage,
        schedules.cabin_baggage,
        schedules.departure_base_timestamp,
        schedules.arrival_base_timestamp,
        schedules.class,
        schedules.flight_day,
        airplanes.id AS airplane_id,
        airlines.id AS airline_id,
        departure_airport.id AS departure_airport_id,
        arrival_airport.id  AS arrival_airport_id,
        airplanes.seat_layout,
        airplanes.seat_pitch
    FROM
        schedules
        INNER JOIN airlines ON airlines.iata_code = schedules.airline_code
        INNER JOIN airplanes ON airplanes.code = schedules.airplane_code AND airplanes.airline_code = airlines.iata_code
        INNER JOIN airports AS departure_airport ON departure_airport.iata_code = schedules.departure_airport
        INNER JOIN airports AS arrival_airport ON arrival_airport.iata_code = schedules.arrival_airport`;

sequelize
    .query(query, {type: queryTypes.SELECT})
    .then(async results => {
        try {
            // map schedule data by flight_day
            const scheduleMap = {
                "Sunday": [],
                "Monday": [],
                "Tuesday": [],
                "Wednesday": [],
                "Thursday": [],
                "Friday": [],
                "Saturday": []
            };
            results.forEach(schedule => scheduleMap[schedule.flight_day].push(schedule));

            const flightSchedules = [];
            const datesOfMonth = getDatesOfMonth(year, month);

            datesOfMonth.forEach((date) => {
                scheduleMap[date.dayOfWeek].forEach(schedule => {
                    if (schedule.arrival_base_timestamp - schedule.departure_base_timestamp < 0) return; // skip invalid data

                    const departureTimestamp = date.unix + schedule.departure_base_timestamp;
                    const arrivalTimestamp = date.unix + schedule.arrival_base_timestamp;
                    const departureTime = moment.unix(departureTimestamp).tz(TIMEZONE).format('HH:mm');
                    const arrivalTime = moment.unix(arrivalTimestamp).tz(TIMEZONE).format('HH:mm');
                    const flightDuration = (arrivalTimestamp - departureTimestamp) / 60;
                    const seatPerRow = schedule.seat_layout.split('-').reduce((acc, curr) => acc + Number(curr), 0);
                    const capacity = seatPerRow * +schedule.seat_pitch;

                    flightSchedules.push({
                        flight_number: schedule.flight_number,
                        departure_airport_id: schedule.departure_airport_id,
                        airplane_id: schedule.airplane_id,
                        airline_id: schedule.airline_id,
                        arrival_airport_id: schedule.arrival_airport_id,
                        class: schedule.class,
                        price: schedule.price,
                        departure_terminal_name: schedule.departure_terminal_name,
                        arrival_terminal_name: schedule.arrival_terminal_name,
                        flight_date: date.string,
                        departure_time: departureTime,
                        arrival_time: arrivalTime,
                        flight_duration: flightDuration,
                        departure_timestamp: departureTimestamp,
                        arrival_timestamp: arrivalTimestamp,
                        free_baggage: schedule.free_baggage,
                        cabin_baggage: schedule.cabin_baggage,
                        capacity
                    });
                });
            });

            await Flights.bulkCreate(flightSchedules);
        } catch (err) {
            console.log(err);
        }
    })
    .catch(err => console.log(err));

