import { IProduct } from '@/api/product/types';
import React, { useEffect, useMemo, useState } from 'react';
import {
	Image,
	LayoutChangeEvent,
	Pressable,
	TouchableOpacity,
	View,
} from 'react-native';
import { NetworkImage, Button } from '@/components/molecules';
import { Text } from '@/components/atoms/Text';
import useTheme from '@/theme/hooks/useTheme';

import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
	clamp,
	Easing,
	runOnJS,
	useAnimatedReaction,
	useAnimatedStyle,
	useSharedValue,
	withDelay,
	withSequence,
	withTiming,
	WithTimingConfig,
} from 'react-native-reanimated';
import SwipeToLeft from '@/theme/assets/images/swipe_left.png';
import SwipeToRight from '@/theme/assets/images/swipe_right.png';
import { useSelector } from 'react-redux';
import { RootState } from '@/app/rootReducer';
import { BUTTON_WIDTH, styles } from './styles';

interface Props {
	product: IProduct;
	navigateToProduct: (productId: string) => void;
	onSwipeToCheckout: (variantId: string) => void;
	onAddToJob: (variantId: string) => void;
	isCheckoutEnabled?: boolean;
	isAddToJobDisabled?: boolean;
	onLayout?: (event: LayoutChangeEvent) => void;
}

const AnimatedTouchableOpacity =
	Animated.createAnimatedComponent(TouchableOpacity);
const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const animationConfig: WithTimingConfig = {
	duration: 500,
	easing: Easing.inOut(Easing.quad),
};

export const ProductItem: React.FC<Props> = ({
	product,
	navigateToProduct,
	onSwipeToCheckout,
	onAddToJob,
	isCheckoutEnabled = true,
	isAddToJobDisabled = false,
	onLayout,
}) => {
	const { backgrounds, colors } = useTheme();
	const {
		cartState: { cart },
	} = useSelector((state: RootState) => state.cart);
	const [gestureEnabled, setGestureEnabled] = useState<boolean>(false);
	const [isPressed, setIsPressed] = useState(false);
	const lineItem = useMemo(() => {
		return cart?.lines?.edges.find(
			lineItem => lineItem.node.merchandise.product.id === product.node.id,
		)?.node;
	}, [cart]);
	const firstVariant = useMemo(
		() => product.node.variants.edges[0].node,
		[product],
	);
	const imageSource = useMemo(
		() =>
			product.node.featuredImage.originalSrc || product.node.featuredImage.src,
		[product],
	);

	useEffect(() => {
		setIsPressed(false);
	}, [cart]);

	const onCheckoutClick = () => {
		onSwipeToCheckout(firstVariant.id);
		sharedTranslationX.value = withTiming(0, animationConfig);
	};

	const sharedItemWidth = useSharedValue(1);
	const sharedTranslationX = useSharedValue(0);

	const $cardTranslation = useAnimatedStyle(() => ({
		transform: [
			{
				translateX: sharedTranslationX.value,
			},
		],
	}));

	const $leftCardSize = useAnimatedStyle(() => ({
		width:
			sharedTranslationX.value > 0
				? clamp(sharedTranslationX.value, BUTTON_WIDTH, sharedItemWidth.value)
				: 0,
		zIndex: sharedTranslationX.value > BUTTON_WIDTH ? 10 : 0,
	}));

	const $rightCardSize = useAnimatedStyle(() => ({
		width:
			sharedTranslationX.value < 0
				? clamp(
						sharedTranslationX.value * -1,
						BUTTON_WIDTH,
						sharedItemWidth.value,
				  )
				: 0,
		zIndex: sharedTranslationX.value * -1 > BUTTON_WIDTH ? 10 : 0,
	}));

	const pangesture = Gesture.Pan()
		.onChange(e => {
			sharedTranslationX.value += e.changeX;
			if (Math.abs(sharedTranslationX.value) > sharedItemWidth.value * 0.6) {
				// TODO: add haptic
			}
		})
		.onEnd(() => {
			const multiplier = sharedTranslationX.value > 0 ? 1 : -1;
			if (Math.abs(sharedTranslationX.value) > sharedItemWidth.value * 0.6) {
				runOnJS(onSwipeToCheckout)(firstVariant.id);
				sharedTranslationX.value = withSequence(
					withTiming(multiplier * sharedItemWidth.value, animationConfig),
					withDelay(300, withTiming(0, animationConfig)),
				);
			} else if (Math.abs(sharedTranslationX.value) > BUTTON_WIDTH / 2) {
				sharedTranslationX.value = withTiming(
					multiplier * BUTTON_WIDTH,
					animationConfig,
				);
			} else {
				sharedTranslationX.value = withTiming(0, animationConfig);
			}
		})
		.enabled(gestureEnabled)
		.activeOffsetX([-10, 10]);

	return (
		<View style={styles.container} onLayout={onLayout}>
			<AnimatedTouchableOpacity
				style={[
					styles.addToCartContainer,
					styles.leftButton,
					backgrounds.tertiary_green,
					$leftCardSize,
				]}
				onPress={onCheckoutClick}
			>
				<View style={styles.swipeContainer}>
					<Text
						size="size_16"
						color="white"
						weight="light"
						style={styles.swipeText}
					>
						Swipe
					</Text>
					<Text
						size="size_16"
						color="white"
						weight="light"
						style={styles.swipeText}
					>
						to Checkout
					</Text>
				</View>
				<Image source={SwipeToRight} style={styles.swipeIcon} />
			</AnimatedTouchableOpacity>
			<GestureDetector gesture={pangesture}>
				<AnimatedPressable
					style={[
						styles.productContainer,
						{ borderTopColor: colors.light_gray },
						backgrounds.white,
						$cardTranslation,
					]}
					onPress={() => navigateToProduct(product.node.id)}
					onLayout={e => {
						setGestureEnabled(isCheckoutEnabled);
						sharedItemWidth.value = e.nativeEvent.layout.width;
					}}
				>
					<NetworkImage uri={imageSource} height={173} width={173} />
					<View style={styles.rightContainer}>
						<Text size="size_16" color="black" numberOfLines={1} weight="light">
							{firstVariant.sku}
						</Text>
						<Text size="size_14" color="black" numberOfLines={3} weight="light">
							{product.node.title}
						</Text>
						<Text
							size="size_16"
							color="tertiary"
							numberOfLines={1}
							weight="bold"
						>
							${' '}
							{typeof firstVariant.price === 'string'
								? firstVariant.price
								: firstVariant.price?.amount}
						</Text>
						<Button
							containerStyle={styles.buttonStyle}
							title="Add to Job"
							onPress={() => {
								setIsPressed(true);
								onAddToJob(firstVariant.id);
							}}
							size="medium"
							isDisabled={isAddToJobDisabled || isPressed || !!lineItem}
						/>
					</View>
				</AnimatedPressable>
			</GestureDetector>
			<AnimatedTouchableOpacity
				style={[
					styles.addToCartContainer,
					styles.rightButton,
					backgrounds.tertiary_green,
					$rightCardSize,
				]}
				onPress={onCheckoutClick}
			>
				<View style={styles.swipeContainer}>
					<Text
						size="size_16"
						color="white"
						weight="light"
						style={styles.swipeText}
					>
						Swipe
					</Text>
					<Text
						size="size_16"
						color="white"
						weight="light"
						style={styles.swipeText}
					>
						to Checkout
					</Text>
				</View>
				<Image source={SwipeToLeft} style={styles.swipeIcon} />
			</AnimatedTouchableOpacity>
		</View>
	);
};
