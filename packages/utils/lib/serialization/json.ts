import { plainObjectDecode, plainObjectFrom } from './plain'

export function jsonEncode(value: any): string {
  return JSON.stringify(value, plainObjectFrom)
}

export function jsonDecode(value: string): any {
  return plainObjectDecode(JSON.parse(value))
}
