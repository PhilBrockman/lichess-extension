import { useEffect, useState } from 'react'
import { SavableTypes } from './types'
import { debounce } from 'lodash'

function savingOperations<T extends SavableTypes>(defaultValue: T) {
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

export function useStorageSyncState<T extends SavableTypes>(key: string, defaultValue: T) {
  const { parse, stringify } = savingOperations(defaultValue)
  const [state, setState] = useState<T>()

  useEffect(() => {
    chrome.storage.sync.get([key], (result) => {
      if (result[key] !== undefined) {
        setState(parse(result[key]))
      } else {
        setState(defaultValue)
      }
    })
  }, [])

  useEffect(() => {
    const debouncedFn = debounce(() => {
      chrome.storage.sync.set(
        { [key]: state === undefined ? undefined : stringify(state) },
        () => {},
      )
    }, 300)

    debouncedFn()

    return () => {
      debouncedFn.cancel()
    }
  }, [state])

  const reset = () => {
    setState(defaultValue)
  }

  return [state ?? defaultValue, setState, reset] as const
}
