import axios from 'axios';
import { IProduct, IProductDetails } from '@/api/product/types';
import { getEnvironmentVars } from '../../../environment';

const { BASE_URL, SHOPIFY_PRODUCT_ACCESS_TOKEN } = getEnvironmentVars();

const headers = {
	'Content-Type': 'application/json',
	'X-Shopify-Access-Token': SHOPIFY_PRODUCT_ACCESS_TOKEN,
};

export const getProductById = async (
	id: string,
): Promise<IProductDetails | undefined> => {
	const variables = { id };
	const query = JSON.stringify({
		query: `
      query MyQuery($id: ID!) {
        product(id :$id) {
          id
          title
          featuredImage {
            id
            src
          }
          images(first: 10) {
            edges {
              node {
                altText
                src
              }
            }
          }
          description
          mediaCount
          variants(first: 10) {
            edges {
              node {
                id
                sku
                availableForSale
                inventoryQuantity
                price
              }
            }
          }
        }
      }
    `,
		variables,
	});

	try {
		const url = `${BASE_URL}admin/api/2023-10/graphql.json`;
		const getProductByIdResponse = await axios.post(url, query, { headers });
		if (getProductByIdResponse.data.error) {
			throw new Error(getProductByIdResponse.data.error);
		}
		return getProductByIdResponse.data.data?.product;
	} catch (error) {
		return undefined;
	}
};
