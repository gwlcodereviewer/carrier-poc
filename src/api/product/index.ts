import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LocalStorage } from '@/constant';
import { getEnvironmentVars } from '../../../environment';
import { PartNumberByCategory } from './types';
import { getNormalizeModelSearchResult } from './helper';

const {
	BASE_URL,
	SHOPIFY_PRODUCT_ACCESS_TOKEN,
	SHOP_BREEZE_URL,
	SHOPIFY_AUTH_ACCESS_TOKEN,
} = getEnvironmentVars();

const headers = {
	'Content-Type': 'application/json',
	'X-Shopify-Access-Token': SHOPIFY_PRODUCT_ACCESS_TOKEN,
};

const storeFrontHeaders = {
	'X-Shopify-Storefront-Access-Token': SHOPIFY_AUTH_ACCESS_TOKEN,
	'Content-Type': 'application/json',
};

const ITEMS_PER_PAGE = 100;

export const getProductsByQuery = async (
	queryStr: string,
	page?: number,
	available?: boolean,
) => {
	const sanitizedQueryStr = queryStr ?? '';

	const variable = {
		query: sanitizedQueryStr,
		first: page ? (page + 1) * ITEMS_PER_PAGE : ITEMS_PER_PAGE,
		available: available || true,
	};

	const query = JSON.stringify({
		query: `query MyQuery($query: String!, $available: Boolean, $first: Int) {
      search(query: $query, first: $first, productFilters: {available: $available}) {
        edges {
          node {
            ... on Product {
              id
              featuredImage {
                src
                originalSrc
                id
              }
              description
              title
              variants(first: 10) {
                edges {
                  node {
                    id
                    price {
                      amount
                      currencyCode
                    }
                    sku
                    title
                    storeAvailability(first: 10) {
                      edges {
                        node {
                          available
                          pickUpTime
                          location {
                            address {
                              address1
                              address2
                              city
                              country
                              countryCode
                              formatted
                              latitude
                              longitude
                              phone
                              province
                              provinceCode
                              zip
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
        pageInfo {
          endCursor
          hasNextPage
          hasPreviousPage
          startCursor
        }
      }
    }`,
		variables: variable,
	});

	try {
		const url = `${BASE_URL}api/2023-10/graphql.json`;
		return await axios.post(url, query, { headers: storeFrontHeaders });
	} catch (error) {
		console.log('error', error);
		throw error;
	}
};

export const getProductsByModelId = async (
	modelId: string,
): Promise<PartNumberByCategory> => {
	try {
		const url = `${SHOP_BREEZE_URL}/part/${modelId}`;
		const res = await axios.get(url, {
			headers: {
				Authorization:
					'Basic c2hvcGlmeV93ZWJfUzVkeFp1WkxlVDpreWF6UmFSUFBjQ1BkN21X',
			},
		});
		console.log(res.data);
		return getNormalizeModelSearchResult(res.data === null ? [] : res.data);
	} catch (error) {
		throw error;
	}
};

export const getProductsBySkus = async (skus: string[], page: number) => {
	const skuQueryString = skus.map(sku => `(sku:${sku})`).join('OR');
	const variables = {
		queryString: skuQueryString,
		first: (page + 1) * ITEMS_PER_PAGE,
	};

	const query = JSON.stringify({
		query: `query productQuery($first: Int, $queryString: String!, $after: String, $before: String) {
        products(first: $first, query: $queryString, before: $before, after: $after) {
          edges {
            cursor
            node {
              id
              title
              featuredImage {
                id
                src
              }
              descriptionHtml
              images(first: 10) {
                edges {
                  node {
                    altText
                    src
                  }
                }
              }
              mediaCount
              variants(first: 10) {
                edges {
                  node {
                    id
                    sku
                    availableForSale
                    price
                    inventoryQuantity
                  }
                }
              }
            }
          }
          pageInfo {
            endCursor
            hasNextPage
            hasPreviousPage
            startCursor
          }
        }
      }`,
		variables,
	});

	try {
		const url = `${BASE_URL}admin/api/2023-10/graphql.json`;
		return await axios.post(url, query, { headers });
	} catch (error) {
		throw error;
	}
};
