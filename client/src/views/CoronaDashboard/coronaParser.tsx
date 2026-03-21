export function getFirstDayStatus(data) {
    return data[0];
}

export function getDayStatus(data, date) {
    for (let value of Object.values(data)) {
        if(value.date === date) {
            return value;
        }
    }
    return null;
}

export function getCoronaCasesPer1MPopulation(coronaData, population, category) {
    return Math.round((coronaData[category]/population) * 1000000);
}

export function getPercent(population, val) {
    return Math.round((Math.round(val)/Math.round(population)) * 100);
}

export const rounded = num => {
    if (num > 1000000000) {
        return Math.round(num / 100000000) / 10 + "Bn";
    } else if (num > 1000000) {
        return Math.round(num / 100000) / 10 + "M";
    } else {
        return Math.round(num / 100) / 10 + "K";
    }
};