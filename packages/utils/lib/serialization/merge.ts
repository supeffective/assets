export function softMerge<T extends object = {}>(left: T, right: T | Partial<T>): T {
  const result: any = { ...left }

  for (const key in right) {
    result[key] = right[key]
  }

  return result as T
}
