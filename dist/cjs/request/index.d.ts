export type ResponseData<D extends {}> = {
    from: 'external-app';
    type: 'connect' | 'answer';
    requestType: string;
    payload: D;
};
/**
 * Build a request body
 * @param type Request type to be handled inside the View
 * @param payload Request payload
 * @returns
 */
export declare const buildRequestBody: (type: string, payload?: {}) => {
    from: string;
    type: string;
    payload: {} | undefined;
};
/**
 * Send a request to the Near Social View
 * @param requestType Request type to be handled inside the View (you can use `buildRequestBody` in order to
 * follow the pattern)
 * @param payload Any payload to be sent to the View
 * @returns
 */
declare const request: <Data extends {}>(requestType: string, payload?: {}) => Promise<Data>;
export default request;
