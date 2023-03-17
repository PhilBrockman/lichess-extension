import { useEffect, useState } from 'react'
import { SavableTypes } from './types'
import { savingOperations } from './savingOperations'

export function useStorageSyncState<T extends SavableTypes>(key: string, defaultValue: T) {
  const { parse, stringify } = savingOperations(defaultValue)
  const [state, setState] = useState<T>()

  useEffect(() => {
    chrome.storage.sync.get([key], (result) => {
      console.log('useStorageSyncState', key, result)
      if (result[key] !== undefined) {
        setState(parse(result[key]))
      } else {
        setState(defaultValue)
      }
    })
  }, [])

  const setStorageState = (value: T) => {
    chrome.storage.sync.set({ [key]: stringify(value) }, () => {
      setState(value)
    })
  }

  return [state ?? defaultValue, setStorageState] as const
}
