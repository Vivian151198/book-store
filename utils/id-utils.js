const fileUtils = require("./file-utils")

function generateID() {
    const filePath = `${__dirname}/id.txt`
    const fileContent = fileUtils.readFile(filePath)
    const id = parseInt(fileContent) + 1
    fileUtils.writeFile(filePath, JSON.stringify(id))

    return id
}

module.exports = {
    generateID
}