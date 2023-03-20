import { useEffect, useState } from 'react'
import sessionStorage, { sessionStorageUpdateObservable } from '../sessionStorage'

/**
 * Returns storage with the most updated items
 *
 * e.g:
 *
 * sessionStorage.setItem('age', 32)
 *
 * then
 *
 * const storage = useSessionStorage()
 * console.log(storage?.age); // 32
 * @returns
 */
const useSessionStorage = () => {
  const [storage, setStorage] = useState<any>()

  useEffect(() => {
    const handle = () => {
      const updatedStorage: any = {}
      sessionStorage.keys().forEach((storageKey) => {
        updatedStorage[storageKey] = sessionStorage.getItem(storageKey)
      })

      setStorage(updatedStorage)
    }

    // Update the storage every time it's updated
    sessionStorageUpdateObservable.subscribe(handle)

    return () => {
      sessionStorageUpdateObservable.unsubscribe(handle)
    }
  }, [])

  return storage
}

export default useSessionStorage
