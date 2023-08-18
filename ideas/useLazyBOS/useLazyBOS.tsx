/**
 * This is just code trying to make the feature work, LOL. Don't take the quality here into consideration
 */

import React, { useEffect, useState } from 'react'
import { Social } from '../../api' // You can use "import { Social } from 'near-social-bridge/api'"
import { VM } from './vm/vm' // You need to copy this "vm" folder and use it

const fetchComponentGlobal = async (source: string) => {
  const widgetCode = await Social.get<string>(source)

  const vm = new VM({
    rawCode: widgetCode,
  })

  const componentProps = {}
  const component = vm.renderCode(componentProps)

  return component
}

const queue: { id: string; done: boolean; comp?: () => JSX.Element }[] = []
let running = false
const down = () => {
  const init = (index: number) => {
    if (queue[index]) {
      setTimeout(async () => {
        const currentComponent = await fetchComponentGlobal(queue[index].id)
        console.log(currentComponent, index, queue[index].id)

        if (currentComponent.key) {
          queue[index].comp = () => currentComponent as JSX.Element
        } else {
          queue[index].comp = () => (
            <p
              style={{
                fontWeight: 600,
                color: '#AB2E28',
                fontFamily: 'Courier new',
              }}
            >
              <strong>{queue[index].id}</strong> not found
            </p>
          )
        }

        queue[index].done = true

        // Update in real time
        // setComponents([...componentsLoader]);

        init(index + 1)
      }, 200)
    } else {
      // Final update
      // setComponents([...componentsLoader]);
      running = false
    }
  }

  if (!running) {
    running = true
    init(0)
  }
}

const useLazyBOS = (componentSourceAddress: string) => {
  const [Component, setComponent] = useState(<div />)

  useEffect(() => {
    queue.push({ id: componentSourceAddress, done: false })
    down()

    const check = () => {
      const currentProcess = queue.find((el) => el.id === componentSourceAddress)
      if (currentProcess && currentProcess.done) {
        setComponent(currentProcess.comp!)
      } else {
        setTimeout(check, 1000)
      }
    }

    check()
  }, [])

  // eslint-disable-next-line react/display-name
  return () => <>{Component}</>
}

export default useLazyBOS
