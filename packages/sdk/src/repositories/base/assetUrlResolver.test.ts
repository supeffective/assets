import { createAssetUrlResolver } from './assetUrlResolver'

describe('createAssetUrlResolver', () => {
  const baseUrl = 'https://example.com/supereffective-assets/assets'
  const assetUrlResolver = createAssetUrlResolver(baseUrl)

  test('should return an object with baseUri and resolveUri function', () => {
    expect(assetUrlResolver).toBeDefined()
    expect(assetUrlResolver).toHaveProperty('baseUri', baseUrl)
    expect(assetUrlResolver.resolveUri).toBeInstanceOf(Function)
  })

  test('resolveUri should return the correct URL', () => {
    const relativePath = 'test.png'
    const expectedUri = `${baseUrl}/test.png`

    expect(assetUrlResolver.resolveUri(relativePath)).toBe(expectedUri)
  })

  test('pokemonImg should return the correct URL with default arguments', () => {
    const nid = '25'
    const expectedUri = `${baseUrl}/images/pokemon/home3d-icon/regular/25.png`

    expect(assetUrlResolver.pokemonImg(nid, 'home3d-icon')).toBe(expectedUri)
  })

  test('pokemonImg should return the correct URL with shiny argument', () => {
    const nid = '25'
    const expectedUri = `${baseUrl}/images/pokemon/home3d-icon/shiny/25.png`

    expect(assetUrlResolver.pokemonImg(nid, 'home3d-icon', true)).toBe(expectedUri)
  })

  test('gameImg should return the correct URL with default arguments', () => {
    const id = 'red-blue'
    const expectedUri = `${baseUrl}/images/games/icons-circle/red-blue.png`

    expect(assetUrlResolver.gameImg(id, 'icons-circle')).toBe(expectedUri)
  })

  test('itemImg should return the correct URL with default arguments', () => {
    const id = 'potion'
    const expectedUri = `${baseUrl}/images/items/gen9-style/potion.png`

    expect(assetUrlResolver.itemImg(id, 'gen9-style')).toBe(expectedUri)
  })

  test('markImg should return the correct URL with default arguments', () => {
    const id = '123'
    const expectedUri = `${baseUrl}/images/marks/gen9-style/123.png`

    expect(assetUrlResolver.markImg(id, 'gen9-style')).toBe(expectedUri)
  })

  test('ribbonImg should return the correct URL with default arguments', () => {
    const id = '456'
    const expectedUri = `${baseUrl}/images/ribbons/gen9-style/456.png`

    expect(assetUrlResolver.ribbonImg(id, 'gen9-style')).toBe(expectedUri)
  })

  test('typeImg should return the correct URL with default arguments', () => {
    const id = 'fire'
    const expectedUri = `${baseUrl}/images/types/gen9-style/fire.png`

    expect(assetUrlResolver.typeImg(id, 'gen9-style')).toBe(expectedUri)
  })

  test('typeImg should return the correct URL with withBg argument', () => {
    const id = 'water'
    const expectedUri = `${baseUrl}/images/types/gen9-style/water-bg.png`

    expect(assetUrlResolver.typeImg(id, 'gen9-style', true)).toBe(expectedUri)
  })

  test('originMarkImg should return the correct URL', () => {
    const id = 'xyz'
    const expectedUri = `${baseUrl}/images/origin-marks/xyz.png`

    expect(assetUrlResolver.originMarkImg(id)).toBe(expectedUri)
  })
})
