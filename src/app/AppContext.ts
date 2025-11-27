import React from 'react';
import { ScaledSize, StatusBarStyle } from 'react-native';
import { SafeAreaEdges } from './types';

export type AppContextType = {
	safeAreaEdges: SafeAreaEdges;
	setSafeAreaEdges: (arr: SafeAreaEdges) => void;
	statusBarStyle: StatusBarStyle;
	setStatusBarStyle: (style: StatusBarStyle) => void;
	// isDeviceInPortraitOrientation: boolean;
	deviceSize: ScaledSize;
	//   isTablet: boolean;
	isLandscape: boolean;
};

export const AppContext = React.createContext<AppContextType>(null as any);

export default AppContext;
