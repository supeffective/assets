import type { AssetUrlResolver } from './types'

export function createAssetUrlResolver(baseUrl: string): AssetUrlResolver {
  const client: AssetUrlResolver = {
    baseUri: baseUrl, // e.g. 'https://itsjavi.com/supereffective-assets/assets',
    resolveUri(relativePath) {
      return `${this.baseUri}/${relativePath.replace(/^\//, '')}`
    },
    pokemonImg(nid, variant = 'home3d-icon', shiny = false) {
      return this.resolveUri(`/images/pokemon/${variant}/${shiny ? 'shiny' : 'regular'}/${nid}.png`)
    },
    gameImg(id, variant = 'icons-circle') {
      return this.resolveUri(`/images/games/${variant}/${id}.png`)
    },
    itemImg(id, variant = 'gen9-style') {
      return this.resolveUri(`/images/items/${variant}/${id}.png`)
    },
    markImg(id, variant = 'gen9-style') {
      return this.resolveUri(`/images/marks/${variant}/${id}.png`)
    },
    ribbonImg(id, variant = 'gen9-style') {
      return this.resolveUri(`/images/ribbons/${variant}/${id}.png`)
    },
    typeImg(id, variant = 'gen9-style', withBg = false) {
      return this.resolveUri(`/images/types/${variant}/${id}${withBg ? '-bg' : ''}.png`)
    },
    originMarkImg(id) {
      return this.resolveUri(`/images/origin-marks/${id}.png`)
    },
  }

  return client
}
