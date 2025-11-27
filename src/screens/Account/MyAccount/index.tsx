import { Text } from '@/components/atoms/Text';
import { SafeScreen } from '@/components/template';
import React, { useContext, useEffect, useMemo } from 'react';
import { AccountStackParamList } from '@/types/navigation';
import { StackScreenProps } from '@react-navigation/stack';
import {
	IAccountAddress,
	IMyAccountContext,
	MyAccountContext,
	myAccountDefaultValues,
} from '@/screens/Account/MyAccount/context';
import { View } from 'react-native';
import { GlobalHeaderContext, ANIMATION_STOP_POINTS } from '@/contexts';
import { useIsFocused } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { RootState } from '@/app/rootReducer';
import { IOrder } from '@/api/auth/types';
import { MyAccountWrapper } from '@/screens/Account/MyAccount/MyAccountWrapper';
import { isDirty } from 'zod';
import Animated, {
	FadeInRight,
	FadeOutLeft,
	SlideInLeft,
	SlideOutLeft,
	SlideOutRight,
} from 'react-native-reanimated';

interface Props {
	// add props here
}

export const MyAccount: React.FC<
	StackScreenProps<AccountStackParamList, 'MyAccount'>
> = ({}) => {
	const { updateStopPoint } = useContext(GlobalHeaderContext);
	const { authCustomer } = useSelector((state: RootState) => state.auth);
	const { distributionCenter } = useSelector(
		(state: RootState) => state.distributionCenter,
	);
	const isFocused = useIsFocused();

	useEffect(() => {
		if (isFocused) {
			updateStopPoint(ANIMATION_STOP_POINTS.FIXED_HEADER);
		}
	}, [isFocused, updateStopPoint]);

	const myAccountContextValues = useMemo<IMyAccountContext>(() => {
		if (!authCustomer) return myAccountDefaultValues;
		const currentOrders: IMyAccountContext['currentOrders'] = [];
		const orderHistory: IMyAccountContext['orderHistory'] = [];
		authCustomer.orders.edges.forEach(orderNode => {
			const order = orderNode.node;
			if (order.fulfillmentStatus !== 'FULFILLED') {
				currentOrders.push(order);
			} else {
				orderHistory.push(order);
			}
		});
		return {
			defaultAddress: {
				deliveryAddress: authCustomer.defaultAddress,
				pickupAddress: distributionCenter,
			},
			addresses: authCustomer.addresses.edges.map(address => ({
				deliveryAddress: address.node,
				pickupAddress: distributionCenter,
			})),
			orderHistory,
			currentOrders,
		};
	}, [distributionCenter, authCustomer]);

	return (
		<MyAccountContext.Provider value={myAccountContextValues}>
			<MyAccountWrapper />
		</MyAccountContext.Provider>
	);
};
