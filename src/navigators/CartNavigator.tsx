import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import { CartStackParamList } from '@/types/navigation';
import { Checkout, MyJob } from '@/screens/Cart';
import ProductDetails from '@/screens/Product/ProductDetails';
import { ToastProvider } from '@/contexts/ToastContext';

const CartStack = createStackNavigator<CartStackParamList>();

export function CartNavigator() {
	return (
		<ToastProvider>
			<CartStack.Navigator
				initialRouteName="MyJob"
				screenOptions={{
					headerShown: false,
				}}
			>
				<CartStack.Screen name="MyJob" component={MyJob} />
				<CartStack.Screen name="ProductDetails" component={ProductDetails} />
				<CartStack.Screen name="Checkout" component={Checkout} />
			</CartStack.Navigator>
		</ToastProvider>
	);
}
