// one-off script to fix data

const fs = require('fs')
const path = require('path')

const dataDir = path.resolve(path.join(__dirname, '..', '..', '..', 'assets', 'data'))

const fixes = {
  fix001: entry => {
    // mutate entry

    return entry
  },
}

;(() => {
  const dataFile = path.join(dataDir, 'pokemon.json')
  // load entries
  const jsonContent = fs.readFileSync(dataFile, 'utf8')
  const entries = JSON.parse(jsonContent)

  // make modifications
  const modifiedEntries = entries.map(entry => {
    const modifiedEntry = fixes.fix001(entry)
    console.log(`fixed ${entry.id}`)

    return modifiedEntry
  })

  // write file back
  fs.writeFileSync(dataFile, JSON.stringify(modifiedEntries, null, 2))
})()
