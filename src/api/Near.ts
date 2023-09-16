import request from '../request/request'
import { API_KEYS } from '../constants'
import * as queueStack from '../utils/queueStack'
const ONE_DAY_MS = 86400000

/**
 * View
 * @param contractName Name of the smart contract
 * @param methodName Name of the method to call
 * @param args Arguments to pass to the method
 * @param blockId Block ID or finality of the transaction
 * @returns
 */
export const view = <R extends {}>(contractName: string, methodName: string, args?: {}, blockId?: string) =>
  queueStack.createCaller(() => request<R>(API_KEYS.API_NEAR_VIEW, { contractName, methodName, args, blockId }))

/**
 * Call
 * @param contractName Name of the smart contract to call
 * @param methodName Name of the method to call on the smart contract
 * @param args Arguments to pass to the smart contract method as an object instance
 * @param gas Maximum amount of gas to be used for the transaction (default 300Tg)
 * @param deposit Amount of NEAR tokens to attach to the call as deposit (in yoctoNEAR units)
 */
export const call = <R extends {}>(
  contractName: string,
  methodName: string,
  args?: {},
  gas?: string | number,
  deposit?: string | number
  // Use ONE_DAY_MS to call this method only once. The dev should get the updated data after accepting the transaction
) =>
  queueStack.createCaller(() =>
    request<R>(API_KEYS.API_NEAR_CALL, { contractName, methodName, args, gas, deposit }, { timeout: ONE_DAY_MS })
  )
