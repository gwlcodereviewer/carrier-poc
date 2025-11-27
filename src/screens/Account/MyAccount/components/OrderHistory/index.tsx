import { FC, useEffect, useMemo } from 'react';
import { View } from 'react-native';
import { useMyAccountContext } from '@/screens/Account/MyAccount/context';
import { OrderItemList } from '@/components/template';
import { EmptyOrder } from '@/screens/Account/MyAccount/components/EmptyOrder';

interface Props {}

export const OrderHistory: FC<Props> = () => {
	// No history data to display
	const { orderHistory } = useMyAccountContext();

	return (
		<View style={{ flex: 1 }}>
			{orderHistory.length === 0 ? (
				<EmptyOrder isOrderHistory />
			) : (
				orderHistory.map(order => (
					<OrderItemList key={order.id} order={order} isHistory />
				))
			)}
		</View>
	);
};
