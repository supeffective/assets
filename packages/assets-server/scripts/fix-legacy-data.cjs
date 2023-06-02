// one-off script to fix data

const fs = require('fs')
const path = require('path')

const dataDir = path.resolve(path.join(__dirname, '..', '..', '..', 'assets', 'data', 'legacy'))

const fixes = {
  fix001: data => {
    // mutate data
    return data
  },
}

;(() => {
  const pkmFile = path.join(dataDir, 'pokemon.json')
  // fix pokemon entries
  const jsonContent = fs.readFileSync(pkmFile, 'utf8')
  const pokemonList = JSON.parse(jsonContent)

  const modifiedList = pokemonList.map(pkm => {
    const newData = fixes.fix001(pkm)
    console.log(`fixed ${pkm.id}`)

    return newData
  })

  // write back
  fs.writeFileSync(pkmFile, JSON.stringify(modifiedList, null, 2))
})()
