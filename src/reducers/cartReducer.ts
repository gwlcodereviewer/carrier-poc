import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
	IBuyerIdentity,
	ICart,
	ICartLineInput,
	IDraftOrderInput,
	IUpdateLineItemInput,
} from '@/api/cart/types';
import {
	addLineItemToCart,
	getCart,
	removeLineItemsFromCart,
	updateLineItems,
	createCart as createCartApi,
	applyLineOfCredit,
} from '@/api/cart';
import { setCartInStorage } from '@/api/cart/helper';

export interface CartState {
	cartId: string | null;
	isLoadingCart: boolean;
	readonly cartState: {
		cart: ICart | null;
		addToCartError: string | null;
		addToCartLoading: boolean;
		removeFromCartError: string | null;
		removeFromCartLoading: boolean;
		updateLineItemsError: string | null;
		updateLineItemsLoading: boolean;
	};
	isApplyingLineOfCredit: boolean;
	applyingLineOfCreditError: string | null;
}

const cartSlice = createSlice({
	name: 'cart',
	initialState: {
		cartId: null,
		isLoadingCart: false,
		cartState: {
			cart: null,
			addToCartError: null,
			addToCartLoading: false,
			removeFromCartError: null,
			removeFromCartLoading: false,
			updateLineItemsLoading: false,
			updateLineItemsError: null,
		},
		isApplyingLineOfCredit: false,
		applyingLineOfCreditError: null,
	} as CartState,
	reducers: {
		setLoadingCart: (state, action: PayloadAction<boolean>) => {
			state.isLoadingCart = action.payload;
		},
		setAddToCartLoading: (state, action: PayloadAction<boolean>) => {
			state.cartState.addToCartLoading = action.payload;
		},
		setAddToCartError: (state, action: PayloadAction<string>) => {
			state.cartState.addToCartError = action.payload;
			state.cartState.addToCartLoading = false;
		},
		setCart: (state, action: PayloadAction<ICart>) => {
			state.cartState.cart = action.payload;
		},
		setRemoveFromCartLoading: (state, action: PayloadAction<boolean>) => {
			state.cartState.removeFromCartLoading = action.payload;
		},
		setRemoveFromCartError: (state, action: PayloadAction<string>) => {
			state.cartState.removeFromCartError = action.payload;
			state.cartState.removeFromCartLoading = false;
		},
		setUpdateLineItemsLoading: (state, action: PayloadAction<boolean>) => {
			state.cartState.updateLineItemsLoading = action.payload;
		},
		setUpdateLineItemsError: (state, action: PayloadAction<string>) => {
			state.cartState.updateLineItemsError = action.payload;
			state.cartState.updateLineItemsLoading = false;
		},
		setCartId: (state, action: PayloadAction<string>) => {
			state.cartId = action.payload;
		},
		setIsApplyingLineOfCredit: (state, action: PayloadAction<boolean>) => {
			state.isApplyingLineOfCredit = action.payload;
		},
		setApplyingLineOfCreditError: (state, action: PayloadAction<string>) => {
			state.applyingLineOfCreditError = action.payload;
		},
	},
});

export const {
	setCart,
	setLoadingCart,
	setRemoveFromCartLoading,
	setRemoveFromCartError,
	setAddToCartError,
	setAddToCartLoading,
	setUpdateLineItemsLoading,
	setUpdateLineItemsError,
	setCartId,
	setIsApplyingLineOfCredit,
	setApplyingLineOfCreditError,
} = cartSlice.actions;
export default cartSlice.reducer;

export const loadCart = (cartId: string) => async (dispatch: any) => {
	dispatch(setLoadingCart(true));
	try {
		const cart = await getCart(cartId);
		cart && dispatch(setCart(cart));
	} catch (error) {
		console.error('Error loading cart', error);
	}
	dispatch(setLoadingCart(false));
};

