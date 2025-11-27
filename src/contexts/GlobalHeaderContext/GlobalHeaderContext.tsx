import React, {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useMemo,
	useState,
} from 'react';
import { Image, TouchableOpacity, View } from 'react-native';
import Animated, {
	clamp,
	Easing,
	FadeInLeft,
	FadeOutLeft,
	interpolate,
	runOnJS,
	useAnimatedKeyboard,
	useAnimatedReaction,
	useAnimatedStyle,
	useDerivedValue,
	useSharedValue,
	withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { NavigationContainerRef } from '@react-navigation/native';
import { styles } from '@/contexts/GlobalHeaderContext/styles';
import ChevronLeft from '@/theme/assets/images/chevron_left.png';
import { useUpsertCart } from '@/hooks/useUpsertCart';
import {
	ANIMATION_STOP_POINTS,
	IconSize,
} from '@/contexts/GlobalHeaderContext/constants';
import { ProgressBar } from '@/contexts/GlobalHeaderContext/components/ProgressBar';
import { AnimatedBuilding } from '@/contexts/GlobalHeaderContext/components/AnimatedBuildings';
import { AnimatedLogo } from '@/contexts/GlobalHeaderContext/components/AnimatedLogo';

export const navigationRef = React.createRef<NavigationContainerRef<any>>();

export interface GlobalHeaderContextType {
	animationStopPoint: ANIMATION_STOP_POINTS;
	updateStopPoint: (stopPoint: ANIMATION_STOP_POINTS) => void;
	isAppReady: boolean;
}

export const GlobalHeaderContext = createContext<GlobalHeaderContextType>(
	null as any,
);

export const useGlobalHeaderContext = () => {
	const context = useContext(GlobalHeaderContext);
	if (context === undefined) {
		throw new Error(
			'useGlobalHeaderContext must be used within a GlobalHeaderContext Provider',
		);
	}
	return context;
};

interface Props {
	hydrationProgress: number;
	children?: React.ReactNode;
}

export function GlobalHeaderContextProvider({
	hydrationProgress,
	children,
}: Props) {
	// states and contexts
	const { top } = useSafeAreaInsets();
	const keyboard = useAnimatedKeyboard();
	const [currentRoute, setCurrentRoute] = useState<string>();
	const [isAppReady, setIsAppReady] = useState(false);

	const { updateOrCreateCart } = useUpsertCart();

	// shared animation values
	const [animationStopPoint, setAnimationStopPoint] =
		useState<ANIMATION_STOP_POINTS>(ANIMATION_STOP_POINTS.SPLASH);

	const animatedHeight = useSharedValue(ANIMATION_STOP_POINTS.SPLASH);

	const animatedProgress = useSharedValue(0);

	const animatedHeightWithKeyboard = useDerivedValue(() => {
		return clamp(
			animatedHeight.value - keyboard.height.value / 2,
			ANIMATION_STOP_POINTS.FIXED_HEADER + top,
			ANIMATION_STOP_POINTS.SPLASH,
		);
	});

	const animatedIconSize = useDerivedValue(() => {
		return interpolate(
			animatedHeightWithKeyboard.value,
			[
				ANIMATION_STOP_POINTS.FIXED_HEADER + top,
				ANIMATION_STOP_POINTS.SIGN_IN,
				ANIMATION_STOP_POINTS.INIT_SEARCH,
				ANIMATION_STOP_POINTS.SPLASH,
			],
			[
				IconSize[ANIMATION_STOP_POINTS.FIXED_HEADER],
				IconSize[ANIMATION_STOP_POINTS.SIGN_IN],
				IconSize[ANIMATION_STOP_POINTS.INIT_SEARCH],
				IconSize[ANIMATION_STOP_POINTS.SPLASH],
			],
		);
	});

	const LeftButton = useMemo(() => {
		let leftButton = null;
		switch (currentRoute) {
			case 'ProductDetails':
			case 'Checkout':
				leftButton = (
					<Animated.View entering={FadeInLeft} exiting={FadeOutLeft}>
						<TouchableOpacity
							style={styles.leftButtonContainer}
							onPress={() => {
								if (currentRoute === 'Checkout') {
									updateOrCreateCart();
								}
								navigationRef?.current?.goBack();
							}}
						>
							<Image source={ChevronLeft} style={styles.leftButtonImage} />
						</TouchableOpacity>
					</Animated.View>
				);
				break;
		}
		return leftButton;
	}, [currentRoute, updateOrCreateCart]);

	useEffect(() => {
		const updateHeader = () => {
			const routeName = navigationRef?.current?.getCurrentRoute()?.name;
			setCurrentRoute(routeName);
		};
		// This listener is to update the header in navigation between tab bars.
		navigationRef?.current?.addListener('state', updateHeader);
		return () => {
			navigationRef?.current?.removeListener('state', updateHeader);
		};
	}, [navigationRef.current]);

	// animation
	useEffect(() => {
		let snapPoint = animationStopPoint;
		if (snapPoint === ANIMATION_STOP_POINTS.FIXED_HEADER) {
			snapPoint = ANIMATION_STOP_POINTS.FIXED_HEADER + top;
		}
		animatedHeight.value = withTiming(snapPoint, {
			duration: 1000,
			easing: Easing.inOut(Easing.quad),
		});
	}, [animationStopPoint, top]);

	const $animatedHeight = useAnimatedStyle(() => {
		return {
			height: clamp(
				animatedHeight.value - keyboard.height.value / 2,
				ANIMATION_STOP_POINTS.FIXED_HEADER + top,
				ANIMATION_STOP_POINTS.SPLASH,
			),
		};
	});

	useEffect(() => {
		animatedProgress.value = withTiming(clamp(hydrationProgress, 0, 100), {
			duration: 2000,
			easing: Easing.ease,
		});
	}, [hydrationProgress]);

	useAnimatedReaction(
		() => {
			return animatedProgress.value === 100;
		},
		(cur, prev) => {
			if (prev !== null && cur && cur !== prev) {
				runOnJS(setIsAppReady)(cur);
			}
		},
	);

	const updateStopPoint = useCallback(
		(stopPoint: ANIMATION_STOP_POINTS) => {
			if (!isAppReady) return;
			setAnimationStopPoint(stopPoint);
		},
		[isAppReady],
	);

	return (
		<GlobalHeaderContext.Provider
			value={{
				animationStopPoint,
				updateStopPoint,
				isAppReady,
			}}
		>
			<Animated.View
				style={[styles.container, $animatedHeight, { paddingTop: top }]}
			>
				<AnimatedBuilding
					animatedProgress={animatedProgress}
					animatedHeight={animatedHeightWithKeyboard}
				/>
				<ProgressBar
					animatedProgress={animatedProgress}
					animatedIconSize={animatedIconSize}
					currentStopPoint={animationStopPoint}
				/>
				<AnimatedLogo
					animatedIconSize={animatedIconSize}
					animatedHeight={animatedHeightWithKeyboard}
				/>
				<View style={styles.buttonContainer}>
					{LeftButton}
					<Animated.View>{/* TODO: right handler */}</Animated.View>
				</View>
			</Animated.View>
			{children}
		</GlobalHeaderContext.Provider>
	);
}
