import { IOrder, IOrderLineItem, IOrderDelivery } from '@/api/auth/types';
import { ICartDelivery } from '@/api/cart/types';

enum ATTRIBUTE_KEYS {
	DELIVERY_TYPE = 'delivery_type',
	DISTRIBUTOR_ADDRESS = 'distributor_address',
}

const defaultDelivery: IOrderDelivery = {
	delivery: {
		method: '',
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

export function checkSameDelivery(
	obj1: IOrderDelivery['delivery'],
	obj2: IOrderDelivery['delivery'],
): boolean {
	if (obj1.method !== obj2.method) return false;
	const address1 = obj1.address;
	const address2 = obj2.address;
	return Object.keys(address1).reduce<boolean>((acc, key) => {
		// @ts-ignore
		return address1[key] === address2[key];
	}, true);
}

export const groupItemsByDeliveryAddress = (
	order: IOrder,
): IOrderDelivery[] => {
	const lineItems = order.lineItems.edges.map(edge => edge.node);
	const itemsByAddress: IOrderDelivery[] = [];
	const deliveryAddress: IOrderDelivery['delivery']['address'] = {
		address: order.shippingAddress.address1,
		apt_suite: '',
		city: order.shippingAddress.city,
		state: order.shippingAddress.province,
		zip: order.shippingAddress.zip,
		country: order.shippingAddress.country,
		phone: order.phone,
	};

	lineItems.forEach(item => {
		const cartDelivery = JSON.parse(JSON.stringify(defaultDelivery));
		const attributes = item.customAttributes;
		const deliveryType = attributes.find(
			({ key }) => key === ATTRIBUTE_KEYS.DELIVERY_TYPE,
		);
		cartDelivery.delivery.method = deliveryType?.value || '';
		// update address
		if (cartDelivery.delivery.method === 'shipto') {
			cartDelivery.delivery.address = { ...deliveryAddress };
		} else {
			const distributorAddress = attributes.find(
				({ key }) => key === ATTRIBUTE_KEYS.DISTRIBUTOR_ADDRESS,
			);
			try {
				cartDelivery.delivery.address = JSON.parse(
					distributorAddress?.value ||
						JSON.stringify(defaultDelivery.delivery.address),
				);
			} catch (e) {
				cartDelivery.delivery.address = { ...defaultDelivery.delivery.address };
				console.error('Error parsing distributor address', e);
			}
		}
		// check if delivery address already exists
		const index = itemsByAddress.findIndex(item => {
			return checkSameDelivery(item.delivery, cartDelivery.delivery);
		});
		if (index === -1) {
			itemsByAddress.push({
				delivery: cartDelivery.delivery,
				lineItems: [item],
			});
		} else {
			itemsByAddress[index].lineItems.push(item);
		}
	});
	return itemsByAddress;
};

export function getFormattedDeliveryAddress(
	addressObj: IOrderDelivery['delivery']['address'],
) {
	const getStringWithComma = (str: string | undefined) => {
		return str ? `${str},` : '';
	};
	const { apt_suite, city, address, state, zip } = addressObj;
	return `${getStringWithComma(apt_suite)} ${getStringWithComma(
		address,
	)} ${getStringWithComma(city)} ${state ?? ''} ${zip ? ` - ${zip}` : ''}`;
}
