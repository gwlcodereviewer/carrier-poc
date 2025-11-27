import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import {
	CompositeScreenProps,
	NavigatorScreenParams,
} from '@react-navigation/native';
import type { StackScreenProps } from '@react-navigation/stack';

export type ApplicationStackParamList = {
	Auth: NavigatorScreenParams<AuthStackParamList>;
	BottomTabs: NavigatorScreenParams<BottomTabParamList>;
	Common: NavigatorScreenParams<CommonStackParamList>;
};

export type ApplicationScreenProps =
	StackScreenProps<ApplicationStackParamList>;

export type CommonStackParamList = {
	Checkout: undefined | { checkoutUrl?: string };
};

export type CommonScreenProps<T extends keyof CommonStackParamList> =
	CompositeScreenProps<
		ApplicationScreenProps,
		StackScreenProps<CommonStackParamList, T>
	>;

export type AuthStackParamList = {
	Login: undefined;
};

export type AuthScreenProps<T extends keyof AuthStackParamList> =
	CompositeScreenProps<
		ApplicationScreenProps,
		StackScreenProps<AuthStackParamList, T>
	>;

export type BottomTabParamList = {
	Account: NavigatorScreenParams<AccountStackParamList>;
	Search: NavigatorScreenParams<SearchStackParamList>;
	Cart: NavigatorScreenParams<CartStackParamList>;
};

export type AccountStackParamList = {
	MyAccount: undefined;
};

export type AccountScreenProps<T extends keyof AccountStackParamList> =
	CompositeScreenProps<
		ApplicationScreenProps,
		CompositeScreenProps<
			BottomTabScreenProps<BottomTabParamList, 'Account'>,
			StackScreenProps<AccountStackParamList, T>
		>
	>;

export type ProductDetailsParam = {
	productId: string;
};
export type SearchStackParamList = {
	ProductSearch: undefined;
	ProductDetails: ProductDetailsParam;
	Checkout: undefined | { checkoutUrl?: string };
};

export type SearchScreenProps<T extends keyof SearchStackParamList> =
	CompositeScreenProps<
		ApplicationScreenProps,
		CompositeScreenProps<
			BottomTabScreenProps<BottomTabParamList, 'Search'>,
			StackScreenProps<SearchStackParamList, T>
		>
	>;

export type CartStackParamList = {
	MyJob: undefined;
	ProductDetails: ProductDetailsParam;
	Checkout: undefined | { checkoutUrl?: string };
};

export type CartScreenProps<T extends keyof CartStackParamList> =
	CompositeScreenProps<
		ApplicationScreenProps,
		CompositeScreenProps<
			BottomTabScreenProps<BottomTabParamList, 'Cart'>,
			StackScreenProps<CartStackParamList, T>
		>
	>;
