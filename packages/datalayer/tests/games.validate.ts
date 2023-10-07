import fs from 'node:fs'
import path from 'node:path'

import { z, type SafeParseReturnType } from 'zod'

import recordList from '@pkg/assets/data/games.json'

import { gameSchemaV2, type GameV2 } from '../schemas/games'

const listSchema = z.array(gameSchemaV2)
const baseImageDir = path.resolve(path.join(__dirname, '../../../assets/images/games'))
const imageDirNames = ['icons-circle', 'icons-square', 'logos']

const validateSchema = () => {
  const errors: string[] = []
  const parsed: SafeParseReturnType<any, any> = listSchema.safeParse(recordList)
  const errorMsg = parsed.success ? '' : String(parsed.error)
  if (!parsed.success) {
    errors.push(errorMsg)
  }

  return errors
}

const typedRecordList = recordList as GameV2[]

const validateImages = () => {
  const errors: string[] = []

  const checkFile = (dirName: string, row: GameV2) => {
    if (dirName === 'logos' && row.type !== 'game') {
      return
    }
    const ext = dirName === 'icons-square' ? 'jpg' : 'png'
    const baseName = path.join(dirName, `${row.id}.${ext}`)
    const imageFile = path.join(baseImageDir, baseName)

    if (!fs.existsSync(imageFile)) {
      errors.push(`❌ ${baseName} (${row.id})`)
    }
  }
  typedRecordList.forEach(row => {
    imageDirNames.forEach(dirName => {
      if (row.type === 'dlc') {
        return
      }
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
console.log('Validating games...')

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
