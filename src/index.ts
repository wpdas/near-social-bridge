import isDevelopment from './utils/isDevelopment'
import { initRefreshService } from './utils/refresh'

export * from './bridge'
export * from './navigation'
export { default as request } from './request'
export * from './services'
export * from './session-storage'
export * from './auth'

// DEV Utils features
if (isDevelopment) {
  initRefreshService()
}
