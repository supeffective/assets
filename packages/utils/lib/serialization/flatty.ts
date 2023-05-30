type Primitive = string | number | boolean | null
type FlattenedObject = { [path: string]: Primitive }
type AnyJson = Primitive | AnyJson[] | { [key: string]: AnyJson }

class Flat {
  flatten(obj: AnyJson, path: string = ''): FlattenedObject {
    let flatObject: FlattenedObject = {}

    if (Array.isArray(obj)) {
      for (let i = 0; i < obj.length; i++) {
        const newPath = `${path}[${i}]`
        Object.assign(flatObject, this.flatten(obj[i], newPath))
      }

      if (obj.length === 0) {
        Object.assign(flatObject, { [path]: [] })
      }

      return flatObject
    }

    if (typeof obj === 'object' && obj !== null) {
      for (let key in obj) {
        const newPath = path ? `${path}.${key}` : key
        Object.assign(flatObject, this.flatten((obj as { [key: string]: AnyJson })[key], newPath))
      }

      return flatObject
    }

    flatObject[path] = obj

    return flatObject
  }

  unflatten(obj: FlattenedObject): AnyJson {
    const unflattened: AnyJson = {}

    const ensureExists = (obj: any, key: string | number, isArray: boolean) => {
      if (obj[key] === undefined) {
        obj[key] = isArray ? [] : {}
      }
    }

    const assignValue = (currentObj: any, pathParts: (string | number)[], value: Primitive) => {
      const isLastPart = pathParts.length === 1
      const [part, ...restParts] = pathParts

      ensureExists(currentObj, part, typeof restParts[0] === 'number')

      if (isLastPart) {
        currentObj[part] = value
      } else {
        assignValue(currentObj[part], restParts, value)
      }
    }

    for (let path in obj) {
      const pathParts = path
        .split(/[\.\[\]]/)
        .filter(Boolean)
        .map(part => (isNaN(Number(part)) ? part : Number(part)))
      assignValue(unflattened, pathParts, obj[path])
    }

    return unflattened
  }
}

export default new Flat()
