import fs from 'node:fs'
import path from 'node:path'

// Function to minify a JSON object
function minifyJSON(json: object): string {
  return JSON.stringify(json)
}

// Function to read a JSON file and minify its contents
function minifyJSONFile(filePath: string): void {
  try {
    const jsonData = fs.readFileSync(filePath, 'utf8')
    const jsonObject = JSON.parse(jsonData)
    const minifiedJSON = minifyJSON(jsonObject)
    const minifiedFilePath = filePath.replace('.json', '.min.json')
    fs.writeFileSync(minifiedFilePath, minifiedJSON, 'utf8')
    console.log(`Minified "${path.basename(filePath)}" => "${path.basename(minifiedFilePath)}"`)
  } catch (err) {
    console.error(`Error processing file "${filePath}": ${err}`)
  }
}

// Function to read all JSON files from a directory and minify them
function minifyJSONFilesFromDirectory(dirPath: string): void {
  fs.readdirSync(dirPath).forEach(file => {
    const filePath = path.join(dirPath, file)
    const stat = fs.statSync(filePath)
    if (stat.isFile() && path.extname(filePath) === '.json' && !filePath.endsWith('.min.json')) {
      minifyJSONFile(filePath)
    }
  })
}

// Get the directory path from command-line arguments
const args = process.argv.slice(2)
const dirPath = args[0]

// Check if a directory path is provided
if (!dirPath) {
  console.error('Please provide the path to the directory containing JSON files.')
  process.exit(1)
}

// Check if the provided path is a valid directory
try {
  const stat = fs.statSync(dirPath)
  if (!stat.isDirectory()) {
    console.error(`"${dirPath}" is not a valid directory.`)
    process.exit(1)
  }
} catch (err) {
  console.error(`Error accessing directory "${dirPath}": ${err}`)
  process.exit(1)
}

// Minify JSON files in the directory
minifyJSONFilesFromDirectory(dirPath)
