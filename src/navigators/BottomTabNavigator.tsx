import { BottomTabParamList } from '@/types/navigation';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { FC, JSX, useEffect, useMemo } from 'react';
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Text } from '@/components/atoms/Text';
import { useTheme } from '@/theme';
import MyAccount from '@/theme/assets/images/my_account.png';
import MyJob from '@/theme/assets/images/my_job.png';
import Search from '@/theme/assets/images/search.png';
import { useSelector } from 'react-redux';
import { RootState } from '@/app/rootReducer';
import { createMaterialBottomTabNavigator } from 'react-native-paper/react-navigation';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, {
	SharedValue,
	useAnimatedStyle,
	useSharedValue,
	withTiming,
} from 'react-native-reanimated';
import { CartNavigator } from './CartNavigator';
import { SearchNavigator } from './SearchNavigator';
import { AccountNavigator } from './AccountNavigator';

const BottomTab = createMaterialBottomTabNavigator<BottomTabParamList>();

export function BottomTabNavigator() {
	const { colors, backgrounds } = useTheme();
	const { bottom } = useSafeAreaInsets();
	const {
		cartState: { cart },
	} = useSelector((state: RootState) => state.cart);

	const translateY1 = useSharedValue(100);
	const translateY2 = useSharedValue(100);
	const translateY3 = useSharedValue(100);

	const numItems = useMemo(() => {
		if (!cart) return 0;

		return cart.lines.edges.reduce((acc, cur) => {
			return acc + cur.node.quantity;
		}, 0);
	}, [cart]);

	/**
	 * Name: useEffect
	 * Desc: useEffect to trigger the animation
	 */
	useEffect(() => {
		const animateTabs = async () => {
			await new Promise(resolve => setTimeout(resolve, 300)); // Initial delay
			animateTab(translateY1, 1000);
			animateTab(translateY2, 1300);
			animateTab(translateY3, 1600);
		};
		animateTabs();
	}, []);

	/**
	 * Name: animateTab
	 * Desc: Function to assign share value animation configs
	 * @param {SharedValue<number>} translateY - shared value of each tab
	 * @param {number} animationDuration - Animation duration of each tab
	 */
	const animateTab = (
		translateY: SharedValue<number>,
		animationDuration: number,
	) => {
		translateY.value = withTiming(0, { duration: animationDuration });
	};

	/**
	 * Name: animatedStyle
	 * Desc: Function to start animation
	 * @param {SharedValue<number>} translateY - shared value of each tab
	 */
	const animatedStyle = (translateY: SharedValue<number>) => {
		return useAnimatedStyle(() => {
			return {
				transform: [{ translateY: translateY.value }],
			};
		});
	};

	return (
		<BottomTab.Navigator
			initialRouteName="Search"
			labeled={false}
			barStyle={[
				backgrounds.white,
				{ height: 60 + bottom, paddingBottom: bottom },
			]}
			activeIndicatorStyle={[backgrounds.white]}
			activeColor={colors.tertiary_green}
			inactiveColor={colors.light_gray}
			safeAreaInsets={{ bottom }}
			sceneAnimationType="shifting"
			sceneAnimationEnabled
		>
			<BottomTab.Screen
				name="Account"
				component={AccountNavigator}
				options={{
					tabBarIcon: ({ color }) => (
						<Animated.View
							style={[styles.tabContainer, animatedStyle(translateY1)]}
						>
							<Image source={MyAccount} style={styles.icon} tintColor={color} />
						</Animated.View>
					),
				}}
			/>
			<BottomTab.Screen
				name="Search"
				component={SearchNavigator}
				options={{
					tabBarIcon: ({ color }) => (
						<Animated.View
							style={[styles.tabContainer, animatedStyle(translateY2)]}
						>
							<Image source={Search} style={styles.icon} tintColor={color} />
						</Animated.View>
					),
				}}
			/>
			<BottomTab.Screen
				name="Cart"
				component={CartNavigator}
				options={{
					tabBarIcon: ({ color }) => (
						<Animated.View
							style={[styles.tabContainer, animatedStyle(translateY3)]}
						>
							<View style={[styles.label, backgrounds.tertiary_green]}>
								<Text size="size_12" color="white" weight="thin">
									{numItems}
								</Text>
							</View>
							<Image source={MyJob} style={styles.icon} tintColor={color} />
						</Animated.View>
					),
				}}
			/>
		</BottomTab.Navigator>
	);
}

const styles = StyleSheet.create({
	tabContainer: {
		flex: 1,
	},
	tab: {
		flex: 1,
		alignItems: 'center',
		paddingTop: 10,
	},
	icon: {
		height: 24,
		width: 24,
		resizeMode: 'contain',
	},
	label: {
		position: 'absolute',
		top: -6,
		left: 16,
		minWidth: 25,
		borderRadius: 30,
		paddingHorizontal: 6,
		paddingVertical: 2,
		justifyContent: 'center',
		alignItems: 'center',
		zIndex: 10,
	},
});
