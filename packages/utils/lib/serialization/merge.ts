export function softMerge<T extends object = {}>(left: T, ...right: Array<T | Partial<T>>): T {
  return Object.assign({}, left, ...right)
}
