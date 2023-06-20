import { arrayShuffle } from './arrayShuffle'

Math.random = jest
  .fn()
  .mockReturnValue(0.01)
  .mockReturnValue(0.83)
  .mockReturnValue(0.51)
  .mockReturnValue(0.22)
  .mockReturnValue(0.167)

describe('arrayShuffle', () => {
  it('should shuffle the array', () => {
    const arr = [1, 2, 3, 4, 5]
    const expectedArr = [2, 3, 4, 5, 1]
    const shuffledArr = arrayShuffle(arr)

    expect(shuffledArr).toEqual(expectedArr)
  })
})
