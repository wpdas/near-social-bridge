import request from '../request/request'
import { API_KEYS } from '../constants'

type Options = {
  method?: string
  headers?: HeadersInit
  body?: BodyInit | null
}

/**
 * Fetch data from the URL. It's a wrapper around the fetch function from the browser behind the BOS.
 *
 * You need to use this feature in order to make API calls from inside the BOS. Regular fetch API won't work.
 * @param url URL to fetch
 * @param options Fetch options
 * @returns
 */
export const fetch = <R extends {}>(url: string, options?: Options) =>
  request<R>(API_KEYS.API_FETCH_ASYNC_FETCH, { url, options }, { forceTryAgain: true })
