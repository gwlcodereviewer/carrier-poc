import Animated, {
	SharedValue,
	useAnimatedStyle,
} from 'react-native-reanimated';
import { FC } from 'react';
import { Dimensions, ViewStyle } from 'react-native';
import { ANIMATION_STOP_POINTS, ICON_SIZE } from '@/contexts';
import {
	PROGRESS_BAR_HEIGHT,
	styles,
} from '@/contexts/GlobalHeaderContext/components/ProgressBar/styles';
import { useTheme } from '@/theme';

interface Props {
	animatedProgress: Readonly<SharedValue<number>>;
	animatedIconSize: Readonly<SharedValue<number>>;
	currentStopPoint: ANIMATION_STOP_POINTS;
}

const STEP = Dimensions.get('window').height / 100;

export const ProgressBar: FC<Props> = ({
	animatedProgress,
	animatedIconSize,
	currentStopPoint,
}) => {
	const { backgrounds } = useTheme();

	const $animatedProgressedStyle = useAnimatedStyle(() => {
		return {
			transform: [
				{
					scaleX: animatedProgress.value * STEP,
				},
			],
		};
	});

	const $animatedBottomContainer = useAnimatedStyle<ViewStyle>(() => {
		return {
			height:
				currentStopPoint === ANIMATION_STOP_POINTS.SPLASH
					? PROGRESS_BAR_HEIGHT
					: (animatedIconSize.value * ICON_SIZE.height) / 2,
		};
	});

	return (
		<Animated.View
			style={[
				styles.container,
				$animatedBottomContainer,
				currentStopPoint !== ANIMATION_STOP_POINTS.SPLASH && backgrounds.white,
			]}
		>
			<Animated.View
				style={[
					styles.progressBarHeight,
					backgrounds.white,
					currentStopPoint === ANIMATION_STOP_POINTS.SPLASH &&
						$animatedProgressedStyle,
				]}
			/>
		</Animated.View>
	);
};
