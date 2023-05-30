import fs from 'node:fs'
import path from 'node:path'
import { SafeParseReturnType, z } from 'zod'

import { Pokemon, pokemonSchema } from '../schemas/pokemon'

const pokemonList = require('@pkg/assets/data/pokemon.json')

const listSchema = z.array(pokemonSchema)
const baseImageDir = path.resolve(path.join(__dirname, '../../../assets/images/pokemon'))
const imageDirNames = ['gen8-icon', 'home2d-icon', 'home3d-icon']

const validateSchema = () => {
  const errors: string[] = []
  // validate data structure
  const parsed: SafeParseReturnType<any, any> = listSchema.safeParse(pokemonList)
  const errorMsg = parsed.success ? '' : String(parsed.error)
  if (!parsed.success) {
    errors.push(errorMsg)
  }

  return errors
}

console.log('')
console.log('Validating pokemon...')

const validateImages = () => {
  const errors: string[] = []

  const checkFile = (dirName: string, pkm: Pokemon, shiny: boolean) => {
    const baseName = path.join(dirName, `${shiny ? 'shiny' : 'regular'}/${pkm.nid}.png`)
    const imageFile = path.join(baseImageDir, baseName)

    if (!fs.existsSync(imageFile)) {
      errors.push(`❌ ${baseName} (${pkm.id})`)
    }
  }
  pokemonList.forEach((pkm: Pokemon) => {
    imageDirNames.forEach(dirName => {
      checkFile(dirName, pkm, false)
      checkFile(dirName, pkm, true)
    })
  })

  return errors
}

const validateForeignKeys = () => {
  const errors: string[] = []

  return errors
}

const validate = () => {
  const errors: string[] = []

  errors.push(...validateSchema())
  errors.push(...validateImages())
  errors.push(...validateForeignKeys())

  return errors
}

const errors = validate()

if (errors.length > 0) {
  console.log('')
  console.log('Errors:')
  errors.every((err, i) => {
    console.error(err)
    if (i === 20) {
      console.log('')
      console.log(`  ... and other ${errors.length - i} errors`)
    }

    return i < 20
  })
  console.log('')
  console.log(`❌ Validation failed with ${errors.length} errors`)
  console.log('')
  process.exit(1)
} else {
  console.log('')
  console.log('✅ Validation passed')
  console.log('')
}
