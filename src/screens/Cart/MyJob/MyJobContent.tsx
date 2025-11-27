import React, { useEffect } from 'react';
import { BalanceOverlay } from '@/screens/Cart/MyJob/components/BalanceOverlay';
import { styles } from '@/screens/Cart/MyJob/MyJobContent.styles';
import { ICartDelivery } from '@/api/cart/types';
import { ProductJobList } from '@/components/template';
import { StackNavigationProp } from '@react-navigation/stack';
import { CartStackParamList } from '@/types/navigation';
import { MyJobContext } from '@/screens/Cart/MyJob/context';
import { useIsFocused } from '@react-navigation/native';
import Animated, {
	Easing,
	ReduceMotion,
	useAnimatedStyle,
	useSharedValue,
	withDelay,
	withTiming,
} from 'react-native-reanimated';
import { useWindowDimensions, View } from 'react-native';
import { undefined } from 'zod';
import { EmptyJob } from './components/EmptyJob';

interface Props {
	itemsByAddress: ICartDelivery[];
	navigation: StackNavigationProp<CartStackParamList, 'MyJob'>;
}

export const MyJobContent: React.FC<Props> = ({
	itemsByAddress,
	navigation,
}) => {
	const { width } = useWindowDimensions();
	const isFocused = useIsFocused();
	const translateX = useSharedValue(width);

	useEffect(() => {
		if (isFocused) {
			startAnimation();
		} else {
			translateX.value = width;
		}
	}, [isFocused, width]);

	const startAnimation = () => {
		translateX.value = withTiming(0, {
			duration: 500,
			easing: Easing.in(Easing.quad),
			reduceMotion: ReduceMotion.System,
		});
	};

	const animatedStyle = useAnimatedStyle(() => {
		return {
			transform: [{ translateX: translateX.value }],
		};
	});

	return (
		<View style={styles.container}>
			<MyJobContext.Provider value={{ navigation }}>
				{itemsByAddress && itemsByAddress.length > 0 ? (
					<>
						<ProductJobList itemList={itemsByAddress} />
						<BalanceOverlay />
					</>
				) : (
					<Animated.View style={[styles.container, animatedStyle]}>
						<EmptyJob />
					</Animated.View>
				)}
			</MyJobContext.Provider>
		</View>
	);
};
