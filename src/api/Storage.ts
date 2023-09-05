import { API_KEYS } from '../constants'
import { request } from '../request'

/**
 * `Storage.get(key, widgetSrc?)` - returns the public value for a given key under the
 * given widgetSrc or the current component if `widgetSrc` is omitted. Can only read public values.
 *
 * https://docs.near.org/bos/api/storage#storageget
 * @param key a user-defined key
 * @param widgetSrc a user-defined component
 * @returns
 */
export const get = <R extends {}>(key: string, widgetSrc?: string) =>
  request<R>(API_KEYS.API_STORAGE_GET, { key, widgetSrc }, { forceTryAgain: true })

/**
 * `Storage.set(key, value)` - sets the public value for a given key under the current widget.
 * The value will be public, so other widgets can read it.
 *
 * https://docs.near.org/bos/api/storage#storageset
 * @param key a user-defined key
 * @param value a user-defined value
 * @returns
 */
export const set = <R extends {}>(key: string, value: any) =>
  request<R>(API_KEYS.API_STORAGE_SET, { key, value }, { forceTryAgain: true })

/**
 * `Storage.privateGet(key)` - returns the private value for a given key under the current component.
 *
 * https://docs.near.org/bos/api/storage#storageprivateget
 * @param key a user-defined key under the current component
 * @returns
 */
export const privateGet = <R extends {}>(key: string) =>
  request<R>(API_KEYS.API_STORAGE_PRIVATE_GET, { key }, { forceTryAgain: true })

/**
 * `Storage.privateSet(key, value)` - sets the private value for a given key under the current component.
 * The value is private, only the current component can read it.
 *
 * https://docs.near.org/bos/api/storage#storageprivateset
 * @param key a user-defined key under the current component
 * @param value a user-defined value
 * @returns
 */
export const privateSet = <R extends {}>(key: string, value: any) =>
  request<R>(API_KEYS.API_STORAGE_PRIVATE_SET, { key, value }, { forceTryAgain: true })
