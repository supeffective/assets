export type PlainDate = { _type: 'Date'; _value: string }
export type PlainMap = { _type: 'Map'; _value: [any, any][] }
export type PlainSet = { _type: 'Set'; _value: any[] }

export function plainObjectFrom<T = any>(value: any): T {
  if (value instanceof Date) {
    return { _type: 'Date', _value: value.toISOString() } as T
  }

  if (value instanceof Map) {
    return {
      _type: 'Map',
      _value: Array.from(value.entries()).map(([key, value]) => [
        plainObjectFrom(key),
        plainObjectFrom(value),
      ]),
    } as T
  }

  if (value instanceof Set) {
    return {
      _type: 'Set',
      _value: Array.from(value).map(plainObjectFrom),
    } as T
  }

  if (Array.isArray(value)) {
    return value.map(plainObjectFrom) as T
  }

  if (value instanceof Object) {
    return Object.entries(value).reduce((acc: any, [key, value]) => {
      acc[key] = plainObjectFrom(value)

      return acc
    }, {})
  }

  return value
}

export function plainObjectDecode<T = any>(value: any): T {
  if (Array.isArray(value)) {
    return value.map(plainObjectDecode) as T
  }
  if (value instanceof Object) {
    if (value._type === 'Date') {
      return new Date(value._value) as T
    }

    if (value._type === 'Map') {
      return new Map(
        value._value.map(([key, value]: any) => [plainObjectDecode(key), plainObjectDecode(value)])
      ) as T
    }

    if (value._type === 'Set') {
      return new Set(value._value.map(plainObjectDecode)) as T
    }

    return Object.entries(value).reduce((acc: any, [key, value]) => {
      acc[key] = plainObjectDecode(value)

      return acc
    }, {})
  }

  return value
}
