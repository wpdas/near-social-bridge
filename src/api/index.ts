import * as Near from './Near'
import * as Social from './Social'
import * as Storage from './Storage'
import { fetch } from './Fetch'

export {
  /** Convenient API to interact with the NEAR blockchain. */
  Near,
  /** Convenient API to get data from the SocialDB contract. */
  Social,
  /** `Storage` object to store data for components that is persistent across refreshes. */
  Storage,
  /**
   * Fetch data from the URL. It's a wrapper around the fetch function from the browser behind the BOS.
   *
   * You need to use this feature in order to make API calls from inside the BOS. Regular fetch API won't work.
   * @param url URL to fetch
   * @param options Fetch options
   * @returns
   */
  fetch,
}
