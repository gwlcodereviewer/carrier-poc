import { IProduct } from '@/api/product/types';
import React, { useMemo, useState } from 'react';
import { Image, Pressable, TouchableOpacity, View } from 'react-native';
import { NetworkImage, Button } from '@/components/molecules';
import { Text } from '@/components/atoms/Text';
import useTheme from '@/theme/hooks/useTheme';

import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
	clamp,
	Easing,
	runOnJS,
	useAnimatedStyle,
	useSharedValue,
	withTiming,
	WithTimingConfig,
} from 'react-native-reanimated';
import SwipeToLeft from '@/theme/assets/images/swipe_left.png';
import SwipeToRight from '@/theme/assets/images/swipe_right.png';
import { IOrderLineItem } from '@/api/auth/types';
import { BUTTON_WIDTH, styles } from './styles';

interface Props {
	orderLineItem: IOrderLineItem;
}

export const ProductOrderItem: React.FC<Props> = ({ orderLineItem }) => {
	const { backgrounds, colors } = useTheme();
	const variant = useMemo(() => orderLineItem.variant, [orderLineItem]);
	const imageSource = useMemo(
		() => orderLineItem.variant.product.featuredImage.url,
		[orderLineItem],
	);
	return (
		<View style={styles.container}>
			<View
				style={[
					styles.productContainer,
					styles.orderContainer,
					{ borderColor: colors.light_gray },
					backgrounds.white,
				]}
			>
				<NetworkImage uri={imageSource} height={173} width={173} />
				<View style={styles.rightContainer}>
					<Text size="size_16" color="black" numberOfLines={1} weight="light">
						{variant.sku}
					</Text>
					<Text size="size_14" color="black" numberOfLines={2} weight="light">
						{orderLineItem.title}
					</Text>
					<Text size="size_14" color="black" numberOfLines={2} weight="light">
						{orderLineItem.quantity} items
					</Text>
					<Text
						size="size_16"
						color="tertiary"
						numberOfLines={1}
						weight="bold"
						style={styles.orderPriceStyle}
					>
						$ {orderLineItem.originalTotalPrice.amount}
					</Text>
				</View>
			</View>
		</View>
	);
};
