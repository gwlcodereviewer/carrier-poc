import React, { useEffect } from 'react';
import { View, ViewStyle } from 'react-native';
import { Text } from '@/components/atoms/Text';
import Animated, {
	Easing,
	WithTimingConfig,
	interpolate,
	runOnJS,
	useAnimatedReaction,
	useAnimatedStyle,
	useSharedValue,
	withTiming,
} from 'react-native-reanimated';
import { styles } from './styles';

interface Props {
	username: string;
	hide: boolean;
}

const animationConfig: WithTimingConfig = {
	duration: 500,
	easing: Easing.inOut(Easing.quad),
};

export const AnimatedHeader: React.FC<Props> = ({ username, hide }) => {
	const [animationEnded, setAnimationEnded] = React.useState<boolean>(false);
	const animatedScale = useSharedValue(1);

	const $animatedScale = useAnimatedStyle(() => ({
		height: interpolate(animatedScale.value, [0, 1], [0, 160]),
		opacity: animatedScale.value,
	}));

	useEffect(() => {
		animatedScale.value = withTiming(hide ? 0 : 1, animationConfig);
	}, [hide]);

	useAnimatedReaction(
		() => {
			return animatedScale.value === 0;
		},
		(cur, prev) => {
			if (cur !== prev) {
				runOnJS(setAnimationEnded)(cur);
			}
		},
	);

	if (animationEnded) {
		return null;
	}

	return (
		<Animated.View style={[$animatedScale]}>
			<View style={styles.titleContainer}>
				<Text size="size_16" color="black" style={styles.title} weight="light">
					Welcome,
				</Text>
				<Text size="size_24" color="black" style={styles.title} weight="light">
					{username}!
				</Text>
				<Text size="size_16" color="black" weight="light">
					Begin your exploration by searching with
				</Text>
			</View>
		</Animated.View>
	);
};
