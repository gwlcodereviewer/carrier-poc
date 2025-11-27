import { useTheme } from '@/theme';
import React, { useEffect, useMemo } from 'react';
import { Image, ImageStyle, Pressable, View, ViewStyle } from 'react-native';
import Check from '@/theme/assets/images/check.png';
import Animated, {
	Easing,
	ReduceMotion,
	WithSpringConfig,
	WithTimingConfig,
	useAnimatedStyle,
	useSharedValue,
	withSpring,
	withTiming,
} from 'react-native-reanimated';
import { BORDER_WIDTH, styles } from './styles';

interface Props {
	backgroundStyle: ViewStyle;
	checked: boolean;
	size: number;
	onPress: () => void;
	containerStyle?: ViewStyle;
}

const animationConfig: WithSpringConfig = {
	mass: 1,
	damping: 10,
	stiffness: 100,
	overshootClamping: false,
	restDisplacementThreshold: 0.01,
	restSpeedThreshold: 2,
	reduceMotion: ReduceMotion.System,
};

export const Checkbox: React.FC<Props> = ({
	backgroundStyle,
	checked,
	size,
	onPress,
	containerStyle,
}) => {
	const animationValue = useSharedValue(checked ? 1 : 0);

	const $animatedOpacity = useAnimatedStyle(() => ({
		opacity: animationValue.value,
	}));

	const $animatedScale = useAnimatedStyle(() => ({
		transform: [
			{
				scale: animationValue.value,
			},
		],
	}));

	useEffect(() => {
		animationValue.value = withSpring(checked ? 1 : 0, animationConfig);
	}, [checked]);

	const $size: ViewStyle = {
		height: size,
		width: size,
	};

	const $imageSize: ImageStyle = {
		height: size - size * 0.2,
		width: size - size * 0.2,
	};

	const $backgroundColor: ViewStyle = {
		backgroundColor: backgroundStyle.backgroundColor,
	};

	const $container: ViewStyle = {
		borderWidth: size * 0.1,
		borderColor: backgroundStyle.backgroundColor,
	};

	return (
		<Pressable
			style={[styles.containerBorder, $size, $container, containerStyle]}
			onPress={onPress}
		>
			<Animated.View
				style={[$backgroundColor, styles.background, $animatedOpacity]}
			/>
			<Animated.Image source={Check} style={[$imageSize, $animatedScale]} />
		</Pressable>
	);
};
