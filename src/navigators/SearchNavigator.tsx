import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import ProductSearch from '@/screens/Product/ProductSearch';
import ProductDetails from '@/screens/Product/ProductDetails';
import { SearchStackParamList } from '@/types/navigation';
import { Checkout } from '@/screens/Cart';
import { ToastProvider } from '@/contexts/ToastContext';

const SearchStack = createStackNavigator<SearchStackParamList>();

export function SearchNavigator() {
	return (
		<ToastProvider>
			<SearchStack.Navigator
				initialRouteName="ProductSearch"
				screenOptions={{
					headerShown: false,
				}}
			>
				<SearchStack.Screen name="ProductSearch" component={ProductSearch} />
				<SearchStack.Screen name="ProductDetails" component={ProductDetails} />
				<SearchStack.Screen name="Checkout" component={Checkout} />
			</SearchStack.Navigator>
		</ToastProvider>
	);
}
