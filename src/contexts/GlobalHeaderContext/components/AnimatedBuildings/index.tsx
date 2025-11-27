import Animated, {
	clamp,
	interpolate,
	SharedValue,
	useAnimatedStyle,
} from 'react-native-reanimated';
import { ANIMATION_STOP_POINTS } from '@/contexts';
import {
	BUILDINGS_HEIGHT,
	styles,
} from '@/contexts/GlobalHeaderContext/components/AnimatedBuildings/styles';
import BgIcons from '@/theme/assets/svgs/BgIcons.svg';
import React, { FC } from 'react';
import { Dimensions } from 'react-native';

interface Props {
	animatedProgress: Readonly<SharedValue<number>>;
	animatedHeight: Readonly<SharedValue<number>>;
}

const { height, width } = Dimensions.get('window');

export const AnimatedBuilding: FC<Props> = ({
	animatedProgress,
	animatedHeight,
}) => {
	const [iconsWidth, setIconsWidth] = React.useState<number>(0);

	const $animatedVerticalPosition = useAnimatedStyle(() => {
		return {
			transform: [
				{
					translateY: clamp(
						animatedHeight.value - BUILDINGS_HEIGHT,
						0,
						height - BUILDINGS_HEIGHT,
					),
				},
			],
		};
	});

	const $animatedHorizontalPosition = useAnimatedStyle(() => {
		return {
			transform: [
				{
					translateX: -clamp(
						(animatedProgress.value / 100) * (iconsWidth - width),
						0,
						iconsWidth - width,
					),
				},
			],
		};
	});

	const $animatedOpacity = useAnimatedStyle(() => ({
		opacity: interpolate(
			animatedHeight.value,
			[
				ANIMATION_STOP_POINTS.SPLASH,
				ANIMATION_STOP_POINTS.SIGN_IN,
				ANIMATION_STOP_POINTS.FIXED_HEADER,
			],
			[1, 0.9, 0],
		),
	}));

	return (
		<Animated.View
			style={[
				styles.container,
				$animatedVerticalPosition,
				$animatedHorizontalPosition,
				$animatedOpacity,
			]}
		>
			<BgIcons
				height={Dimensions.get('window').height * 0.385}
				onLayout={e => {
					setIconsWidth(e.nativeEvent.layout.width);
				}}
			/>
		</Animated.View>
	);
};
