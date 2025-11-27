import { getAuthToken, getAuthUserDetails } from '@/api/auth';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LocalStorage } from '@/constant';
import { ICustomerDetails } from '@/api/auth/types';
import { loadConfig } from '@/reducers/configReducer';

export interface AuthState {
	authError: string | null;
	isLoading: boolean;
	customerAccessToken: string;
	authCustomer: ICustomerDetails | null;
}

const authSlice = createSlice({
	name: 'auth',
	initialState: {
		authError: null,
		isLoading: false,
		customerAccessToken: '',
		authCustomer: null,
	} as AuthState,
	reducers: {
		setLoading: (state, action: PayloadAction<boolean>) => {
			state.isLoading = action.payload;
			if (action.payload) {
				state.authError = null;
			}
		},
		loginSuccess(state, action) {
			state.isLoading = false;
			state.authError = null;
		},
		storeAccessToken(state, action: PayloadAction<string>) {
			state.customerAccessToken = action.payload;
		},
		clearError(state) {
			state.authError = null;
		},
		loginFailure(state, action: PayloadAction<string>) {
			state.isLoading = false;
			state.authError = action.payload;
		},
		setAuthCustomer(state, action: PayloadAction<ICustomerDetails | null>) {
			state.authCustomer = action.payload;
		},
	},
});

export const {
	setLoading,
	loginSuccess,
	storeAccessToken,
	loginFailure,
	clearError,
	setAuthCustomer,
} = authSlice.actions; // Fix: export actions, not reducer
export default authSlice.reducer;

export const sendLoginRequest =
	(
		username: string,
		password: string,
		callback?: () => void,
		storeToken = false,
	) =>
	async (dispatch: any) => {
		dispatch(setLoading(true));
		try {
			const [token, errorMessage] = await getAuthToken(username, password);
			if (errorMessage) {
				dispatch(loginFailure(errorMessage));
				return;
			}
			if (!token) {
				dispatch(loginFailure('Something went wrong, please try again.'));
				return;
			}

			if (storeToken) {
				dispatch(storeAccessToken(token));
			}
			await AsyncStorage.setItem(
				LocalStorage.SHOPIFY_CUSTOMER_ACCESS_TOKEN,
				token,
			);
			dispatch(loadConfig());
			dispatch(loginSuccess(token));

			if (callback) {
				callback();
			}
		} catch (error: any) {
			dispatch(loginFailure(error.message));
		}
	};
