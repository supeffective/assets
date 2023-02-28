const fs = require('fs-extra')
const glob = require('glob')
const path = require('path')

const srcPath = path.resolve(
  __dirname + '/node_modules/pokemon-showdown/dist/data'
)
const destPath = __dirname + '/build'

fs.removeSync(destPath)
fs.ensureDirSync(destPath, undefined, true)

// Dump all data to the dist folder
glob(srcPath + '/**/*.{js,json}', {}, (err, files) => {
  files.forEach(function (filepath) {
    let name = filepath
      .replace(new RegExp(srcPath), '')
      .replace(/\.(json|js)$/, '')
    let data = require(filepath)

    if (typeof data !== 'object') {
      console.log('skipped: ' + name)
      return
    }

    let pathParts = name.replace(/^\//, '').split('/')
    let pathDir = ''
    let pathFilename = pathParts[pathParts.length - 1]

    if(pathParts.length > 1) {
      pathDir = pathParts.slice(1).join('_').replace(/-/g, '_')
    }

    pathDir = path.join(destPath, pathDir);

    try {
      fs.ensureDirSync(pathDir)
      let absDestFile = path.join(pathDir, pathFilename) + '.json'
      console.log(name, '=>', absDestFile)
      fs.writeJsonSync(absDestFile, data, {spaces: 2})
    } catch (e) {
      console.error('failed: ' + name + ' // ' + e.message)
      throw e
    }
  })
})
