const fileUtils = require("./utils/file-utils")
const idUtils = require("./utils/id-utils")

/**
 * Add a book into the books.json && Add written book in to the writtenBooks.json
 * @param {{title: string; categories: []string; price: number; quantity: number;
 * authors: []{id: number}}} book 
 */
function addBook(book) {
    const filePath = `${__dirname}/books.json`
    const booksContent = fileUtils.readFile(filePath)
    const books = (booksContent === "") ? [] : JSON.parse(booksContent)

    const filePath1 = `${__dirname}/WrittenBooks.json`
    const writtenBooksContent = fileUtils.readFile(filePath1)
    const writtenBooks = (writtenBooksContent === "") ? [] : JSON.parse(writtenBooksContent)

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

        writtenBooks.push({
            id: book.id,
            authors: authorIds
        })

        fileUtils.writeFile(filePath, JSON.stringify(books))
        fileUtils.writeFile(filePath1, JSON.stringify(writtenBooks))
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

const book = {
    title: "Leadership XXXXX",
    categories: ["selfhelp", "leadership"],
    price: 20,
    quantity: 1,
    authors: [{ name: "John C.Maxwell", country: "USA" }]
}

// addBook(book)

/**
 *
 * @param {number} bookId
 * @param {{title: string; categories: []string; price: number; quantity: number;
 * authors: []{name: string; country: string}}} book
 */
function updateBook(bookId, book) {
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
        books[updateBookIndex].title = book.title
        fileUtils.writeFile(filePath, JSON.stringify(books))
    }
}
// const book = {
//     title: "Leadership 365",
//     categories: ["selfhelp", "myselfl"],
//     price: 100,
//     quantity: 5,
//     authors: [{ name: "Socrate", country: "Italia" }, { name: "Marcus", country: "HyLap" }]
// }

// updateBook(5, book)

/**
 * Remove a book. if the book author doesn't have any book else, delete him either
 * @param {number} bookId
 */
function removeBook(bookId) {
    const filePath = `${__dirname}/books.json`
    const bookContent = fileUtils.readFile(filePath)
    const books = bookContent === "" ? [] : JSON.parse(bookContent)

    const filePath1 = `${__dirname}/WrittenBooks.json`
    const writtenBooksContent = fileUtils.readFile(filePath1)
    const writtenBooks = (writtenBooksContent === "") ? [] : JSON.parse(writtenBooksContent)

    const filePath2 = `${__dirname}/authors.json`
    const authorContent = fileUtils.readFile(filePath2)
    const authors = authorContent === "" ? [] : JSON.parse(authorContent)

    const deletedBookIndex = books.findIndex((book) => {
        return book.id === bookId
    })

    if (deletedBookIndex === -1) {
        console.log("The book doesn't exist in the book store")
        retunr
    }
    books.splice(deletedBookIndex, 1)
    fileUtils.writeFile(filePath, JSON.stringify(books))

    const deletedWrittenBookIndex = writtenBooks.findIndex((writtenBook) => {
        return writtenBook.id === bookId
    })
    const authorIdsOfWrittenBook = writtenBooks[deletedBookIndex].authors
    writtenBooks.splice(deletedWrittenBookIndex, 1)
    fileUtils.writeFile(filePath1, JSON.stringify(writtenBooks))

    //Check if the book author doesn't have any book else, delete him either
    for (let i = 0; i < authorIdsOfWrittenBook.length; i++) {
        let checkWriteOneBook = checkAuthorWriteOneBook(authorIdsOfWrittenBook[i])
        if (checkWriteOneBook === false) {
            const deletedAuthorIndex = authors.findIndex((author) => {
                return authorIdsOfWrittenBook[i] === author.id
            })
            authors.splice(deletedAuthorIndex, 1)
            fileUtils.writeFile(filePath2, JSON.stringify(authors))
        }
    }

}

function checkAuthorWriteOneBook(authorId) {
    const filePath = `${__dirname}/WrittenBooks.json`
    const writtenBooksContent = fileUtils.readFile(filePath)
    const writtenBooks = (writtenBooksContent === "") ? [] : JSON.parse(writtenBooksContent)

    let checkWriteOneBook = false
    let countTheWrittenBooks = 0
    for (let i = 0; i < writtenBooks.length; i++) {
        for (let j = 0; j < writtenBooks[i].authors.length; j++) {
            if (writtenBooks[i].authors[j] === authorId) {
                countTheWrittenBooks += 1
            }
        }
    }
    if (countTheWrittenBooks > 0) {
        checkWriteOneBook = true
    }
    return checkWriteOneBook
}

// removeBook(7)

/**
 * List book by category
 * @param {string} categoryName 
 */
function booksByCategory(categoryName) {
    const filePath = `${__dirname}/books.json`
    const bookContent = fileUtils.readFile(filePath)
    const books = bookContent === "" ? [] : JSON.parse(bookContent)
    const listBooksByCategory = []
    for (let i = 0; i < books.length; i++) {
        for (let j = 0; j < books[i].categories.length; j++) {
            if (books[i].categories[j] === categoryName)
                listBooksByCategory.push(books[i])
        }
    }
    return listBooksByCategory
}

// console.log(booksByCategory("leadership"))
/**
 * List of books of the authors
 * @param {string} authorName
 * @returns list books by author
 */
function booksbyAuthor(authorName) {
    const filePath = `${__dirname}/books.json`
    const bookContent = fileUtils.readFile(filePath)
    const books = bookContent === "" ? [] : JSON.parse(bookContent)

    const filePath1 = `${__dirname}/WrittenBooks.json`
    const writtenBooksContent = fileUtils.readFile(filePath1)
    const writtenBooks = (writtenBooksContent === "") ? [] : JSON.parse(writtenBooksContent)

    const filePath2 = `${__dirname}/authors.json`
    const authorContent = fileUtils.readFile(filePath2)
    const authors = authorContent === "" ? [] : JSON.parse(authorContent)

    const author = authors.find((author) => {
        return author.name === authorName
    })
    if (!author) {
        console.log("The author is not exist")
        return
    }
    const bookIds = []
    for (let i = 0; i < writtenBooks.length; i++) {
        for (let j = 0; j < writtenBooks[i].authors.length; j++) {
            if (writtenBooks[i].authors[j] === author.id) {
                bookIds.push(writtenBooks[i].id)
            }
        }
    }
    console.log(bookIds)
    const booksOfAuthor = []
    for (let n = 0; n < books.length; n++) {
        for (let m = 0; m < bookIds.length; m++) {
            if (books[n].id === bookIds[m]) {
                booksOfAuthor.push(books[n])
            }
        }
    }
    console.log(booksOfAuthor)
}

// booksbyAuthor("Thu Giang")

module.exports = {
    removeBook
}