import { SavableTypes } from './types'

export function savingOperations<T extends SavableTypes>(defaultValue: T) {
  if (defaultValue instanceof Set) {
    return {
      parse: (value: string) => new Set(JSON.parse(value)),
      stringify: (value: T) => JSON.stringify(Array.from(value as Set<string>)),
    }
  } else if (typeof defaultValue === 'object') {
    return {
      parse: (value: string) => JSON.parse(value),
      stringify: (value: T) => JSON.stringify(value),
    }
  } else {
    return {
      parse: (value: string) => value,
      stringify: (value: T) => value,
    }
  }
}
