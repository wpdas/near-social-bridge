/**
 * Queue Stack
 *
 * This is used to ensure that all asynchronous calls in the queue are called one at a time.
 */

type Caller = { caller: () => Promise<any>; onComplete: (data: any) => void; onFail: (error: any) => void }

let queue: Caller[] = []
let running = false

const processItem = async (itemIndex: number) => {
  // Process call
  try {
    const result = await queue[itemIndex].caller()
    // Send result
    queue[itemIndex].onComplete(result)
  } catch (error) {
    // Send fail error data
    queue[itemIndex].onFail(error)
  }

  // Check next item
  if (queue[itemIndex + 1]) {
    // Go and run next item
    processItem(itemIndex + 1)
  } else {
    // End queue
    running = false
    queue = []
  }
}

/**
 * Add item to the queue
 * @param caller
 * @param onComplete
 * @param onFail
 */
export const addItem = (caller: () => Promise<any>, onComplete: (data: any) => void, onFail: (error: any) => void) => {
  queue.push({ caller, onComplete, onFail })

  if (!running) {
    running = true
    processItem(0)
  }
}

/**
 * Create a caller and add it to the queue
 * @param caller
 * @returns
 */
export const createCaller = <R>(caller: () => Promise<R>) => {
  return new Promise<R>((resolve, reject) => {
    const onComplete = (result: R) => {
      resolve(result)
    }

    const onFail = (error: any) => {
      reject(error)
    }
    addItem(caller, onComplete, onFail)
  })
}
