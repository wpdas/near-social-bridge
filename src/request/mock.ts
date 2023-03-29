import { faker } from '@faker-js/faker'
import { REQUEST_KEYS } from '../constants'
import { UserInfo } from '../services/bridge-service'
import isDevelopment from '../utils/isDevelopment'
import isLocalDev from '../utils/isLocalDev'

/**
 * Global mock state
 */
export const globalMock: Record<string, Function> = {
  // Minimum mocked answers to make it works locally (localhost)
  // auto inject "nsb:navigation:sync-content-height" mock
  [REQUEST_KEYS.NAVIGATION_SYNC_CONTENT_HIGHT_VIEWER]: () => null,
}
let mockOptions: { delay: number } = { delay: 500 }

/**
 * Returns a fake user info - Util for Auth hook and contexts
 * @returns
 */
export const createMockUser = (defaultValues?: {
  accountId?: string
  firstName?: string
  middleName?: string
  backgroundImage?: string
  imageIPFScid?: string
}): UserInfo => {
  const userFirstName = defaultValues?.firstName || faker.name.firstName()
  const userMiddleName = defaultValues?.middleName || faker.name.middleName()
  const linktree = faker.internet.domainName()
  return {
    accountId:
      defaultValues?.accountId || `${faker.internet.userName(userFirstName, userMiddleName)}.near`.toLowerCase(),
    profileInfo: {
      backgroundImage: {
        url:
          defaultValues?.backgroundImage ||
          'https://media.licdn.com/dms/image/C4E16AQGYJPypiink2w/profile-displaybackgroundimage-shrink_350_1400/0/1653934756486?e=1684972800&v=beta&t=9xQG1PqqF7TpTKyoTDOIWVIigxo3wdgmu0eDBw5uwug',
      },
      description: faker.random.words(10),
      name: `${userFirstName} ${userMiddleName}`,
      image: {
        ipfs_cid:
          defaultValues?.imageIPFScid ||
          'https://ipfs.near.social/ipfs/bafkreibexmm5sv6i4dlod2awyjciftb3fu3y63wkcsky6wxyei4kzj3v2a',
      },
      linktree: {
        github: linktree,
        twitter: linktree,
        telegram: linktree,
        website: faker.internet.url(),
      },
    },
  }
}

/**
 * Get mocked response for a given request
 * @param requestType request type
 * @returns mocked response
 */
export const getMockedResponse = async <Data extends {}>(requestType: string, payload?: {}) => {
  return new Promise<Data>((resolve) => {
    if (isDevelopment && isLocalDev && Object.keys(globalMock).length > 0) {
      const response = globalMock[requestType] ?? null
      setTimeout(() => {
        resolve(response(payload))
      }, mockOptions.delay)
    }
  })
}

/**
 * Create and register a new mock for requests. This helps you create the contracts for
 * each request before implementing them inside the Widget.
 * @param requestType Request type
 * @param handler Mocked request handler (mocks server-side)
 */
export const createMock = (requestType: string, handler: Function) => {
  globalMock[requestType] = handler
}

/**
 * Setup mock
 * @param options
 * @returns
 */
export const setupMock = (options: { delay: number }) => (mockOptions = { ...mockOptions, ...options })

/**
 * Mock authenticated user. You can use `createMockUser()` method to provide the user object
 * @param userInfo
 * @returns
 */
export const mockUser = (userInfo: UserInfo) => createMock(REQUEST_KEYS.AUTH_GET_USER_INFO, () => userInfo)
