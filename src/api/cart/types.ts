import { IProductVariants } from '@/api/product/types';
import { IMoneyV2 } from '@/api/common-types';
import { IAddress } from '@/api/auth/types';

export interface IAttribute {
	key: string;
	value: string;
}

export interface ICartLineCost {
	amountPerQuantity: IMoneyV2;
	// compareAtAmountPerQuantity: IMoneyV2;
	// subtotalAmount: IMoneyV2;
	totalAmount: IMoneyV2;
}

export interface ICartProductVariant {
	id: string;
	price: IMoneyV2;
	sku: string;
	title: string;
	product: {
		id: string;
		featuredImage: {
			url: string;
		};
		title: string;
	};
}
export interface ICartLine {
	attributes: IAttribute[];
	cost: ICartLineCost;
	id: string;
	merchandise: ICartProductVariant;
	quantity: number;
}

export interface ICartLineInput {
	merchandiseId: string;
	quantity: number;
	attributes: IAttribute[];
}

export interface ICartCost {
	checkoutChargeAmount: IMoneyV2;
	subtotalAmount: IMoneyV2;
	// subtotalAmountEstimated: boolean;
	totalAmount: IMoneyV2;
	// totalAmountEstimated: boolean;
	totalDutyAmount: IMoneyV2;
	// totalDutyAmountEstimated: boolean;
	totalTaxAmount: IMoneyV2;
	// totalTaxAmountEstimated: boolean;
}

export interface ICart {
	attributes: IAttribute[];
	checkoutUrl: string;
	cost: ICartCost;
	createdAt: string;
	id: string;
	totalQuantity: number;
	updatedAt: string;
	lines: {
		edges: {
			node: ICartLine;
		}[];
	};
}

export interface ICartDelivery {
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
	lineItems: ICartLine[];
}

export interface IUpdateLineItemInput {
	id: string;
	quantity: number;
	attributes: IAttribute[];
}

export type LocalStorageCart = Record<
	string, // customer ID
	Record<string, string> // country code, cart ID
>;

export interface IBuyerIdentity {
	customerAccessToken: string;
	deliveryAddressPreferences: {
		deliveryAddress: {
			address1: string;
			address2: string;
			firstName: string;
			city: string;
			zip: string;
			province: string;
			country: string;
			lastName: string;
			company: string;
		};
	};
	countryCode: string;
}

export interface IBillingAddress {
	address1: string;
	address2: string;
	city: string;
	zip: string;
	province: string;
	country: string;
	firstName: string;
	lastName: string;
	company: string;
}
export interface IDraftOrderInput {
	billingAddress: IBillingAddress;
	customerId: string;
	email: string;
	lineItems: {
		variantId: string;
		quantity: number;
		customAttributes: IAttribute[];
	}[];
	shippingAddress: IBillingAddress;
	useCustomerDefaultAddress: boolean;
	visibleToCustomer: boolean;
}

export interface IDraftOrderResponse {
	data: {
		draftOrderCreate: {
			draftOrder: {
				id: string;
			};
			userErrors: {
				field: string;
				message: string;
			}[];
		};
	};
}

export interface ICheckoutOneItemResponse {
	checkoutCreate: {
		checkout: {
			id: string;
			webUrl: string;
		};
		checkoutUserErrors: {
			field: string;
			message: string;
			code: string;
		}[];
	};
}

export interface ICheckoutAssociateResponse {
	checkoutCustomerAssociateV2: {
		checkout: {
			id: string;
			webUrl: string;
		};
		checkoutUserErrors: {
			field: string;
			message: string;
			code: string;
		}[];
	};
}
