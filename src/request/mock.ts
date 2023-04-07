import { LOCAL_MOCK_KEYS, REQUEST_KEYS } from '../constants'
import { UserInfo } from '../services/bridge-service'
import isDevelopment from '../utils/isDevelopment'
import isLocalDev from '../utils/isLocalDev'
import { loremIpsum, randName, randUserName } from '../utils/faker/elements'

/**
 * Global Mock State
 */
export const globalMock: Record<string, Function> = {}

/**
 * Mock Options
 */
let mockOptions: { delay: number } = { delay: 500 }

/**
 * Returns a fake user info - Util for Auth hook and contexts
 * @returns
 */
export const createMockUser = (defaultValues?: {
  accountId?: string
  firstName?: string
  lastName?: string
  backgroundImage?: string
  imageIPFScid?: string
}): UserInfo => {
  const userFirstName = defaultValues?.firstName || randName()
  const userLastName = defaultValues?.lastName || randName()
  const linktree = userFirstName.toLowerCase()
  return {
    accountId: defaultValues?.accountId || `${randUserName(userFirstName, userLastName)}.near`.toLowerCase(),
    profileInfo: {
      backgroundImage: {
        url:
          defaultValues?.backgroundImage ||
          'https://media.licdn.com/dms/image/C4E16AQGYJPypiink2w/profile-displaybackgroundimage-shrink_350_1400/0/1653934756486?e=1684972800&v=beta&t=9xQG1PqqF7TpTKyoTDOIWVIigxo3wdgmu0eDBw5uwug',
      },
      description: loremIpsum,
      name: `${userFirstName} ${userLastName}`,
      image: {
        ipfs_cid: defaultValues?.imageIPFScid || `https://i.pravatar.cc/150?u=${userFirstName}`,
      },
      linktree: {
        github: linktree,
        twitter: linktree,
        telegram: linktree,
        website: 'fakedomain.fake.io',
      },
    },
  }
}

/**
 * Mock the `initialPayload` prop
 * @param initialPayload
 */
export const mockInitialPayload = (initialPayload: Record<any, any>) => {
  globalMock[LOCAL_MOCK_KEYS.INITIAL_PAYLOAD] = () => initialPayload
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
