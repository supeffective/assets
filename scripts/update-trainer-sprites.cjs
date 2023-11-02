const fs = require('fs')
const path = require('path')
const dataDir = path.join(__dirname, '..', 'assets', 'images', 'characters')
const imagesDir = path.join(__dirname, '..', 'assets', 'images', 'characters', 'masters-icons')
const jsonFile = path.join(dataDir, 'masters-icons.json')

const characterFiles = fs.readdirSync(imagesDir).filter((file) => file.endsWith('.png'))
const characterNames = characterFiles.map((file) => file.replace('.png', ''))

// create a json file with the character names e.g. [{"name": "Acerola", "id": "acerola"}, ...]

const characters = characterNames.map((name) => {
  const nameSlug = name
    .toLowerCase()
    // replace whitespace with -:
    .replace(/[_\s]/g, '-')
    .replace(/icon$/g, '')
    .replace(/-{1,}$/g, '')
    .replace(/^-{1,}$/g, '')
    .replace(/[^a-z-0-9]/g, '')

  // Rename original file:
  const destFile = path.join(imagesDir, `${nameSlug}.png`)
  if (fs.existsSync(destFile)) {
    throw new Error(`File already exists: ${destFile}`)
  }

  fs.renameSync(path.join(imagesDir, `${name}.png`), path.join(imagesDir, `${nameSlug}.png`))

  return {
    id: nameSlug,
    name: name.replace(/ Icon/gi, ''),
  }
})

fs.writeFileSync(jsonFile, JSON.stringify(characters, null, 2))
