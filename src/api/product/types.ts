import { IMoneyV2 } from '@/api/common-types';

export enum ProductSearchTypes {
	TITLE = 'Title',
	SDK = 'SDK',
	TAG = 'Tag',
}

export type ProductSearchProps = {
	cursor: string;
	node: {
		id: string;
		title: string;
		featuredImage: {
			id: string;
			src: string;
		};
		descriptionHtml: string;
		images: {
			edges: Array<{
				node: {
					altText: string;
					src: string;
				};
			}>;
		};
		mediaCount: number;
		variants: {
			edges: Array<{
				node: {
					id: string;
					sku: string;
					availableForSale: boolean;
					price: string;
				};
			}>;
		};
	};
};

export interface IModelSearchResultData {
	category: string;
	parts: { PartNumber: string }[];
}

export type PartNumberByCategory = Record<string, string[]>;

export interface IProductVariants {
	node: {
		id: string;
		price: IMoneyV2 | string;
		sku: string;
		title: string;
		inventoryQuantity?: number;
	};
}

export interface IProductDetailsVariants {
	node: {
		id: string;
		price: string;
		sku: string;
		title: string;
		inventoryQuantity: number;
	};
}

export interface IProductDetails {
	id: string;
	featuredImage: {
		src: string;
		originalSrc: string;
		id: string;
	};
	description: string;
	title: string;
	variants: {
		edges: IProductDetailsVariants[];
	};
}

export interface IProduct {
	node: {
		id: string;
		featuredImage: {
			src: string;
			originalSrc: string;
			id: string;
		};
		description: string;
		title: string;
		variants: {
			edges: IProductVariants[];
		};
	};
}
