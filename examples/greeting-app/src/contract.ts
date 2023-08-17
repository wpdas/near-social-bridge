import { Near } from 'near-social-bridge'

const CONTRACT_ID = 'dev-1692221685438-15421910364142'

export const get_greeting = () => Near.view<string>(CONTRACT_ID, 'get_greeting')

export const set_greeting = (greeting: string) =>
  Near.call<{ message: string }>(CONTRACT_ID, 'set_greeting', {
    message: greeting,
  })
