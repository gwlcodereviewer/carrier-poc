import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import { AccountStackParamList } from '@/types/navigation';
import { MyAccount } from '@/screens/Account';
import { ToastProvider } from '@/contexts/ToastContext';

const AccountStack = createStackNavigator<AccountStackParamList>();

export function AccountNavigator() {
	return (
		<ToastProvider>
			<AccountStack.Navigator
				initialRouteName="MyAccount"
				screenOptions={{
					headerShown: false,
				}}
			>
				<AccountStack.Screen name="MyAccount" component={MyAccount} />
			</AccountStack.Navigator>
		</ToastProvider>
	);
}
