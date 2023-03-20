import React from 'react';
import { NavigationProps, ParamListBase } from '../types';
export declare const NavigationContext: React.Context<NavigationProps<ParamListBase>>;
type NavigationProviderProps = {
    children: React.ReactNode;
    /**
     * Should load the page according to the provided path?
     * You must wrap this Provider with the NearSocialBridgeProvider!
     * This is going to use the `urlParams` prop provided during the connection between the Viewer and this App
     *
     * Make sure you are passing thrhoug `urlParams` with the welcomePayload, e.g:
     *
     * // SETUP: [Navigation] Get URL params
     * const urlParams = props.r;
     *
     * const welcomePayload = {
     *  type: "connect",
     *  payload: {
     *    urlParams
     * }
     *
     * SETUP: Set initial state
     * State.init({ currentMessage: welcomePayload });
     *
     */
    useCurrentPath?: boolean;
};
/**
 * DEV - Used to keep the same route when the app is reloaded after the developer
 * makes change to the app code.
 *
 * This prop is used by the `createStackNavigator` method
 */
export declare let initialRoute: string | undefined;
declare const NavigationProvider: React.FC<NavigationProviderProps>;
export default NavigationProvider;
