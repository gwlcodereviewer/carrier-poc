import { LocalStorage } from '@/constant';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { getAuthUserDetails } from '@/api/auth';
import { setAuthCustomer, storeAccessToken } from '@/reducers/authReducer';
import { loadCart, setCart, setCartId } from '@/reducers/cartReducer';
import { createCart, getCart } from '@/api/cart';
import { LocalStorageCart } from '@/api/cart/types';
import { getCartInStorage, setCartInStorage } from '@/api/cart/helper';

export interface ConfigState {
	shouldShowSwipeOverlay: boolean;
	isHydrated: boolean;
	hasSearched: boolean;
}

interface HydrateConfig {
	hasSearched: boolean;
}

const configSlice = createSlice({
	name: 'config',
	initialState: {
		isHydrated: false,
		// swipe overlay states
		shouldShowSwipeOverlay: false,
		hasSearched: false,
	} as ConfigState,
	reducers: {
		setShouldShowSwipeOverlay: (state, action: PayloadAction<boolean>) => {
			state.shouldShowSwipeOverlay = action.payload;
			if (!action.payload) {
				state.hasSearched = true;
				AsyncStorage.setItem(LocalStorage.HAS_SEARCHED, 'true');
			}
		},
		hydrateConfig: (state, action: PayloadAction<Partial<HydrateConfig>>) => {
			return {
				...state,
				isHydrated: true,
				...action.payload,
			};
		},
	},
});

export const { setShouldShowSwipeOverlay, hydrateConfig } = configSlice.actions;
export default configSlice.reducer;

export const loadConfig = () => async (dispatch: any) => {
	// load local storage
	const hasSearched = await AsyncStorage.getItem(LocalStorage.HAS_SEARCHED);
	const accessToken = await AsyncStorage.getItem(
		LocalStorage.SHOPIFY_CUSTOMER_ACCESS_TOKEN,
	);
	if (!accessToken) {
		dispatch(hydrateConfig({ hasSearched: !!hasSearched }));
		dispatch(setAuthCustomer(null));
		return;
	}
	try {
		const [customer, errorMessage] = await getAuthUserDetails(accessToken);
		if (errorMessage || !customer) {
			// if we have an access token but can't get user details, clear the token
			await AsyncStorage.removeItem(LocalStorage.SHOPIFY_CUSTOMER_ACCESS_TOKEN);
			// @ts-ignore
			throw new Error('rehydration error');
		} else {
			dispatch(setAuthCustomer(customer));
		}
		dispatch(storeAccessToken(accessToken));
		let hasValidCart = false;
		const cartIdInStorage = await getCartInStorage(
			customer.id,
			customer.defaultAddress.countryCodeV2,
		);
		if (cartIdInStorage) {
			const cartDetail = await getCart(cartIdInStorage);
			if (cartDetail) {
				hasValidCart = true;
				dispatch(setCart(cartDetail));
				dispatch(setCartId(cartDetail.id));
			}
		}
		if (!hasValidCart) {
			const [cart, _] = await createCart({
				customerAccessToken: accessToken,
				deliveryAddressPreferences: {
					deliveryAddress: {
						address1: customer.defaultAddress.address1,
						address2: customer.defaultAddress.address2,
						city: customer.defaultAddress.city,
						company: customer.defaultAddress.company,
						country: customer.defaultAddress.country,
						firstName: customer.defaultAddress.firstName,
						lastName: customer.defaultAddress.lastName,
						province: customer.defaultAddress.province,
						zip: customer.defaultAddress.zip,
					},
				},
				countryCode: customer.defaultAddress.countryCodeV2,
			});

			if (cart) {
				dispatch(setCartId(cart.id));
				dispatch(setCart(cart));
				await setCartInStorage(
					customer.id,
					customer.defaultAddress.countryCodeV2,
					cart.id,
				);
			}
		}
	} catch (err) {
		console.error('rehydration error');
	}
	dispatch(hydrateConfig({ hasSearched: !!hasSearched }));
};
