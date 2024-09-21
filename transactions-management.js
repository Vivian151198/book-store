const fileUtils = require("./utils/file-utils")
const idUtils = require("./utils/id-utils")
const bookStore = require("./book-store")
const dateUtils = require("./utils/date-utils")
const _ = require("lodash")

//-------------------------------TRANSACTIONS MANAGEMENT-----------------------------------
/**
 * Sell books
 * @param {[]{id: number;quantity: number}}} sellListBooks 
 * @returns Total selling price
 */
function sellBooks(sellListBooks) {
    const filePath = `${__dirname}/books.json`
    const bookContent = fileUtils.readFile(filePath)
    const books = bookContent === "" ? [] : JSON.parse(bookContent)

    const filePath1 = `${__dirname}/transactions-management.json`
    const transactionsContent = fileUtils.readFile(filePath1)
    const transactionsManagement = transactionsContent === "" ? [] : JSON.parse(transactionsContent)

    let totalPrice = 0
    for (let i = 0; i < sellListBooks.length; i++) {
        for (let j = 0; j < books.length; j++) {
            if (sellListBooks[i].id === books[j].id) {
                if (sellListBooks[i].quantity <= books[j].quantity) {
                    totalPrice = sellListBooks[i].quantity * books[j].price
                    sellListBooks[i].price = sellListBooks[i].quantity * books[j].price
                    books[j].quantity -= sellListBooks[i].quantity
                    fileUtils.writeFile(filePath, JSON.stringify(books))
                }
                else {
                    console.log("Don't enough quantity to sell")
                    return
                }
            }
        }
    }
    const transactionId = idUtils.generateID()
    transactionsManagement.push({
        id: transactionId,
        createdDate: new Date(),
        sellListBooks
    })
    fileUtils.writeFile(filePath1, JSON.stringify(transactionsManagement))
    return totalPrice
}

// const listBooks = [{ id: 7, quantity: 1 }, { id: 8, quantity: 2 }, { id: 3, quantity: 1 }]
// const totalPrice = sellBooks(listBooks)
// console.log(totalPrice)

/**
 * Find the best selling book in month
 * @param {string} month 
 * @param {string} year 
 * @returns List of best selling book in month
 */
function findTheBestSellingBookInMonth(month, year) {
    const filePath = `${__dirname}/books.json`
    const bookContent = fileUtils.readFile(filePath)
    const books = bookContent === "" ? [] : JSON.parse(bookContent)

    const filePath1 = `${__dirname}/transactions-management.json`
    const transactionsContent = fileUtils.readFile(filePath1)
    const transactionsManagement = transactionsContent === "" ? [] : JSON.parse(transactionsContent)

    const sellBooks = []
    for (let i = 0; i < transactionsManagement.length; i++) {
        for (let j = 0; j < transactionsManagement[i].sellListBooks.length; j++) {
            sellBooks.push(transactionsManagement[i].sellListBooks[j])
        }
    }

    const _sellBooks = [...sellBooks]
    const bestSellingBooks = [_sellBooks[0]]
    for (let n = 1; n < _sellBooks.length; n++) {
        const existBookIndex = bestSellingBooks.findIndex((bookF) => {
            return bookF.id === _sellBooks[n].id
        })

        if (existBookIndex === -1) {
            bestSellingBooks.push({ ..._sellBooks[n] })
        }
        else {
            bestSellingBooks[existBookIndex].quantity += _sellBooks[n].quantity
            bestSellingBooks[existBookIndex].price += _sellBooks[n].price
        }
    }
    console.log(bestSellingBooks)
    const result = []
    let maxQuantity = 0
    for (let z = 0; z < bestSellingBooks.length; z++) {
        if (bestSellingBooks[z].quantity > maxQuantity) {
            maxQuantity = bestSellingBooks[z].quantity
        }
    }
    for (let z = 0; z < bestSellingBooks.length; z++) {
        if (bestSellingBooks[z].quantity === maxQuantity) {
            result.push(bestSellingBooks[z])
        }
    }

    return result
}

// const result = findTheBestSellingBookInMonth(9, 2024)
// console.log("Best selling book is:", result)

/**
 * Get the total selling value of month
 * @param {string} month 
 * @returns Return total selling value of month
 */
function getTotalValueSellingOfMonth(month) {
    const filePath = `${__dirname}/books.json`
    const bookContent = fileUtils.readFile(filePath)
    const books = bookContent === "" ? [] : JSON.parse(bookContent)

    const filePath1 = `${__dirname}/transactions-management.json`
    const transactionsContent = fileUtils.readFile(filePath1)
    const transactionsManagement = transactionsContent === "" ? [] : JSON.parse(transactionsContent)
    let totalSelling = 0

    for (let i = 0; i < transactionsManagement.length; i++) {
        if (dateUtils.getMonth(new Date(transactionsManagement[i].createdDate)) + 1 === month) {
            for (let j = 0; j < transactionsManagement[i].sellListBooks.length; j++) {
                totalSelling += transactionsManagement[i].sellListBooks[j].price
            }
        }
    }
    return totalSelling
}

// console.log(getTotalValueSellingOfMonth(9))

/**
 * Find the most favorite author of the month
 * @param {string} month 
 * @param {string} year 
 * @returns List of favorite authors of the month
 */
function findTheMostFavoriteAuthor(month, year) {
    const filePath = `${__dirname}/books.json`
    const bookContent = fileUtils.readFile(filePath)
    const books = bookContent === "" ? [] : JSON.parse(bookContent)

    const filePath1 = `${__dirname}/transactions-management.json`
    const transactionsContent = fileUtils.readFile(filePath1)
    const transactionsManagement = transactionsContent === "" ? [] : JSON.parse(transactionsContent)

    const filePath2 = `${__dirname}/authors.json`
    const authorsContent = fileUtils.readFile(filePath2)
    const authors = authorsContent === "" ? [] : JSON.parse(authorsContent)

    const bestSellingBooks = findTheBestSellingBookInMonth(month, year)
    let bestAuthorIds = []

    for (let i = 0; i < bestSellingBooks.length; i++) {
        for (let j = 0; j < books.length; j++) {
            if (bestSellingBooks[i].id === books[j].id) {
                bestAuthorIds.push(books[j].authors)
            }
        }
    }

    bestAuthorIds = _.union(...bestAuthorIds)
    const result = []

    for (let n = 0; n < bestAuthorIds.length; n++) {
        for (let m = 0; m < authors.length; m++) {
            if (bestAuthorIds[n] === authors[m].id) {
                result.push(authors[m])
            }
        }
    }
    return result
}

const result = findTheMostFavoriteAuthor(9, 2024)
console.log("🚀 ~ result:", result)
