import 'react-native-gesture-handler';
import React, { useCallback, useEffect, useState } from 'react';
import {
	ImageBackground,
	StatusBar,
	StatusBarStyle,
	useWindowDimensions,
	StyleSheet,
	DevSettings,
} from 'react-native';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import SplashScreen from 'react-native-splash-screen';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MMKV } from 'react-native-mmkv';

import { ThemeProvider } from '@/theme';

import '../translations';
import { GlobalHeaderContextProvider } from '@/contexts';
import { SwipeOverlay } from '@/components/template/SwipeOverlay';
import { loadConfig } from '@/reducers/configReducer';
import AppBg from '@/theme/assets/images/app_bg.png';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ErrorBoundary } from '@/components/template/ErrorBoundary';
import { RootState } from './rootReducer';
import { SafeAreaEdges } from './types';
import AppContext from './AppContext';
import ApplicationNavigator from '../navigators/RootNavigator';
import store, { useAppDispatch } from './store';

const queryClient = new QueryClient();

export const storage = new MMKV();

if (__DEV__) {
	DevSettings.addMenuItem('Clear Storage', async () => {
		await AsyncStorage.clear();
		DevSettings.reload();
	});
}

function App() {
	const dispatch = useAppDispatch();
	const [safeAreaEdges, setSafeAreaEdges] = useState<SafeAreaEdges>([
		'top',
		'bottom',
		'right',
		'left',
	]);
	const [currentStatusBarStyle, setStatusBarStyle] =
		useState<StatusBarStyle>('light-content');
	const [hydrationProgress, setHydrationProgress] = useState(0);
	const dimensions = useWindowDimensions();
	const { isHydrated } = useSelector((state: RootState) => state.config);
	const isLandscape = dimensions.width > dimensions.height;

	useEffect(() => {
		StatusBar.setBarStyle(currentStatusBarStyle, true);
	}, [currentStatusBarStyle]);

	useEffect(() => {
		SplashScreen.hide();
		dispatch(loadConfig());
	}, []);

	useEffect(() => {
		let timeout1: any;
		let timeout2: any;
		if (__DEV__) {
			setHydrationProgress(100);
		} else {
			setHydrationProgress(30);
			timeout1 = setTimeout(() => {
				setHydrationProgress(50);
			}, 2000);
			timeout2 = setTimeout(() => {
				setHydrationProgress(90);
			}, 3500);
		}
		return () => {
			clearTimeout(timeout1);
			clearTimeout(timeout2);
		};
	}, []);

	useEffect(() => {
		let timeout: any;
		if (hydrationProgress === 90 && isHydrated) {
			timeout = setTimeout(() => {
				setHydrationProgress(100);
			}, 800);
		}
		return () => {
			clearTimeout(timeout);
		};
	}, [hydrationProgress, isHydrated]);

	return (
		<SafeAreaProvider>
			<AppContext.Provider
				value={{
					safeAreaEdges,
					setSafeAreaEdges,
					statusBarStyle: currentStatusBarStyle,
					setStatusBarStyle,
					deviceSize: dimensions,
					// isTablet,
					isLandscape,
				}}
			>
				<GlobalHeaderContextProvider hydrationProgress={hydrationProgress}>
					{isHydrated && <ApplicationNavigator />}
				</GlobalHeaderContextProvider>
			</AppContext.Provider>
		</SafeAreaProvider>
	);
}

function AppProvider() {
	return (
		<ThemeProvider storage={storage}>
			<ErrorBoundary>
				<Provider store={store}>
					<ImageBackground source={AppBg} style={StyleSheet.absoluteFill}>
						<App />
					</ImageBackground>
				</Provider>
			</ErrorBoundary>
		</ThemeProvider>
	);
}

export default AppProvider;
