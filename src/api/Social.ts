import { API_KEYS } from '../constants'
import { request } from '../request'
import * as queueStack from '../utils/queueStack'

/**
 * `Social.get` fetches the data from the SocialDB contract by calling get and returns the data.
 * While the data is fetching the returned value equals to null.
 *
 * https://docs.near.org/bos/api/social#socialget
 * @param patterns the path pattern(s)
 * @param finality the block height or finality
 * @param cacheOptions the `cacheOptions` object.
 * @returns
 */
export const get = <R extends {}>(
  patterns: string | string[],
  finality?: 'final' | number,
  cacheOptions?: {
    /** if true, the method will ignore the cached value in the local DB and fetch the data from the API server. This will only happen once per session. Default is false. */
    ignoreCache: boolean
  }
) =>
  queueStack.createCaller(() =>
    request<R>(API_KEYS.API_SOCIAL_GET, { patterns, finality, cacheOptions }, { forceTryAgain: true })
  )

/**
 * `Social.getr` is just a wrapper helper for Social.get, it appends ** to each of the path pattern.
 *
 * https://docs.near.org/bos/api/social#socialgetr
 * @param patterns the path pattern(s)
 * @param finality the block height or finality
 * @param cacheOptions the `cacheOptions` object.
 * @returns
 */
export const getr = <R extends {}>(
  patterns: string | string[],
  finality?: 'final' | number,
  cacheOptions?: {
    /** if true, the method will ignore the cached value in the local DB and fetch the data from the API server. This will only happen once per session. Default is false. */
    ignoreCache: boolean
  }
) =>
  queueStack.createCaller(() =>
    request<R>(API_KEYS.API_SOCIAL_GETR, { patterns, finality, cacheOptions }, { forceTryAgain: true })
  )

/**
 * It calls the SocialDB's `keys` API and returns the data. While the data is fetching the returned value equals to `null`.
 * The keys contract doesn't unwrap the object, so the returned data is the same as the SocialDB's `keys` API.
 *
 * https://docs.near.org/bos/api/social#socialkeys
 * @param patterns the path pattern(s)
 * @param finality the block height or finality
 * @param options the `options` object.
 * @param cacheOptions the `cacheOptions` object.
 * @returns
 */
export const keys = <R extends {}>(
  patterns: string | string[],
  finality?: 'final' | number,
  options?: {
    /** Either `"History"`, `"True"`, or `"BlockHeight"`. If not specified, it will return the `"True"`.  */
    return_type?: 'History' | 'True' | 'BlockHeight'
    /** Whether to return only values (don't include objects). Default is `false`. */
    values_only?: boolean
  },
  cacheOptions?: {
    /** if true, the method will ignore the cached value in the local DB and fetch the data from the API server. This will only happen once per session. Default is false. */
    ignoreCache: boolean
  }
) =>
  queueStack.createCaller(() =>
    request<R>(API_KEYS.API_SOCIAL_KEYS, { patterns, finality, options, cacheOptions }, { forceTryAgain: true })
  )

/**
 * Returns the array of matched indexed values. Ordered by `blockHeight`.
 *
 * https://docs.near.org/bos/api/social#socialindex
 * @param action is the `index_type` from the standard, e.g. in the path `index/like` the action is `like`.
 * @param key is the inner indexed value from the standard.
 * @param options the `options` object.
 * @param cacheOptions the `cacheOptions` object.
 * @returns
 */
export const index = <R extends {}>(
  action: string,
  key: string,
  options?: {
    /** If given, it should either be a string or an array of account IDs to filter values by them. Otherwise, not filters by account Id. */
    accountId?: string | string[]
    /** Either `asc` or `desc`. Defaults to `asc`. */
    order?: 'asc' | 'desc'
    /** Defaults to `100`. The number of values to return. Index may return more than index values, if the last elements have the same block height. */
    limit?: number
    /** Defaults to `0` or `Max` depending on order. */
    from?: 0 | 'Max'
  },
  cacheOptions?: {
    /** if true, the method will ignore the cached value in the local DB and fetch the data from the API server. This will only happen once per session. Default is false. */
    ignoreCache: boolean
  }
) => queueStack.createCaller(() => request<R>(API_KEYS.API_SOCIAL_INDEX, { action, key, options, cacheOptions }))

/**
 * Takes a `data` object and commits it to SocialDB. It works similarly to the `CommitButton` by spawning the modal window prompt
 * to save data, but it doesn't have to be triggered through the commit button component.
 * It allows you to write more flexible code that relies on async promises and use other events and components.
 * Overall it enables more flexibility when committing to SocialDB. For example, you can commit when Enter key pressed.
 *
 * https://docs.near.org/bos/api/social#socialset
 * @param data the data object to be committed. Similar to `CommitButton`, it shouldn't start with an account ID.
 * @returns
 */
export const set = async <R extends {}>(data: {}) =>
  queueStack.createCaller(() => request<R>(API_KEYS.API_SOCIAL_SET, { data }))
