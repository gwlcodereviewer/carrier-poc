import { ViewStyle } from 'react-native';
import Animated, {
	Easing,
	useAnimatedStyle,
	useSharedValue,
	withRepeat,
	withTiming,
} from 'react-native-reanimated';
import { useEffect, useMemo } from 'react';
import { useTheme } from '@/theme';

export interface SkeletonProps {
	variant: 'rect' | 'circle' | 'rounded';
	width: number | string;
	height: number | string;
	radius?: number;
	style?: ViewStyle;
}

export function Skeleton({
	variant,
	height,
	width,
	style,
	radius,
}: SkeletonProps) {
	const { backgrounds } = useTheme();
	const opacityShared = useSharedValue(1);
	const $opacityStyle = useAnimatedStyle(() => ({
		opacity: opacityShared.value,
	}));
	const borderRadius = useMemo(() => {
		if (radius) {
			return radius;
		}
		switch (variant) {
			case 'circle':
				return 999;
			case 'rounded':
				return 4;
			default:
				return 0;
		}
	}, [variant, width, radius]);

	useEffect(() => {
		opacityShared.value = withRepeat(
			withTiming(0.3, {
				duration: 1500,
				easing: Easing.inOut(Easing.ease),
			}),
			-1,
			true,
		);
	}, []);

	return (
		<Animated.View
			style={[
				backgrounds.light_grey_15,
				{
					width,
					height,
					borderRadius,
				} as ViewStyle,
				$opacityStyle,
				style,
			]}
		/>
	);
}
