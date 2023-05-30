export function hasDevFeaturesEnabled(): boolean {
  return isDevelopmentEnv() && !isCIEnv()
}

export function isProductionEnv(): boolean {
  return _getEnvName() === 'production'
}

export function isDevelopmentEnv(): boolean {
  return _getEnvName() === 'development'
}

export function isPreviewEnv(): boolean {
  return _getEnvName() === 'preview'
}

export function isCIEnv(): boolean {
  return !!process.env['CI']
}

export function isServerSide(): boolean {
  return typeof window === 'undefined'
}

export function isClientSide(): boolean {
  return typeof window !== 'undefined'
}

export function assureServerSide(): void {
  if (!isServerSide()) {
    throw new Error(
      'This script is SERVER-ONLY and should not be imported or executed in browser environments.'
    )
  }
}

export function assureClientSide(): void {
  if (!isClientSide()) {
    throw new Error(
      'This script is CLIENT-ONLY and should not be imported or executed in server environments.'
    )
  }
}

function _getEnvName(): string {
  return (process.env.VERCEL_ENV as string) || (process.env['NODE_ENV'] as string) || 'development'
}
