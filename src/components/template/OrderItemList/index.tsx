import { FC, useMemo } from 'react';
import { View } from 'react-native';
import { IOrder, IOrderDelivery } from '@/api/auth/types';
import { OrderInfo, ProductOrderItem } from '@/components/organisms';
import { getFormattedAddress } from '@/screens/Account/MyAccount/utils';
import { ICartDelivery } from '@/api/cart/types';
import {
	getFormattedDeliveryAddress,
	groupItemsByDeliveryAddress,
} from '@/components/template/OrderItemList/helper';
import { DeliveryHeader } from '@/components/organisms/DeliveryHeader';

interface Props {
	order: IOrder;
	isHistory?: boolean; // DEMO value
}

export const OrderItemList: FC<Props> = ({ order, isHistory }) => {
	const itemsByDelivery = useMemo<IOrderDelivery[]>(() => {
		return groupItemsByDeliveryAddress(order);
	}, [order]);
	return (
		<View>
			<OrderInfo
				orderNumber={order.orderNumber}
				totalAmount={order.totalPrice.amount}
				billTo={getFormattedAddress(order.billingAddress)}
				completionDate={isHistory ? '12, Jan, 2024' : ''}
			/>
			{itemsByDelivery.map((itemByDelivery, index) => (
				<View key={index}>
					<DeliveryHeader
						deliveryMethod={itemByDelivery.delivery.method}
						address={getFormattedDeliveryAddress(
							itemByDelivery.delivery.address,
						)}
						deliveryDate={isHistory ? '' : '12, Jan, 2024'}
					/>
					{itemByDelivery.lineItems.map((item, index) => (
						<ProductOrderItem orderLineItem={item} key={item.variant.id} />
					))}
				</View>
			))}
		</View>
	);
};
