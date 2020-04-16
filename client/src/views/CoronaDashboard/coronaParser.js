export function getFirstDayStatus(data) {
    return data[0];
}

export function getDayStatus(data, date) {
    for (let [key, value] of Object.entries(data)) {
        if(value.date === date) {
            return value;
        }
    }
    return null;
}