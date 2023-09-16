import { syncContentHeight } from '../navigation/syncContentHeight'

/**
 * Provides access to methods and props which can affect the BOS Component View
 */
const useWidgetView = () => {
  return {
    /**
     * Update the View height
     * @param height Height
     */
    setHeight: (height: number) => {
      syncContentHeight(height)
    },
  }
}

export default useWidgetView
