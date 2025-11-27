import { ICartDelivery, ICartLine } from '@/api/cart/types';
import { IAddress } from '@/api/auth/types';

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

export function checkSameDelivery(
	obj1: ICartDelivery['delivery'],
	obj2: ICartDelivery['delivery'],
): boolean {
	if (obj1.method !== obj2.method) return false;
	const address1 = obj1.address;
	const address2 = obj2.address;
	return Object.keys(address1).reduce<boolean>((acc, key) => {
		// @ts-ignore
		return address1[key] === address2[key];
	}, true);
}

export function getFormattedAddress(
	addressObj: ICartDelivery['delivery']['address'],
) {
	const getStringWithComma = (str: string | undefined) => {
		return str ? `${str},` : '';
	};
	const { apt_suite, city, address, state, zip } = addressObj;
	return `${getStringWithComma(apt_suite)} ${getStringWithComma(
		address,
	)} ${getStringWithComma(city)} ${state ?? ''} ${zip ? ` - ${zip}` : ''}`;
}

export const getCartDelivery = (lineItem: ICartLine, address: IAddress | undefined, phone: string | null = ''): ICartDelivery => {
	const cartDelivery = JSON.parse(JSON.stringify(defaultDelivery));
	cartDelivery.delivery.method = lineItem.attributes.find((value) => value.key === 'delivery_type')?.value || 'shipto';
	if (cartDelivery.delivery.method === 'shipto') {
		cartDelivery.delivery.address = address ? {
			address: address.address1,
			apt_suite: address.address2,
			city: address.city,
			state: address.province,
			zip: address.zip,
			country: address.country,
			phone: phone,
		} : cartDelivery.delivery.address;
	} else {
		try {
			const addressString = lineItem.attributes.find(
				attribute => attribute.key === 'distributor_address',
			)?.value;
			if (typeof addressString === 'string') {
				cartDelivery.delivery.address = JSON.parse(addressString);
			}
		} catch (e) {
			console.error('Error parsing address', e);
		}
	}
	return cartDelivery;
}
