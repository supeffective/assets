const fs = require('fs-extra')
const glob = require('glob')
const path = require('path')

const srcPath = __dirname + '/node_modules/pokemon-showdown'
const destPath = __dirname + '/dist'

fs.removeSync(destPath)
fs.ensureDirSync(destPath)

// Dump all data to the dist folder
glob(srcPath + '/.data-dist/**/*.{js,json}', {}, (err, files) => {
  files.forEach(function (filepath) {
    let name = filepath.replace(new RegExp(srcPath), '').replace(/\.(json|js)$/, '')
    let data = require(filepath)

    if (typeof data !== 'object') {
      console.log('skipped: ' + name)
      return
    }

    let nameParts = name
      .replace(/^\//, '')
      .split('/')

    let nameSlug = nameParts
      .slice(1)
      .join('_')
      .replace(/[-\/]/g, '_')

    try {
      let destDir = path.dirname(name)
      if (destDir) {
        fs.ensureDirSync(destPath + '/' + destDir)
      }
      let destName = nameParts[0] + '/' + nameSlug + '.json'
      console.log(name, '=>', destName)
      fs.writeJsonSync(destPath + '/' + destName, data, {spaces: 2})
    } catch (e) {
      console.error("failed: " + name + " // " + e.message)
      throw e
    }
  })
})

