import { IMoneyV2 } from '@/api/common-types';
import { ICartLine } from '@/api/cart/types';

export interface ICustomerAccessTokenResponse {
	customerAccessTokenCreate: {
		customerAccessToken: {
			accessToken: string;
			expiresAt: string;
		};
		customerUserErrors: {
			code: string;
			field: string;
			message: string;
		}[];
		userErrors: {
			field: string;
			message: string;
		}[];
	};
}

export interface IOrderLineItem {
	customAttributes: { key: string; value: string }[];
	originalTotalPrice: IMoneyV2;
	quantity: number;
	title: string;
	variant: {
		id: string;
		sku: string;
		price: IMoneyV2;
		product: {
			id: string;
			featuredImage: {
				url: string;
			};
			title: string;
		};
		title: string;
	};
}
export interface IOrder {
	billingAddress: IAddress;
	totalPrice: IMoneyV2;
	customAttributes: { key: string; value: string }[];
	customerUrl: string;
	edited: boolean;
	email: string;
	financialStatus: string;
	fulfillmentStatus: string;
	id: string;
	name: string;
	orderNumber: number;
	phone: string;
	processedAt: string;
	shippingAddress: IAddress;
	statusUrl: string;
	cancelReason: string;
	canceledAt: string;
	lineItems: {
		edges: {
			node: IOrderLineItem;
		}[];
	};
}

export interface IAddress {
	address1: string;
	address2: string;
	city: string;
	company: string;
	country: string;
	firstName: string;
	lastName: string;
	id: string;
	name: string;
	province: string;
	zip: string;
	formattedArea: string;
	countryCodeV2: string;
}

export interface ICustomerDetails {
	acceptsMarketing: boolean;
	addresses: {
		edges: {
			node: IAddress;
		}[];
	};
	createdAt: string;
	defaultAddress: IAddress;
	displayName: string;
	email: string;
	firstName: string;
	id: string;
	lastName: string;
	tags: string[];
	updatedAt: string;
	lastIncompleteCheckout: {
		id: string;
	};
	orders: {
		edges: {
			node: IOrder;
		}[];
	};
}

export interface IOrderDelivery {
	delivery: {
		method: 'shipto' | 'pickup' | '';
		address: {
			address: string;
			apt_suite: string;
			city: string;
			state: string;
			zip: string;
			country: string;
			phone: string;
		};
	};
	lineItems: IOrderLineItem[];
}
