const fs = require('node:fs')
const path = require('node:path')

const projectRoot = path.resolve(path.join(__dirname, '../../'))

const oldEntries = require(path.join(__dirname, 'etc', 'pokemon-entries.json'))
const newEntries = require(projectRoot + '/data/src/collections/pokemon.json')

newEntries.data = oldEntries

fs.writeFileSync(
  projectRoot + '/data/src/collections/pokemon.json',
  JSON.stringify(newEntries, undefined, 2)
)
