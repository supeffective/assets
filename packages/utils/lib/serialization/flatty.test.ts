import { describe, expect, it } from 'vitest'

import flatty from './flatty'

describe('flatten', () => {
  it('converts a nested object structure into a flattened structure', () => {
    let obj = {
      person: {
        email: 'john.doe@example.com',
        addresses: [
          {
            street: '123 Main St',
            city: 'Anytown',
          },
          {
            street: '456 Main St',
            city: 'Downtown',
          },
        ],
      },
    }

    let expected = {
      'person.email': 'john.doe@example.com',
      'person.addresses[0].street': '123 Main St',
      'person.addresses[0].city': 'Anytown',
      'person.addresses[1].city': 'Downtown',
      'person.addresses[1].street': '456 Main St',
    }

    expect(flatty.flatten(obj)).toEqual(expected)
  })

  // same with an array:
  it('converts a nested array structure into a flattened structure', () => {
    const arr = { data: [1, 2, [3, 4, [5, 6, [7, 8]]]] }
    const expectedStruct = {
      'data[0]': 1,
      'data[1]': 2,
      'data[2][0]': 3,
      'data[2][1]': 4,
      'data[2][2][0]': 5,
      'data[2][2][1]': 6,
      'data[2][2][2][0]': 7,
      'data[2][2][2][1]': 8,
    }

    expect(flatty.flatten(arr)).toEqual(expectedStruct)
  })
})

describe('unflatten', () => {
  it('restores a flattened object to its original structure', () => {
    let flattened = {
      'person.email': 'john.doe@example.com',
      'person.addresses[0].street': '123 Main St',
      'person.addresses[0].city': 'Anytown',
    }

    let expected = {
      person: {
        email: 'john.doe@example.com',
        addresses: [
          {
            street: '123 Main St',
            city: 'Anytown',
          },
        ],
      },
    }

    expect(flatty.unflatten(flattened)).toEqual(expected)
  })

  it('restores a flattened array to its original structure', () => {
    const flattened = {
      'data[0]': 1,
      'data[1]': 2,
      'data[2][0]': 3,
      'data[2][1]': 4,
      'data[2][2][0]': 5,
      'data[2][2][1]': 6,
      'data[2][2][2][0]': 7,
      'data[2][2][2][1]': 8,
    }

    const expected = { data: [1, 2, [3, 4, [5, 6, [7, 8]]]] }
    expect(flatty.unflatten(flattened)).toEqual(expected)
  })
})
