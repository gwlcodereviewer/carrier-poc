import { CardStyleInterpolators, createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import { useTheme } from '@/theme';

import type { ApplicationStackParamList } from '@/types/navigation';
import { useSelector } from 'react-redux';
import { RootState } from '@/app/rootReducer';
import { navigationRef } from '@/contexts';
import CommonNavigator from '@/navigators/CommonNavigator';
import { BottomTabNavigator } from './BottomTabNavigator';
import AuthNavigator from './AuthNavigator';

const AppNavigation = createStackNavigator<ApplicationStackParamList>();

function RootNavigator() {
	const { variant, navigationTheme } = useTheme();
	const { authCustomer } = useSelector((state: RootState) => state.auth);

	return (
		<NavigationContainer theme={navigationTheme} ref={navigationRef}>
			<AppNavigation.Navigator
				key={variant}
				screenOptions={{
					headerShown: false,
					cardStyleInterpolator: CardStyleInterpolators.forFadeFromBottomAndroid
				}}
			>
				{authCustomer?.id ? (
					<>
						<AppNavigation.Screen
							name="BottomTabs"
							component={BottomTabNavigator}
						/>
						<AppNavigation.Screen name="Common" component={CommonNavigator} />
					</>
				) : (
					<AppNavigation.Screen name="Auth" component={AuthNavigator} />
				)}
			</AppNavigation.Navigator>
		</NavigationContainer>
	);
}

export default RootNavigator;
