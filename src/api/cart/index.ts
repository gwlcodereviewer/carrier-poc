import axios from 'axios';
import {
	IBuyerIdentity,
	ICart,
	ICartLineInput,
	ICheckoutAssociateResponse,
	ICheckoutOneItemResponse,
	IDraftOrderInput,
	IDraftOrderResponse,
	IUpdateLineItemInput,
} from '@/api/cart/types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LocalStorage } from '@/constant';
import { getEnvironmentVars } from '../../../environment';

const {
	BASE_URL,
	SHOPIFY_AUTH_ACCESS_TOKEN,
	SHOPIFY_PRODUCT_ACCESS_TOKEN,
	ADMIN_API_URL,
} = getEnvironmentVars();

const storeFrontHeaders = {
	'Content-Type': 'application/json',
	'X-Shopify-Storefront-Access-Token': SHOPIFY_AUTH_ACCESS_TOKEN,
};

const storeAdminHeaders = {
	'Content-Type': 'application/json',
	'X-Shopify-Access-Token': SHOPIFY_PRODUCT_ACCESS_TOKEN,
};

const DEFAULT_FIRST = 100;

const cartFields = `
  checkoutUrl
  createdAt
  id
  totalQuantity
  updatedAt
  cost {
    checkoutChargeAmount {
      amount
      currencyCode
    }
    subtotalAmount {
      amount
      currencyCode
    }
    totalAmount {
      amount
      currencyCode
    }
    totalDutyAmount {
      amount
      currencyCode
    }
    totalTaxAmount {
      amount
      currencyCode
    }
  }
  lines(first: $first) {
    pageInfo {
      endCursor
      hasNextPage
      hasPreviousPage
      startCursor
    }
    edges {
      cursor
      node {
        id
        merchandise {
          ... on ProductVariant {
            id
            sku
            price {
                currencyCode
                amount
            }
            product {
              id
              featuredImage {
                url
              }
              title
            }
            title
          }
        }
        quantity
        id
        cost {
            amountPerQuantity {
                currencyCode
                amount
            }
            totalAmount {
                currencyCode
                amount
            }
        }
        attributes {
            key
            value
        }
      }
    }
  }
  attributes {
    key
    value
  }
`;

export const getCart = async (cartId: string): Promise<ICart | undefined> => {
	const variables = {
		cartId,
		first: DEFAULT_FIRST,
	};
	const query = JSON.stringify({
		query: `query GetCart($cartId: ID!, $first: Int!) {
      cart(id: $cartId) {
          ${cartFields}
        }
      }
    `,
		variables,
	});

	try {
		const url = `${BASE_URL}/api/2021-10/graphql.json`;
		const response = await axios.post(url, query, {
			headers: storeFrontHeaders,
		});
		return response.data.data?.cart;
	} catch (error) {
		throw error;
	}
};

export const addLineItemToCart = async (
	cartId: string,
	lineItems: ICartLineInput[],
): Promise<[ICart, undefined] | [undefined, string]> => {
	const variables = {
		cartId,
		first: DEFAULT_FIRST,
		lines: lineItems,
	};
	const query = JSON.stringify({
		query: `mutation MyMutation($lines: [CartLineInput!]!, $cartId: ID!, $first: Int!) {
      cartLinesAdd(cartId: $cartId, lines: $lines) {
        userErrors {
          code
          field
          message
        }
        cart {
          ${cartFields}
        }
      }
    }
    `,
		variables,
	});

	try {
		const url = `${BASE_URL}/api/2021-10/graphql.json`;
		const response = await axios.post(url, query, {
			headers: storeFrontHeaders,
		});

		const { cartLinesAdd } = response.data.data;
		const { userErrors } = cartLinesAdd;
		if (userErrors && userErrors.length > 0) {
			return [undefined, userErrors[0].message];
		}
		if (!cartLinesAdd?.cart) {
			return [undefined, 'Failed to add line items to cart'];
		}
		return [cartLinesAdd.cart, undefined];
	} catch (error) {
		throw error;
	}
};

