import axios from 'axios';
import {
	ICustomerAccessTokenResponse,
	ICustomerDetails,
} from '@/api/auth/types';
import { getEnvironmentVars } from '../../../environment';

const { AUTH_URL, SHOPIFY_AUTH_ACCESS_TOKEN } = getEnvironmentVars();

const headers = {
	'Content-Type': 'application/json',
	'X-Shopify-Storefront-Access-Token': SHOPIFY_AUTH_ACCESS_TOKEN,
};

export const getAuthToken = async (
	username: string,
	password: string,
): Promise<[string, undefined] | [undefined, string]> => {
	const query = JSON.stringify({
		query: `mutation MyMutation($input: CustomerAccessTokenCreateInput!) {
        customerAccessTokenCreate(input: $input) {
          customerAccessToken {
            accessToken
            expiresAt
          }
          customerUserErrors {
            code
            field
            message
          }
          userErrors {
            field
            message
          }
        }
      }`,
		variables: {
			input: { email: username, password },
		},
	});
	try {
		const getCustomerTokenResponse = await axios.post<{
			data: ICustomerAccessTokenResponse;
		}>(AUTH_URL, query, {
			headers,
		});
		const { data } = getCustomerTokenResponse.data;
		if (
			!data.customerAccessTokenCreate ||
			data.customerAccessTokenCreate.customerUserErrors?.length > 0 ||
			data.customerAccessTokenCreate.userErrors?.length > 0
		) {
			return [undefined, 'Incorrect credentials, please try again.'];
		}
		return [
			data.customerAccessTokenCreate.customerAccessToken.accessToken,
			undefined,
		];
	} catch (error) {
		throw error;
	}
};

export const getAuthUserDetails = async (
	accessToken: string,
): Promise<[ICustomerDetails, undefined] | [undefined, string]> => {
	const query = JSON.stringify({
		query: `query MyQuery($accessToken: String!) {
			customer(customerAccessToken: $accessToken) {
				acceptsMarketing
				addresses(first: 10) {
					edges {
						node {
								address1
								address2
								city
								company
								country
								firstName
								formattedArea
								id
								lastName
								name
								province
								zip
								countryCodeV2
						}
					}
				}
				createdAt
				defaultAddress {
						address1
						address2
						city
						company
						country
						firstName
						formattedArea
						id
						lastName
						name
						province
						zip
						countryCodeV2
				}
				displayName
				email
				firstName
				id
				lastName
				numberOfOrders
				tags
				updatedAt
				lastIncompleteCheckout {
						id
				}
				orders(first: 100, reverse: true) {
            edges {
                node {
                    id
                    billingAddress {
                        address1
                        address2
                        city
                        company
                        country
                        firstName
                        formattedArea
                        id
                        lastName
                        name
                        province
                        zip
                        countryCodeV2
                    }
                    cancelReason
                    canceledAt
                    customAttributes {
                        key
                        value
                    }
                    edited
                    email
                    financialStatus
                    fulfillmentStatus
                    name
                    orderNumber
                    phone
                    processedAt
                    shippingAddress {
                        address1
                        address2
                        city
                        company
                        country
                        firstName
                        formattedArea
                        id
                        lastName
                        name
                        province
                        zip
                        countryCodeV2
                    }
                    statusUrl
                    successfulFulfillments (first: 10) {
                        trackingCompany
                        trackingInfo (first: 10){
                            number
                            url
                        }
                    }
                    totalPrice {
                        amount
                        currencyCode
                    }
										lineItems(first: 100 ) {
                        edges {
                            node {
                                customAttributes {
                                    key
                                    value
                                }
                                originalTotalPrice {
                                    amount
                                    currencyCode
                                }
                                quantity
                                title
                                variant {
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
                        }
                    }
                }
            }
        }
			}
		}`,
		variables: {
			accessToken,
		},
	});
	try {
		const getCustomerDetailsResponse = await axios.post<{
			data: { customer: ICustomerDetails };
		}>(AUTH_URL, query, {
			headers,
		});
		const { data } = getCustomerDetailsResponse.data;
		if (!data.customer) {
			return [undefined, 'Incorrect credentials, please try again.'];
		}
		return [data.customer, undefined];
	} catch (error) {
		throw error;
	}
};
