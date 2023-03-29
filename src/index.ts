import isDevelopment from './utils/isDevelopment'
import { initRefreshService } from './utils/refresh'

export * from './bridge'
export * from './navigation'
export * from './request'
export * from './services'
export * from './session-storage'
export * from './auth'
export { default as useInitialPayload } from './hooks/useInitialPayload'

// DEV Utils features
if (isDevelopment) {
  initRefreshService()
}
