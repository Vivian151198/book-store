const fs = require("fs")
/**
 * Read a file 
 * @param {string} filePath 
 * @returns 
 */
function readFile(filePath) {
    const file = fs.readFileSync(filePath)
    return file.toString("utf-8")
}

function writeFile(filePath, content) {
    fs.writeFileSync(filePath, content)
}

module.exports = {
    readFile,
    writeFile
}