import React from 'react';
import {
	createStackNavigator,
} from '@react-navigation/stack';

import Login from '@/screens/Auth/Login';
import { AuthStackParamList } from '@/types/navigation';
import { ToastProvider } from '@/contexts/ToastContext';

const AuthStack = createStackNavigator<AuthStackParamList>();

function AuthNavigator() {
	return (
		<ToastProvider>
			<AuthStack.Navigator
				initialRouteName="Login"
				screenOptions={{
					headerShown: false,
				}}
			>
				<AuthStack.Screen name="Login" component={Login as any}/>
			</AuthStack.Navigator>
		</ToastProvider>
	);
}

export default AuthNavigator;
