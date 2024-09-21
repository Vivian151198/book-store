const fs = require("fs")
/**
 * Get date of Date
 * @param {Date} date 
 * @returns date of Date
 */

function getDate(date) {
    return date.getDate()
}

function getMonth(date) {
    return date.getMonth()
}

function getFullYear(date) {
    return date.getFullYear()
}
module.exports = {
    getDate, getMonth, getFullYear
}