export const addToCart =
	(cartId: string, lineItems: ICartLineInput[], successCallback?: () => void) =>
	async (dispatch: any) => {
		dispatch(setAddToCartLoading(true));
		try {
			const [cart, error] = await addLineItemToCart(cartId, lineItems);
			if (error) {
				dispatch(setAddToCartError(error));
			} else if (cart) {
				dispatch(setCart(cart));
				successCallback && successCallback();
			} else {
				dispatch(setAddToCartError('Unknown error adding to cart'));
			}
		} catch (error) {
			console.error('Error adding to cart', error);
		}
		dispatch(setAddToCartLoading(false));
	};

export const removeFromCart =
	(cartId: string, lineItemIds: string[], callback?: () => void) =>
	async (dispatch: any) => {
		dispatch(setRemoveFromCartLoading(true));
		try {
			const [cart, error] = await removeLineItemsFromCart(cartId, lineItemIds);
			if (error) {
				dispatch(setRemoveFromCartError(error));
			} else if (cart) {
				dispatch(setCart(cart));
				if (callback) {
					callback();
				}
			} else {
				dispatch(setRemoveFromCartError('Unknown error removing from cart'));
			}
		} catch (error) {
			console.error('Error removing from cart', error);
		}
		dispatch(setRemoveFromCartLoading(false));
	};

export const updateLineItemsInCart =
	(cartId: string, lines: IUpdateLineItemInput[], callback?: () => void) =>
	async (dispatch: any) => {
		dispatch(setUpdateLineItemsLoading(true));
		try {
			const [cart, error] = await updateLineItems(cartId, lines);
			if (error) {
				dispatch(setUpdateLineItemsError(error));
			} else if (cart) {
				dispatch(setCart(cart));
				if (callback) {
					callback();
				}
			} else {
				dispatch(setUpdateLineItemsError('Unknown error removing from cart'));
			}
		} catch (error) {
			console.error('Error removing from cart', error);
		}
		dispatch(setUpdateLineItemsLoading(false));
	};

export const createCart =
	(customerId: string, countryCode: string, buyerId: IBuyerIdentity) =>
	async (dispatch: any) => {
		dispatch(setLoadingCart(true));
		try {
			const [cart, _] = await createCartApi(buyerId);
			if (!cart) {
				throw new Error('Failed to create cart');
			}
			await setCartInStorage(customerId, countryCode, cart.id);
			dispatch(setCartId(cart.id));
			dispatch(setCart(cart));
		} catch (error) {
			console.error('Error creating cart', error);
		}
		dispatch(setLoadingCart(false));
	};

export const upsertCart =
	(
		cartId: string,
		customerId: string,
		countryCode: string,
		buyerId: IBuyerIdentity,
	) =>
	async (dispatch: any) => {
		dispatch(setLoadingCart(true));
		const cart = await getCart(cartId);
		if (cart) {
			dispatch(setCart(cart));
			dispatch(setCartId(cart.id));
		} else {
			dispatch(createCart(customerId, countryCode, buyerId));
		}
		dispatch(setLoadingCart(false));
	};

export const checkoutWithLineOfCredit =
	(
		input: IDraftOrderInput,
		lineIds: string[],
		cartId: string,
		successCallback: () => void = () => {},
		failCallback: (msg: string) => void = () => {},
	) =>
	async (dispatch: any) => {
		dispatch(setIsApplyingLineOfCredit(true));
		try {
			const [id, error] = await applyLineOfCredit(input);
			if (error) {
				throw new Error(error);
			}
			if (!id) {
				throw new Error('Failed to apply line of credit');
			}
			console.log(id);
			dispatch(removeFromCart(cartId, lineIds));
			successCallback();
		} catch (error) {
			console.error('Error applying line of credit', error);
			// @ts-ignore
			failCallback(error?.message || 'Failed to apply line of credit');
		}
		dispatch(setIsApplyingLineOfCredit(false));
	};
