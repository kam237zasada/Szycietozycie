function getDate(date) {
    return `${date.getFullYear()}-${lz((date.getMonth()+1))}-${lz(date.getDate())} ${lz(date.getHours())}:${lz(date.getMinutes())}:${lz(date.getSeconds())}`
}

function lz(number) {
        return `${number}`.padStart(2, "0");
}

exports.getDate = getDate;