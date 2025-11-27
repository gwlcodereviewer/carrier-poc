import {
	getProductsByModelId,
	getProductsByQuery,
	getProductsBySkus,
} from '@/api/product';
import { IProduct, PartNumberByCategory } from '@/api/product/types';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface ProductState {
	readonly productByModel: {
		productSearchError: string | null;
		products: IProduct[];
		partNumberByCategory: PartNumberByCategory;
		isLoading: boolean;
	};
	readonly productByQuery: {
		productSearchError: string | null;
		products: [];
		isLoading: boolean;
	};
}

const productSearchSlice = createSlice({
	name: 'product',
	initialState: {
		productByModel: {
			productSearchError: null,
			products: [],
			partNumberByCategory: {},
			isLoading: false,
		},
		productByQuery: {
			productSearchError: null,
			products: [],
			isLoading: false,
		},
	} as ProductState,
	reducers: {
		setLoading: (state, action: PayloadAction<boolean>) => {
			state.productByModel.isLoading = action.payload;
		},
		setProductsByCategory: (
			state,
			action: PayloadAction<PartNumberByCategory>,
		) => {
			state.productByModel.partNumberByCategory = action.payload;
		},
		setSearchProducts: (state, action: PayloadAction<any>) => {
			state.productByModel.products = action.payload;
			state.productByModel.productSearchError = null;
			state.productByModel.isLoading = false;
		},
		setSearchError: (state, action: PayloadAction<string>) => {
			state.productByModel.productSearchError = action.payload;
			state.productByModel.isLoading = false;
		},
		setSearchQueryLoading: (state, action: PayloadAction<boolean>) => {
			state.productByQuery.isLoading = action.payload;
		},
		setSearchQueryProducts: (state, action: PayloadAction<any>) => {
			state.productByQuery.products = action.payload;
			state.productByQuery.productSearchError = null;
			state.productByQuery.isLoading = false;
		},
		setSearchQueryError: (state, action: PayloadAction<string>) => {
			state.productByQuery.productSearchError = action.payload;
			state.productByQuery.isLoading = false;
		},
	},
});

export const {
	setLoading,
	setSearchProducts,
	setSearchError,
	setSearchQueryError,
	setSearchQueryLoading,
	setSearchQueryProducts,
	setProductsByCategory,
} = productSearchSlice.actions;
export default productSearchSlice.reducer;

export const searchPartsByQuery =
	(query: string, page = 0) =>
	async (dispatch: any) => {
		dispatch(setSearchQueryLoading(true));
		let retryAttempts = 0;
		let success = false;
		try {
			while (retryAttempts < 3 && !success) {
				const searchResponse = await getProductsByQuery(query, page);
				if (searchResponse.status !== 200) {
					dispatch(setSearchQueryError(searchResponse.statusText));
					return;
				}
				const products = searchResponse.data.data?.search?.edges;
				if (products !== undefined) {
					dispatch(setSearchQueryProducts(products || []));
					success = true;
				}
				retryAttempts += 1;
			}
		} catch (error: any) {
			dispatch(setSearchQueryError(error.message));
		}
		dispatch(setSearchQueryLoading(false));
	};

export const searchPartsByModel =
	(modelId: string) => async (dispatch: any) => {
		dispatch(setLoading(true));
		try {
			const searchResponse = await getProductsByModelId(modelId);
			dispatch(setProductsByCategory(searchResponse));
			const flattenedPartNumber = Object.values(searchResponse).flat();
			dispatch(searchPartsBySkus(flattenedPartNumber));
		} catch (error: any) {
			dispatch(setSearchError(error.message));
		}
		dispatch(setLoading(false));
	};

export const searchPartsBySkus =
	(skus: string[], page = 0) =>
	async (dispatch: any) => {
		let retryAttempts = 0;
		let success = false;
		try {
			if (skus.length === 0) {
				dispatch(setSearchProducts([]));
				return;
			}
			while (retryAttempts < 3 && !success) {
				const searchResponse = await getProductsBySkus(skus, page);
				if (searchResponse.status !== 200) {
					dispatch(setSearchError(searchResponse.statusText));
					return;
				}
				const products = searchResponse.data.data?.products?.edges;
				if (products !== undefined) {
					dispatch(setSearchProducts(products));
					success = true;
				}
				retryAttempts += 1;
			}
		} catch (error: any) {
			dispatch(setSearchError(error.message));
		}
	};
