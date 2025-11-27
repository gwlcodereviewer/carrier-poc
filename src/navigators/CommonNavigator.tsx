import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import { useTheme } from '@/theme';

import type { CommonStackParamList } from '@/types/navigation';
import { Checkout } from '@/screens/Cart';
import { ToastProvider } from '@/contexts/ToastContext';

const CommonNavigation = createStackNavigator<CommonStackParamList>();

function CommonNavigator() {
	return (
		<ToastProvider>
			<CommonNavigation.Navigator screenOptions={{ headerShown: false }}>
				<CommonNavigation.Screen name="Checkout" component={Checkout} />
			</CommonNavigation.Navigator>
		</ToastProvider>
	);
}

export default CommonNavigator;