export const removeLineItemsFromCart = async (
	cartId: string,
	lineItemIds: string[],
): Promise<[ICart, undefined] | [undefined, string]> => {
	const variables = {
		cartId,
		first: DEFAULT_FIRST,
		lineIds: lineItemIds,
	};
	const query = JSON.stringify({
		query: `mutation MyMutation($lineIds: [ID!]!, $cartId: ID!, $first: Int!) {
      cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
        userErrors {
          code
          field
          message
        }
        cart {
          ${cartFields}
        }
      }
    }
    `,
		variables,
	});

	try {
		const url = `${BASE_URL}/api/2021-10/graphql.json`;
		const response = await axios.post(url, query, {
			headers: storeFrontHeaders,
		});
		const { cartLinesRemove } = response.data.data;
		const { userErrors } = cartLinesRemove;
		if (userErrors && userErrors.length > 0) {
			return [undefined, userErrors[0].message];
		}
		if (!cartLinesRemove?.cart) {
			return [undefined, 'Failed to remove line items from cart'];
		}
		return [cartLinesRemove.cart, undefined];
	} catch (error) {
		throw error;
	}
};

export const updateLineItems = async (
	cartId: string,
	lines: IUpdateLineItemInput[],
): Promise<[ICart, undefined] | [undefined, string]> => {
	const variables = {
		cartId,
		first: DEFAULT_FIRST,
		lines,
	};
	const query = JSON.stringify({
		query: `mutation MyMutation($lines: [CartLineUpdateInput!]!, $cartId: ID!, $first: Int!) {
      cartLinesUpdate(cartId: $cartId, lines: $lines) {
        userErrors {
          code
          field
          message
        }
        cart {
          ${cartFields}
        }
      }
    }
    `,
		variables,
	});

	try {
		const url = `${BASE_URL}/api/2021-10/graphql.json`;
		const response = await axios.post(url, query, {
			headers: storeFrontHeaders,
		});
		const { cartLinesUpdate } = response.data.data;
		const { userErrors } = cartLinesUpdate;
		if (userErrors && userErrors.length > 0) {
			return [undefined, userErrors[0].message];
		}
		if (!cartLinesUpdate?.cart) {
			return [undefined, 'Failed to update line items in cart'];
		}
		return [cartLinesUpdate.cart, undefined];
	} catch (error) {
		throw error;
	}
};

export const createCart = async (
	buyerId: IBuyerIdentity,
): Promise<[ICart, undefined] | [undefined, string]> => {
	const variables = {
		buyerIdentity: buyerId,
		first: 10,
	};
	const query = JSON.stringify({
		query: `mutation MyMutation($buyerIdentity: CartBuyerIdentityInput, $first: Int!) {
			cartCreate(
				input: {buyerIdentity: $buyerIdentity}
			) {
				userErrors {
					code
					field
					message
				}
				cart {
					${cartFields}
				}
			}
		}
		`,
		variables,
	});

	try {
		const url = `${BASE_URL}/api/2021-10/graphql.json`;
		const response = await axios.post(url, query, {
			headers: storeFrontHeaders,
		});
		const { cartCreate } = response.data.data;
		const { userErrors } = cartCreate;
		if (userErrors && userErrors.length > 0) {
			return [undefined, userErrors[0].message];
		}
		if (!cartCreate?.cart) {
			return [undefined, 'Failed to create cart'];
		}
		return [cartCreate.cart, undefined];
	} catch (error) {
		throw error;
	}
};

export const applyLineOfCredit = async (input: IDraftOrderInput) => {
	const variables = { input };

	const query = JSON.stringify({
		query: `
			mutation draftOrderCreate($input: DraftOrderInput!) {
				draftOrderCreate(input: $input) {
					draftOrder {
						id
					}
					userErrors {
						field
						message
					}
				}
			}
		`,
		variables,
	});
	try {
		const response = await axios.post<IDraftOrderResponse>(
			ADMIN_API_URL,
			query,
			{
				headers: storeAdminHeaders,
			},
		);
		const { draftOrderCreate } = response.data.data;
		const { userErrors } = draftOrderCreate;
		if (userErrors && userErrors.length > 0) {
			return [undefined, userErrors[0].message];
		}
		if (!draftOrderCreate?.draftOrder) {
			return [undefined, 'Failed to create cart'];
		}
		return [draftOrderCreate.draftOrder.id, undefined];
	} catch (error) {
		throw error;
	}
};

