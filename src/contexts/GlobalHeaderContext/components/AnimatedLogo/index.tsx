import { FC } from 'react';
import { Dimensions, View, ViewStyle } from 'react-native';
import Animated, {
	clamp,
	SharedValue,
	useAnimatedProps,
	useAnimatedStyle,
} from 'react-native-reanimated';
import { ANIMATION_STOP_POINTS, ICON_SIZE } from '@/contexts';
import { createAnimatedFunctionComponent } from '@/constant/utils';
import LogoSvg from '@/theme/assets/svgs/Logo.svg';
import { styles } from '@/contexts/GlobalHeaderContext/components/AnimatedLogo/styles';
import { SvgProps } from 'react-native-svg';

interface Props {
	animatedIconSize: Readonly<SharedValue<number>>;
	animatedHeight: Readonly<SharedValue<number>>;
}

const { height } = Dimensions.get('window');

const AnimatedLogoComp = createAnimatedFunctionComponent(LogoSvg);

export const AnimatedLogo: FC<Props> = ({
	animatedHeight,
	animatedIconSize,
}) => {
	const $animatedLogoProps = useAnimatedProps<SvgProps>(() => ({
		width: animatedIconSize.value * ICON_SIZE.width,
		height: animatedIconSize.value * ICON_SIZE.height,
	}));

	const $animatedLogoPosition = useAnimatedStyle<ViewStyle>(() => {
		return {
			top: clamp(
				height * 0.5 - (animatedIconSize.value * ICON_SIZE.height) / 2,
				0,
				animatedHeight.value - animatedIconSize.value * ICON_SIZE.height,
			),
		};
	});
	return (
		<Animated.View style={[styles.container, $animatedLogoPosition]}>
			<AnimatedLogoComp animatedProps={$animatedLogoProps} />
		</Animated.View>
	);
};
