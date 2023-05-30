console.log('VALIDATING ALL DATA...')

const errors: string[] = []
const warnings: string[] = []

// Run the validations here
// -----
// End of validations

if (errors.length > 0) {
  console.log('DATA HAS ERRORS:')
  errors.forEach(msg => console.error(msg))
}

if (warnings.length > 0) {
  console.log('DATA HAS WARNINGS:')
  warnings.forEach(msg => console.warn(msg))
}

if (errors.length === 0 && warnings.length === 0) {
  console.log('✅ ALL DATA IS VALID.')
} else if (errors.length > 0) {
  console.error('❌ VALIDATION FAILED WITH ERRORS.')
  process.exit(1)
} else if (warnings.length > 0) {
  console.warn('🚸 DATA IS MOSTLY VALID, but it has some WARNINGS.')
}

console.log('DONE.')
