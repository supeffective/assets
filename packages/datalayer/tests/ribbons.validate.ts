import fs from 'node:fs'
import path from 'node:path'
import { SafeParseReturnType, z } from 'zod'

import { Ribbon, ribbonSchema } from '../schemas/ribbons'

const recordList = require('@pkg/assets/data/ribbons.json')

const listSchema = z.array(ribbonSchema)
const baseImageDir = path.resolve(path.join(__dirname, '../../../assets/images/ribbons'))
const imageDirNames = ['gen9-style']

const validateSchema = () => {
  const errors: string[] = []
  const parsed: SafeParseReturnType<any, any> = listSchema.safeParse(recordList)
  const errorMsg = parsed.success ? '' : String(parsed.error)
  if (!parsed.success) {
    errors.push(errorMsg)
  }

  return errors
}

const validateImages = () => {
  const errors: string[] = []

  const checkFile = (dirName: string, row: Ribbon) => {
    const baseName = path.join(dirName, `${row.id}.png`)
    const imageFile = path.join(baseImageDir, baseName)

    if (!fs.existsSync(imageFile)) {
      errors.push(`❌ ${baseName} (${row.id})`)
    }
  }
  recordList.forEach((row: Ribbon) => {
    imageDirNames.forEach(dirName => {
      checkFile(dirName, row)
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

console.log('')
console.log('Validating ribbons...')

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
