exports.getUnixTimeStamp = (date) => {
    if (!(date instanceof Date)) {
        throw new Error('Invalid input. Please provide a valid Date object.');
    }
    return Math.floor(date.getTime() / 1000);

}