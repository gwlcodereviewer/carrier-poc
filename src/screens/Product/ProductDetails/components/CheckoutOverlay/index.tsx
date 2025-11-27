import {
	FC,
	useCallback,
	useContext,
	useEffect,
	useRef,
	useState,
} from 'react';
import { Image, View } from 'react-native';
import { useTheme } from '@/theme';
import { styles } from '@/screens/Product/ProductDetails/components/CheckoutOverlay/styles';
import { Button, Swipeable, SwipeableRef } from '@/components/molecules';
import SwipeRight from '@/theme/assets/images/swipe_right.png';
import SwipeLeft from '@/theme/assets/images/swipe_left.png';
import { ProductInfoContext } from '@/screens/Product/ProductDetails/context';
import { useSelector } from 'react-redux';
import { RootState } from '@/app/rootReducer';
import { useAppDispatch } from '@/app/store';
import {
	addToCart,
	removeFromCart,
	updateLineItemsInCart,
} from '@/reducers/cartReducer';
import { Text } from '@/components/atoms';
import { common } from '@/translations/en';
import { useToast } from '@/contexts/ToastContext';
import { TOAST_TYPES } from '@/constant/utils';

interface Props {
	productVariantId: string;
}

const { toastMessage } = common;

export const CheckoutOverlay: FC<Props> = ({ productVariantId }) => {
	const showToast = useToast();
	const { backgrounds } = useTheme();
	const dispatch = useAppDispatch();
	const { cartId, cartState: {cart} } = useSelector((state: RootState) => state.cart);
	const { distributionCenter } = useSelector(
		(state: RootState) => state.distributionCenter,
	);
	const { quantity, navigation, lineItem, deliveryMethod } =
		useContext(ProductInfoContext);
	const fromSearchScreen = useRef(
		!!navigation
			?.getState()
			?.routeNames.find(routeName => routeName === 'ProductSearch'),
	);
	const swipeableRef = useRef<SwipeableRef>(null);
	const defaultSwipeState = useRef(
		quantity === lineItem?.quantity ? 'hidden' : 'show',
	);

	useEffect(() => {
		if (swipeableRef.current) {
			if (quantity !== lineItem?.quantity) {
				swipeableRef.current.triggerSwipeLeft();
			} else {
				swipeableRef.current.triggerSwipeRight();
			}
		}
	}, [quantity, lineItem]);

	const onAddToJob = useCallback(() => {
		if (!cartId || !quantity) return;
		swipeableRef.current?.triggerSwipeRight();
		if (lineItem?.id) {
			dispatch(
				updateLineItemsInCart(
					cartId,
					[
						{
							id: lineItem.id,
							quantity,
							attributes: lineItem.attributes,
						},
					],
					() => {
						showToast(TOAST_TYPES.warning, toastMessage.itemUpdated);
					},
				),
			);
		} else {
			dispatch(
				addToCart(
					cartId,
					[
						{
							merchandiseId: productVariantId,
							quantity,
							attributes: [
								{
									key: 'delivery_type',
									value: deliveryMethod,
								},
								{
									key: 'distributor_address',
									value: JSON.stringify(distributionCenter.address),
								},
								{
									key: 'distributor_hvac_id',
									value: distributionCenter.hvacid.toString(),
								},
							],
						},
					],
					() => {
						showToast(TOAST_TYPES.warning, toastMessage.itemAdded);
					},
				),
			);
		}
	}, [cartId, quantity, lineItem, productVariantId]);

	const onRemoveFromJob = useCallback(() => {
		if (cartId && lineItem?.id) {
			dispatch(removeFromCart(cartId, [lineItem.id], () => {
				showToast(TOAST_TYPES.warning, toastMessage.itemRemoved);
			}));
			swipeableRef.current?.triggerSwipeLeft();
		}
	}, [cartId, lineItem]);

	const renderCover = useCallback(() => {
		return (
			<Button
				onPress={onAddToJob}
				title={`Swipe to My Job`}
				backgroundColor="primary_light_blue"
				containerStyle={styles.button}
				touchableConfig={{ activeOpacity: 1 }}
			>
				<Image source={SwipeRight} style={styles.swipeIcon} />
			</Button>
		);
	}, [onAddToJob, lineItem]);

	const renderShadowButton = useCallback(() => {
		if (fromSearchScreen.current) {
			return (
				<Button
					onPress={() => navigation?.navigate('ProductSearch')}
					title="Continue Search"
					backgroundColor="light_gray"
					containerStyle={styles.button}
					touchableConfig={{ activeOpacity: 1 }}
				/>
			);
		}
		return (
			<Button
				onPress={onRemoveFromJob}
				backgroundColor="light_gray"
				containerStyle={styles.button}
				touchableConfig={{ activeOpacity: 1 }}
			>
				<Image source={SwipeLeft} style={styles.swipeIcon} />
				<Text size="size_16" color="white" weight="regular">
					Swipe to remove
				</Text>
			</Button>
		);
	}, [onAddToJob, navigation, onRemoveFromJob]);

	const onSwipeEndTriggered = (reversed: boolean) => {
		if (fromSearchScreen.current && !reversed) {
			onAddToJob();
		} else if (!fromSearchScreen.current) {
			if (reversed && lineItem?.id) {
				cartId && dispatch(removeFromCart(cartId, [lineItem.id]));
			} else {
				onAddToJob();
			}
		}
	};
	return (
		<View style={[backgrounds.tint_blue, styles.container]}>
			<Swipeable
				ref={swipeableRef}
				defaultState={defaultSwipeState.current as 'show' | 'hidden'}
				reversible={!fromSearchScreen.current}
				onSwipeEndTriggered={onSwipeEndTriggered}
				containerStyle={styles.swipeableContainer}
				renderCover={renderCover}
			>
				{renderShadowButton()}
			</Swipeable>
			<Button
				onPress={() =>
					navigation?.getParent()?.navigate('Common', { screen: 'Checkout' })
				}
				title="Check Out"
				containerStyle={styles.button}
				isDisabled={!cart?.lines.edges.length}
			/>
		</View>
	);
};
