import React from 'react';
import { ParamListBase } from './types';
/**
 * Create and provides a Navigator (Routes controler) and Screen (Route component).
 * You can provide a fallback component. If it's provided, it'll be shown until the connection
 * with the Viewer is established
 *
 * @param fallback Fallback component. If provided, it'll be shown until the connection
 * with the Viewer is established
 * @returns
 */
declare const createStackNavigator: <T extends ParamListBase>(fallback?: React.ReactNode) => {
    Navigator: React.FC<{
        children: React.ReactNode;
    }>;
    Screen: React.FC<Readonly<{
        key?: string | undefined;
        iframeHeight?: number | undefined;
        name: keyof T;
        component: React.ComponentType<any>;
        pathParams?: string | undefined;
    }>>;
};
export default createStackNavigator;
