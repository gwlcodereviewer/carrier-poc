import { useAppDispatch } from '@/app/store';
import { Text } from '@/components/atoms/Text';
import { setShouldShowSwipeOverlay } from '@/reducers/configReducer';
import { useTheme } from '@/theme';
import Swipe from '@/theme/assets/images/swipe_icon_white.png';
import { welcome } from '@/translations/en';
import React, {
	FunctionComponent,
	ReactElement,
	useEffect,
	useState,
} from 'react';
import { Dimensions, Image, Modal, View, ViewStyle } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Animated, {
	Easing,
	WithTimingConfig,
	runOnJS,
	useAnimatedReaction,
	useAnimatedStyle,
	useSharedValue,
	withDelay,
	withRepeat,
	withSequence,
	withTiming,
} from 'react-native-reanimated';
import { styles } from './styles';

interface IOverViewHeight {
	topHeight: number;
	bottomHeight: number;
}

interface Props {
	overlayViewHeight: IOverViewHeight;
}

const SWIPE_OVERLAY_TIMEOUT = 3000;
const animationConfig: WithTimingConfig = {
	duration: 500,
};
const pauseAnimationConfig: WithTimingConfig = {
	duration: 500,
};
const slideAnimationConfig: WithTimingConfig = {
	duration: 900,
	easing: Easing.bezier(0.25, 0.1, 0.25, 1),
};

/**
 * Name: SwipeModal
 * Desc: Functional component to render the swipe overlay UI
 * @param {IOverViewHeight} overlayViewHeight - Dynamic height values for overlay
 * @returns JSx element
 */
const SwipeModal: FunctionComponent<Props> = ({
	overlayViewHeight,
}): ReactElement => {
	const screenHeight = Dimensions.get('window').height;
	const dispatch = useAppDispatch();
	const { colors } = useTheme();
	const { swipeOverlay } = welcome;
	const [shouldTriggerMovement, setShouldTriggerMovement] =
		useState<boolean>(false);
	const [shouldClose, setShouldClose] = useState<boolean>(false);

	const sharedRightValue = useSharedValue(0);
	const sharedOpacityValue = useSharedValue(0);

	/**
	 * Name: useAnimatedReaction
	 * Desc: useAnimatedReaction to trigger the animation
	 */
	useAnimatedReaction(
		() => sharedOpacityValue.value === 1,
		(cur, prev) => {
			if (cur !== prev && prev !== null && cur) {
				runOnJS(setShouldTriggerMovement)(true);
			}
		},
	);

	/**
	 * Name: useEffect
	 * Desc: useEffect to manage the opacity and call dispatch function
	 */
	useEffect(() => {
		sharedOpacityValue.value = withDelay(
			500,
			withTiming(shouldClose ? 0 : 1, animationConfig),
		);
		if (shouldClose) {
			const hideTimeout = setTimeout(() => {
				runOnJS(turnOffSwipeOverlay)();
			}, 500);

			return () => {
				clearTimeout(hideTimeout);
			};
		}
	}, [shouldClose]);

	/**
	 * Name: turnOffSwipeOverlay
	 * Desc: Function to dispatch the swipe overlay
	 */
	const turnOffSwipeOverlay = () => {
		dispatch(setShouldShowSwipeOverlay(false));
	};

	/**
	 * Name: useEffect
	 * Desc: useEffect to start animation
	 */
	useEffect(() => {
		if (shouldTriggerMovement) {
			const slideRight = withTiming(200, slideAnimationConfig);
			const slideLeft = withTiming(0, slideAnimationConfig);
			const slideSequence = withSequence(
				slideRight,
				withTiming(200, pauseAnimationConfig), // Stay at the right position for 5 seconds
				slideLeft,
				withTiming(0, pauseAnimationConfig), // Stay at the right
			);
			const repeatSequence = withRepeat(slideSequence, -1, true);
			sharedRightValue.value = repeatSequence;
			const hideTimeout = setTimeout(() => {
				runOnJS(setShouldClose)(true);
			}, SWIPE_OVERLAY_TIMEOUT);

			return () => {
				clearTimeout(hideTimeout);
			};
		}
	}, [shouldTriggerMovement]);

	const $animatedOpacity = useAnimatedStyle<ViewStyle>(() => ({
		opacity: sharedOpacityValue.value,
	}));

	const $animatedStyles = useAnimatedStyle(() => ({
		transform: [{ translateX: sharedRightValue.value }],
	}));

	return (
		<Modal animationType="none" transparent visible>
			<Animated.View style={[styles.container, $animatedOpacity]}>
				<LinearGradient
					colors={[
						colors.primary_blue,
						colors.primary_blue,
						colors.transparent,
						colors.transparent,
						colors.primary_blue,
					]}
					locations={[
						0,
						overlayViewHeight.topHeight / screenHeight,
						overlayViewHeight.topHeight / screenHeight,
						(overlayViewHeight.topHeight + overlayViewHeight.bottomHeight) /
							screenHeight,
						(overlayViewHeight.topHeight + overlayViewHeight.bottomHeight) /
							screenHeight,
					]}
					style={[styles.opacityBackground, { height: screenHeight }]}
				/>
				<Animated.View
					style={[
						styles.imageContainer,
						$animatedStyles,
						{ paddingTop: overlayViewHeight.topHeight + 100 },
					]}
				>
					<Image source={Swipe} style={styles.image} />
				</Animated.View>
				<View>
					<Text
						size="size_32"
						color="tertiary_green"
						weight="light"
						style={styles.title}
					>
						{swipeOverlay.title}
					</Text>
					<Text
						size="size_22"
						color="white"
						weight="light"
						style={styles.description}
					>
						{swipeOverlay.description}
					</Text>
				</View>
			</Animated.View>
		</Modal>
	);
};

export default SwipeModal;
