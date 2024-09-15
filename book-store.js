const fileUtils = require("./utils/file-utils")
const idUtils = require("./utils/id-utils")


/**
 * Add a book into the books.json
 * @param {{title: string; categories: []string; price: number; quantity: number;
 * authors: []{id: number}}} book 
 */
function addBook(book) {
    const filePath = `${__dirname}/books.json`
    const booksContent = fileUtils.readFile(filePath)
    const books = (booksContent === "") ? [] : JSON.parse(booksContent)

    const existBook = books.find((_book) => {
        return _book.title === book.title
    })

    const authorIds = book.authors.map((_author) => {
        return addAuthor(_author).id
    })

    if (!existBook) {
        book.id = idUtils.generateID()
        books.push({
            id: book.id,
            title: book.title,
            categories: book.categories,
            price: book.price,
            quantity: book.quantity,
            authors: authorIds
        })
        fileUtils.writeFile(filePath, JSON.stringify(books))
    }

    else {
        existBook.quantity += 1
        existBook.authors = authorIds
        fileUtils.writeFile(filePath, JSON.stringify(books))
    }

}

/**
 * Add a author into the authors.json
 * @param {[]{name: string; country: string}} author 
 */

function addAuthor(author) {
    const filePath = `${__dirname}/authors.json`
    const authorsContent = fileUtils.readFile(filePath)
    const authors = (authorsContent === "") ? [] : JSON.parse(authorsContent)
    let existAuthor = authors.find((_author) => {
        return _author.name === author.name
    })
    if (!existAuthor) {
        existAuthor = author
        existAuthor.id = idUtils.generateID()
        authors.push({ id: existAuthor.id, name: existAuthor.name, country: existAuthor.country })
        fileUtils.writeFile(filePath, JSON.stringify(authors))
    }

    return existAuthor
}

/**
 * 
 * @param {number} bookId 
 * @param {{title: string; categories: []string; price: number; quantity: number;
 * authors: []{name: string; country: string}}} bookObj
 */
function updateBook(bookId, bookObj) {
    const filePath = `${__dirname}/books.json`
    const booksContent = fileUtils.readFile(filePath)
    const books = (booksContent === "") ? [] : JSON.parse(booksContent)
    const updateBookIndex = books.findIndex((_book) => {
        return _book.id === bookId
    })

    if (updateBookIndex === -1) {
        console.log("The book that you want to update is not exist in the book store")
        return
    }
    else {
        books[updateBookIndex] = bookObj
        fileUtils.writeFile(filePath, JSON.stringify(books))
    }
}
const book = {
    title: "Leadership 360",
    categories: ["selfhelp", "myselfl"],
    price: 100,
    quantity: 5,
    authors: [{ name: "Socrate", country: "Italia" }, { name: "Marcus", country: "HyLap" }]
}

updateBook(18, book)
