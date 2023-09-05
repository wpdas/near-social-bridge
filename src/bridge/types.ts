export type GetMessageCallBack = (event: MessageEvent<any>) => void

export interface NearSocialBridgeProps {
  postMessage: (message: any) => void
  onGetMessage: (cb: GetMessageCallBack | null) => void
}
