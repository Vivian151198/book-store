const fileUtils = require("./utils/file-utils")
const idUtils = require("./utils/id-utils")
const bookStore = require("./book-store")

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
                totalPrice = sellListBooks[i].quantity * books[j].price
                sellListBooks[i].price = sellListBooks[i].quantity * books[j].price
                books[j].quantity -= sellListBooks[i].quantity
                if (books[j].quantity === 0) {
                    bookStore.removeBook(books[j].id)
                }
                fileUtils.writeFile(filePath, JSON.stringify(books))
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

const listBooks = [{ id: 3, quantity: 2 }]
const totalPrice = sellBooks(listBooks)
console.log(totalPrice)

/**
 * Sell a book
 * @param {{id: number; quantity: number}} sellBook 
 *  @returns Selling price
 */
function sellABook(sellBook) {

}