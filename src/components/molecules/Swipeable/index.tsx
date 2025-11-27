import {
	FC,
	forwardRef,
	ReactNode,
	useEffect,
	useImperativeHandle,
	useState,
} from 'react';
import { View, ViewStyle } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
	Easing,
	runOnJS,
	useAnimatedReaction,
	useAnimatedStyle,
	useSharedValue,
	withTiming,
	WithTimingConfig,
} from 'react-native-reanimated';
import { styles } from '@/components/molecules/Swipeable/styles';

interface Props {
	children: ReactNode;
	renderCover: () => JSX.Element;
	reversible?: boolean;
	containerStyle?: ViewStyle;
	onSwipeEndTriggered?: (reversed: boolean) => void;
	defaultState?: 'show' | 'hidden';
}

export interface SwipeableRef {
	triggerSwipeRight: () => void;
	triggerSwipeLeft: () => void;
}

const animationConfig: WithTimingConfig = {
	duration: 500,
	easing: Easing.inOut(Easing.quad),
};

export const Swipeable = forwardRef<SwipeableRef, Props>(
	(
		{
			children,
			renderCover,
			reversible,
			containerStyle,
			onSwipeEndTriggered,
			defaultState = 'show',
		},
		ref,
	) => {
		const [coverLayout, setCoverLayout] = useState<number>();
		const [onCoverEndReached, setOnCoverEndReached] = useState(false);
		const sharedTranslationX = useSharedValue(0);

		useEffect(() => {
			if (coverLayout && defaultState === 'hidden') {
				sharedTranslationX.value = coverLayout;
			}
		}, [coverLayout, defaultState]);

		const triggerSwipeRight = () => {
			if (!coverLayout) return;
			sharedTranslationX.value = withTiming(coverLayout, animationConfig);
		};

		const triggerSwipeLeft = () => {
			if (!coverLayout) return;
			sharedTranslationX.value = withTiming(0, animationConfig);
		};
		useImperativeHandle(
			ref,
			() => {
				return {
					triggerSwipeLeft,
					triggerSwipeRight,
				};
			},
			[coverLayout, reversible],
		);

		const panGesture = Gesture.Pan()
			.enabled(!!coverLayout && !onCoverEndReached)
			.onChange(e => {
				if (!coverLayout) return;
				const newTranslateValue = sharedTranslationX.value + e.changeX;
				if (newTranslateValue > 0) {
					sharedTranslationX.value = newTranslateValue;
				} else {
					sharedTranslationX.value = 0;
				}
			})
			.onEnd(e => {
				if (!coverLayout) return;
				if (reversible) {
					if (sharedTranslationX.value < 0.5 * coverLayout) {
						sharedTranslationX.value = withTiming(0, animationConfig);
						onSwipeEndTriggered && runOnJS(onSwipeEndTriggered)(true);
					} else {
						sharedTranslationX.value = withTiming(coverLayout, animationConfig);
						onSwipeEndTriggered && runOnJS(onSwipeEndTriggered)(false);
					}
				} else {
					if (sharedTranslationX.value > 0.5 * coverLayout) {
						sharedTranslationX.value = withTiming(coverLayout, animationConfig);
						onSwipeEndTriggered && runOnJS(onSwipeEndTriggered)(false);
					} else {
						sharedTranslationX.value = withTiming(0, animationConfig);
						onSwipeEndTriggered && runOnJS(onSwipeEndTriggered)(true);
					}
				}
			});

		useAnimatedReaction(
			() => {
				return (
					!!coverLayout &&
					sharedTranslationX.value === coverLayout &&
					!reversible
				);
			},
			(cur, prev) => {
				if (prev !== cur) {
					runOnJS(setOnCoverEndReached)(cur);
				}
			},
		);

		const $coverTranslationStyle = useAnimatedStyle<ViewStyle>(() => {
			return {
				transform: [{ translateX: sharedTranslationX.value }],
			};
		});

		return (
			<GestureDetector gesture={panGesture}>
				<View
					style={[styles.container, containerStyle]}
					onLayout={e => setCoverLayout(e.nativeEvent.layout.width)}
				>
					{children}
					<Animated.View style={[styles.cover, $coverTranslationStyle]}>
						{renderCover()}
					</Animated.View>
				</View>
			</GestureDetector>
		);
	},
);