export const createCheckoutForOneItem = async (
	buyerId: { countryCode: string },
	email: string,
	shippingAddress: IBuyerIdentity['deliveryAddressPreferences']['deliveryAddress'],
	lineItem: {
		variantId: string;
		quantity: number;
		customAttributes?: { key: string; value: string }[];
	},
): Promise<
	[{ id: string; webUrl: string }, undefined] | [undefined, string]
> => {
	const variables = {
		input: {
			buyerIdentity: buyerId,
			customAttributes: lineItem.customAttributes,
			email,
			shippingAddress,
			lineItems: [lineItem],
		},
	};
	const query = JSON.stringify({
		query: `mutation Checkout($input: CheckoutCreateInput!) {
			checkoutCreate(
				input: $input
			) {
				checkoutUserErrors {
					code
					field
					message
				}
				checkout {
					id
					webUrl
				}
			}
		}
		`,
		variables,
	});

	try {
		const url = `${BASE_URL}/api/2021-10/graphql.json`;
		const response = await axios.post<{ data: ICheckoutOneItemResponse }>(
			url,
			query,
			{
				headers: storeFrontHeaders,
			},
		);
		const { checkoutCreate } = response.data.data;
		const { checkoutUserErrors } = checkoutCreate;
		if (checkoutUserErrors && checkoutUserErrors.length > 0) {
			return [undefined, checkoutUserErrors[0].message];
		}
		if (!checkoutCreate?.checkout) {
			return [undefined, 'Failed to create checkout'];
		}
		return [checkoutCreate.checkout, undefined];
	} catch (error) {
		console.error(error);
		return [undefined, 'Failed to create checkout'];
	}
};

export const linkCheckoutWithCustomer = async (
	checkoutId: string,
): Promise<
	[{ id: string; webUrl: string }, undefined] | [undefined, string]
> => {
	const token =
		(await AsyncStorage.getItem(LocalStorage.SHOPIFY_CUSTOMER_ACCESS_TOKEN)) ||
		'';
	const variables = {
		checkoutId,
		customerAccessToken: token,
	};

	const query = JSON.stringify({
		query: `
		  mutation MyMutation($customerAccessToken: String!,$checkoutId: ID!) {
				checkoutCustomerAssociateV2(
					checkoutId: $checkoutId
					customerAccessToken: $customerAccessToken
				) {
					checkout {
						completedAt
						createdAt
						currencyCode
						id
						updatedAt
						webUrl
					}
					checkoutUserErrors {
						code
						field
						message
					}
					customer {
						id
						firstName
						displayName
						email
						numberOfOrders
						updatedAt
					}
					userErrors {
						field
						message
					}
				}
			}`,
		variables,
	});

	try {
		const url = `${BASE_URL}/api/2021-10/graphql.json`;
		const response = await axios.post<{ data: ICheckoutAssociateResponse }>(
			url,
			query,
			{
				headers: storeFrontHeaders,
			},
		);
		const { checkoutCustomerAssociateV2 } = response.data.data;
		const { checkoutUserErrors } = checkoutCustomerAssociateV2;
		if (checkoutUserErrors && checkoutUserErrors.length > 0) {
			return [undefined, checkoutUserErrors[0].message];
		}
		if (!checkoutCustomerAssociateV2?.checkout) {
			return [undefined, 'Failed to create checkout'];
		}
		return [checkoutCustomerAssociateV2.checkout, undefined];
	} catch (error) {
		console.error(error);
		return [undefined, 'Failed to create checkout'];
	}
};
