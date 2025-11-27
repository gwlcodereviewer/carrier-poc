import React, { useEffect, useState } from 'react';
import {
	View,
	Image,
	useWindowDimensions,
	ViewStyle,
	ImageStyle,
} from 'react-native';
import { useTheme } from '@/theme';
import Swipe from '@/theme/assets/images/swipe.png';
import Animated, {
	Easing,
	WithTimingConfig,
	clamp,
	runOnJS,
	useAnimatedReaction,
	useAnimatedStyle,
	useSharedValue,
	withDelay,
	withRepeat,
	withSequence,
	withSpring,
	withTiming,
} from 'react-native-reanimated';
import { Text } from '@/components/atoms/Text';
import { useSelector } from 'react-redux';
import { RootState } from '@/app/rootReducer';
import { useAppDispatch } from '@/app/store';
import { setShouldShowSwipeOverlay } from '@/reducers/configReducer';
import { IMAGE_SIZE, styles } from './styles';

interface Props {
	// add props here
}

const animationConfig: WithTimingConfig = {
	duration: 1200,
	easing: Easing.inOut(Easing.quad),
};

export const SwipeOverlay: React.FC<Props> = ({}) => {
	const dispatch = useAppDispatch();
	const { backgrounds } = useTheme();
	const { width } = useWindowDimensions();
	const [shouldTriggerMovement, setShouldTriggerMovement] =
		useState<boolean>(false);
	const [shouldClose, setShouldClose] = useState<boolean>(false);

	const sharedRightValue = useSharedValue(0);
	const sharedOpacityValue = useSharedValue(0);

	const turnOffSwipeOverlay = () => {
		dispatch(setShouldShowSwipeOverlay(false));
	};

	useAnimatedReaction(
		() => sharedOpacityValue.value === 1,
		(cur, prev) => {
			if (cur !== prev && prev !== null && cur) {
				runOnJS(setShouldTriggerMovement)(true);
			}
		},
	);

	useAnimatedReaction(
		() => sharedRightValue.value === 0,
		(cur, prev) => {
			if (cur !== prev && prev !== null && cur) {
				runOnJS(turnOffSwipeOverlay)();
			}
		},
	);

	useAnimatedReaction(
		() => sharedRightValue.value === 0,
		(cur, prev) => {
			if (cur && prev !== null && prev !== cur) {
				runOnJS(setShouldClose)(true);
			}
		},
	);

	useEffect(() => {
		sharedOpacityValue.value = withDelay(
			500,
			withTiming(shouldClose ? 0 : 1, animationConfig),
		);
	}, [shouldClose]);

	useEffect(() => {
		if (shouldTriggerMovement) {
			sharedRightValue.value = withSequence(
				withTiming(-(width - IMAGE_SIZE), animationConfig),
				withDelay(300, withTiming(0, animationConfig)),
			);
		}
	}, [shouldTriggerMovement]);

	const $animatedRightPostion = useAnimatedStyle<ImageStyle>(() => ({
		transform: [
			{
				translateX: clamp(sharedRightValue.value, -(width - IMAGE_SIZE), 0),
			},
		],
	}));

	const $aniamtedOpacity = useAnimatedStyle<ViewStyle>(() => ({
		opacity: sharedOpacityValue.value,
	}));

	return (
		<Animated.View style={[styles.container, $aniamtedOpacity]}>
			<View style={[styles.opacityBackground, backgrounds.dark_grey]} />
			<Animated.View style={[styles.imageContainer, $animatedRightPostion]}>
				<Image source={Swipe} style={styles.image} />
				<Text size="size_20" color="black" weight="light">
					Add To Cart
				</Text>
			</Animated.View>
		</Animated.View>
	);
};
