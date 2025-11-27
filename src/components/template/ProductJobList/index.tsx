import {
	SectionList,
	SectionListData,
	SectionListRenderItem,
	View,
} from 'react-native';
import { FC, useContext, useMemo, useEffect } from 'react';
import { IAttribute, ICartDelivery, ICartLine } from '@/api/cart/types';
import { DeliveryHeader } from '@/components/organisms/DeliveryHeader';
import { ProductJobItem } from '@/components/organisms';
import { BALANCE_OVERLAY_HEIGHT } from '@/screens/Cart/MyJob/components/BalanceOverlay/styles';
import { useAppDispatch } from '@/app/store';
import { removeLineItemsFromCart } from '@/api/cart';
import { useSelector } from 'react-redux';
import { RootState } from '@/app/rootReducer';
import { removeFromCart, updateLineItemsInCart } from '@/reducers/cartReducer';
import { StackNavigationProp } from '@react-navigation/stack';
import { CartStackParamList } from '@/types/navigation';
import { MyJobContext } from '@/screens/Cart/MyJob/context';
import { getFormattedAddress } from '@/screens/Cart/MyJob/utils';
import { common } from '@/translations/en';
import { useToast } from '@/contexts/ToastContext';
import { TOAST_TYPES } from '@/constant/utils';

interface Props {
	itemList: ICartDelivery[];
}

export const ProductJobList: FC<Props> = ({ itemList }) => {
	const showToast = useToast();
	const { toastMessage } = common;
	const { navigation } = useContext(MyJobContext);
	const dispatch = useAppDispatch();
	const {
		cartId,
		cartState: { removeFromCartLoading },
	} = useSelector((state: RootState) => state.cart);

	const sectionListData = useMemo(() => {
		return itemList.map(item => ({
			delivery: item.delivery,
			data: item.lineItems,
		}));
	}, [itemList]);

	/**
	 * Name: triggerToast
	 * Desc: Function to trigger the toast on API success
	 * @param {string} message - Message to be displayed on toast
	 */
	const triggerToast = (type: string, message: string) => {
		showToast(type, message);
	};

	const updateQuantity = (
		lineId: string,
		quantity: number,
		attributes: IAttribute[],
	) => {
		if (!cartId) return;
		if (quantity > 0) {
			dispatch(
				updateLineItemsInCart(
					cartId,
					[
						{
							id: lineId,
							quantity,
							attributes,
						},
					],
					() => triggerToast(TOAST_TYPES.warning, toastMessage.itemUpdated),
				),
			);
		}
	};

	return (
		<SectionList
			contentInset={{ bottom: BALANCE_OVERLAY_HEIGHT }}
			sections={sectionListData}
			keyExtractor={item => item.id}
			renderSectionHeader={({ section: { delivery } }) => (
				<DeliveryHeader
					deliveryMethod={delivery.method}
					address={getFormattedAddress(delivery.address)}
					deliveryDate="12, Jan, 2024"
				/>
			)}
			renderItem={({ item }) => {
				return (
					<ProductJobItem
						cartLine={item}
						navigateToProduct={() =>
							navigation?.navigate('ProductDetails', {
								productId: item.merchandise.product.id,
							})
						}
						onDeletePress={lineId =>
							cartId &&
							dispatch(
								removeFromCart(cartId, [lineId], () =>
									triggerToast(TOAST_TYPES.warning, toastMessage.itemRemoved),
								),
							)
						}
						isRemoveFromCartLoading={removeFromCartLoading}
						updateQuantity={updateQuantity}
					/>
				);
			}}
		/>
	);
};
