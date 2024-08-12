const fs = require('node:fs')
const path = require('node:path')
const dataDir = path.join(__dirname, '..', 'assets', 'images', 'characters')
const imagesDir = path.join(__dirname, '..', 'assets', 'images', 'characters', 'masters-icons')
const jsonFile = path.join(dataDir, 'characters.json')

const characterFiles = fs.readdirSync(imagesDir).filter((file) => file.endsWith('.png'))
const characterNames = characterFiles.map((file) => file.replace('.png', ''))

// create a json file with the character names e.g. [{"name": "Acerola", "id": "acerola"}, ...]

const characters = characterNames.map((name) => {
  const nameSlug = name
    .toLowerCase()
    // replace _ or whitespace with -:
    .replace(/[_\s]/g, '-')
    .replace(/masters$/g, '')
    .replace(/icon$/g, '')
    .replace(/ icon$/g, '')
    .replace(/-{1,}$/g, '')
    .replace(/^-{1,}$/g, '')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-s-/g, 's-')
    .replace(/-icon$/g, '')
    .trim()

  const cleanTitle = name
    // replace whitespace with -
    .replace(/_s/g, "'s")
    .replace(/[-_+]$/g, '')
    .replace(/ Masters$/g, '')
    .replace(/ Icon$/g, '')
    .trim()

  // Rename original file:
  const destFile = path.join(imagesDir, `${nameSlug}.png`)
  if (fs.existsSync(destFile)) {
    // throw new Error(`File already exists: ${destFile}`)
  }

  fs.renameSync(path.join(imagesDir, `${name}.png`), path.join(imagesDir, `${nameSlug}.png`))

  return {
    id: nameSlug,
    name: cleanTitle,
  }
})

characters.sort((a, b) => a.name.localeCompare(b.name))

const largestSlug = characters.reduce((acc, character) => {
  return character.id.length > acc.length ? character.id : acc
}, '')

fs.writeFileSync(jsonFile, JSON.stringify(characters, null, 2))

console.log(`Updated ${jsonFile}`)
console.log(`Largest slug: ${largestSlug} (${largestSlug.length} characters)`)
