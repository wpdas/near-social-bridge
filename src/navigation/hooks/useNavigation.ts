import { useContext } from 'react'
import { NavigationContext } from '../contexts/NavigationProvider'
import { NavigationProps, ParamListBase } from '../types'

const useNavigation = <P extends ParamListBase>() =>
  useContext<NavigationProps<P>>(NavigationContext as unknown as React.Context<NavigationProps<P>>)
export default useNavigation
