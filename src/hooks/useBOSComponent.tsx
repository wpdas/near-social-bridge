import React from 'react'
import BOSComponent, { BOSComponentProps, ParamsProps } from '../components/BOSComponent'

/**
 * Experimental - Load BOS Components with props using iframe
 * @returns
 */
const useBOSComponent = (componentProps: Exclude<BOSComponentProps, 'props'>) => {
  // eslint-disable-next-line react/display-name
  return (props?: ParamsProps) => <BOSComponent {...componentProps} props={props} />
}

export default useBOSComponent
