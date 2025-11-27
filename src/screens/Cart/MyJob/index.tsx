import { Text } from '@/components/atoms/Text';
import { SafeScreen } from '@/components/template';
import React, { useEffect, useMemo } from 'react';
import { View } from 'react-native';
import { MyJobContent } from '@/screens/Cart/MyJob/MyJobContent';
import { useGlobalHeaderContext, ANIMATION_STOP_POINTS } from '@/contexts';
import { useIsFocused } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { RootState } from '@/app/rootReducer';
import { ICartDelivery } from '@/api/cart/types';
import { checkSameDelivery, getCartDelivery } from '@/screens/Cart/MyJob/utils';
import { StackScreenProps } from '@react-navigation/stack';
import { CartStackParamList, SearchStackParamList } from '@/types/navigation';
import { undefined } from 'zod';

interface Props {
	// add props here
}

const defaultDelivery: ICartDelivery = {
	delivery: {
		method: 'shipto',
		address: {
			address: '',
			apt_suite: '',
			city: '',
			state: '',
			zip: '',
			country: '',
			phone: '',
		},
	},
	lineItems: [],
};

export const MyJob: React.FC<StackScreenProps<CartStackParamList, 'MyJob'>> = ({
	navigation,
}) => {
	const { updateStopPoint } = useGlobalHeaderContext();
	const isFocused = useIsFocused();
	const {
		cartState: { cart },
	} = useSelector((state: RootState) => state.cart);
	const {
		authCustomer
	} = useSelector((state: RootState) => state.auth);
	const itemsByAddress = useMemo<ICartDelivery[]>(() => {
		if (!cart) return [];
		const lineItems = cart.lines.edges;
		const itemsByAddress: ICartDelivery[] = [];
		lineItems.forEach(item => {
			const cartDelivery = getCartDelivery(item.node, authCustomer?.defaultAddress);
			const index = itemsByAddress.findIndex(item => {
				return checkSameDelivery(item.delivery, cartDelivery.delivery);
			});
			if (index === -1) {
				itemsByAddress.push({
					delivery: cartDelivery.delivery,
					lineItems: [item.node],
				});
			} else {
				itemsByAddress[index].lineItems.push(item.node);
			}
		});
		return itemsByAddress;
	}, [cart]);

	useEffect(() => {
		if (isFocused) {
			updateStopPoint(ANIMATION_STOP_POINTS.FIXED_HEADER);
		}
	}, [isFocused, updateStopPoint]);
	return (
		<MyJobContent itemsByAddress={itemsByAddress} navigation={navigation} />
	);
};
