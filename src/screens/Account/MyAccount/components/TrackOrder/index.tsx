import { FC, useEffect, useMemo } from 'react';
import { View } from 'react-native';
import { useMyAccountContext } from '@/screens/Account/MyAccount/context';
import { OrderInfo } from '@/components/organisms';
import { getFormattedAddress } from '@/screens/Account/MyAccount/utils';
import { OrderItemList } from '@/components/template';
import { EmptyOrder } from '@/screens/Account/MyAccount/components/EmptyOrder';

interface Props {}

export const TrackOrder: FC<Props> = () => {
	const { currentOrders } = useMyAccountContext();

	return (
		<View style={{ flex: 1 }}>
			{currentOrders.length === 0 ? (
				<EmptyOrder />
			) : (
				currentOrders.map(order => (
					<OrderItemList key={order.id} order={order} />
				))
			)}
		</View>
	);
};
