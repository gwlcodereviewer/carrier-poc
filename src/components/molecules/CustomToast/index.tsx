import { useTheme } from '@/theme';
import { useEffect, useMemo } from 'react';
import { Text as RNText } from 'react-native';
import Animated, {
	useAnimatedStyle,
	useSharedValue,
	withTiming,
} from 'react-native-reanimated';
import { Text } from '../../atoms/Text';
import { styles } from './styles';

interface ICustomToastProps {
	toastType: string;
	message: string;
	hideToast: () => void;
}

/**
 * Name: CustomToast
 * Desc: Functional component to render the custom toast UI
 * @param {string} toastType - Toast type
 * @param {string} message - Toast message value
 * @param {func} hideToast - Function to call on hide toast
 * @returns JSX element
 */
export const CustomToast: React.FC<ICustomToastProps> = ({
	message,
	toastType,
	hideToast,
}) => {
	const { colors, fonts } = useTheme();
	const slideAnim = useSharedValue(100);
	const animatedStyle = useAnimatedStyle(() => {
		return {
			transform: [{ translateY: slideAnim.value }],
		};
	});

	const bgColor = useMemo(() => {
		switch (toastType) {
			case 'success':
				return colors.light_green;
			case 'warning':
				return colors.light_yellow;
			case 'alert':
				return colors.dark_red;
			case 'info':
				return colors.light_grey;
			default:
				return colors.light_grey;
		}
	}, [toastType])

	const fontColor = useMemo(() => {
		switch (toastType) {
			case 'success':
			case 'alert':
				return colors.white;
			case 'info':
			case 'warning':
			default:
				return fonts.black;
		}
	}, [toastType])

	/**
	 * Name: useEffect
	 * Desc: useEffect to start /hide the animation
	 */
	useEffect(() => {
		if (message) {
			slideAnim.value = withTiming(0, { duration: 1000 });
			setTimeout(() => {
				startHideAnimation();
			}, 3000);
		}
	}, [message, slideAnim]);

	const startHideAnimation = () => {
		slideAnim.value = withTiming(100, { duration: 1000 });
		setTimeout(() => {
			hideToast();
		}, 1100);
	};

	return (
		<Animated.View
			style={[
				styles.container,
				animatedStyle,
				message ? styles.visible : styles.hidden,
				{ backgroundColor: bgColor },
			]}
		>
			<RNText>
				<Text
					size="size_14"
					color="black"
					weight="light"
					style={styles.message}
				>
					{message}
				</Text>
			</RNText>
		</Animated.View>
	);
};
