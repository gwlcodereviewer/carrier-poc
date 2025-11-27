import {
	Dimensions,
	RefreshControl,
	ScrollView,
	Text,
	useWindowDimensions,
	View,
} from 'react-native';
import { FC, useEffect, useState } from 'react';
import { styles } from '@/screens/Account/MyAccount/MyAccountWrapper.styles';
import { MyAddresses } from '@/screens/Account/MyAccount/components';
import { AnimatedTabHeader } from '@/components/organisms';
import { AnimatedTabPages } from '@/components/template';
import { useMyAccountContext } from '@/screens/Account/MyAccount/context';
import { TrackOrder } from '@/screens/Account/MyAccount/components/TrackOrder';
import { OrderHistory } from '@/screens/Account/MyAccount/components/OrderHistory';
import { useAppDispatch } from '@/app/store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LocalStorage } from '@/constant';
import { getAuthUserDetails } from '@/api/auth';
import { setAuthCustomer } from '@/reducers/authReducer';
import Animated, {
	Easing,
	useAnimatedRef, useAnimatedStyle,
	useSharedValue,
	withTiming,
	WithTimingConfig,
} from 'react-native-reanimated';

interface Props {}

const animationConfig: WithTimingConfig = {
	duration: 500,
	easing: Easing.ease
}

const tabs = [
	{
		label: 'Track Order',
		key: '1',
	},
	{
		label: 'Order History',
		key: '2',
	},
];
const windowHeight = Dimensions.get('window').height;

export const MyAccountWrapper: FC<Props> = () => {
	const { width } = useWindowDimensions();
	const dispatch = useAppDispatch();
	const animatedScrollRef = useAnimatedRef<Animated.ScrollView>();
	const [selectedTab, setSelectedTab] = useState(tabs[0].key);
	const [showAddresses, setShowAddresses] = useState(true);
	const [refreshing, setRefreshing] = useState(false);

	const leftTabFlexValue = useSharedValue(1);
	const rightTabFlexValue = useSharedValue(0);

	useEffect(() => {
		if (animatedScrollRef.current) {
			animatedScrollRef.current.scrollTo({ x: 0, animated: true });
		}
	}, [showAddresses, selectedTab]);

	useEffect(() => {
		leftTabFlexValue.value = withTiming(selectedTab === tabs[0].key? 1: 0, animationConfig);
		rightTabFlexValue.value = withTiming(selectedTab === tabs[0].key? 0: 1, animationConfig);
	}, [selectedTab]);

	const $leftTabFlex = useAnimatedStyle(() => {
		return {
			flex: leftTabFlexValue.value,
		};
	});

	const $rightTabFlex = useAnimatedStyle(() => {
		return {
			flex: rightTabFlexValue.value,
		};
	});

	const selectTab = (key: string) => {
		setSelectedTab(key);
		setShowAddresses(false);
	};

	const onRefresh = async () => {
		setRefreshing(true);
		const token = await AsyncStorage.getItem(
			LocalStorage.SHOPIFY_CUSTOMER_ACCESS_TOKEN,
		);
		if (!token) {
			setRefreshing(false);
			return;
		}
		const [customer, error] = await getAuthUserDetails(token);
		if (error || !customer) {
			setRefreshing(false);
			return;
		}
		dispatch(setAuthCustomer(customer));
		setRefreshing(false);
	};


	return (
		<Animated.ScrollView
			ref={animatedScrollRef}
			style={styles.container}
			contentContainerStyle={{ flexGrow: 1 }}
			nestedScrollEnabled
			refreshControl={
				<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
			}
			showsVerticalScrollIndicator={false}
		>
			<MyAddresses
				setShowAddresses={setShowAddresses}
				showAddresses={showAddresses}
			/>
			<AnimatedTabPages tabs={tabs} selected={selectedTab} onPress={selectTab} showAddress={showAddresses}>
				<Animated.View style={[{ width }, $leftTabFlex]}>
					<TrackOrder />
				</Animated.View>
				<Animated.View style={[{ width }, $rightTabFlex]}>
					<OrderHistory />
				</Animated.View>
			</AnimatedTabPages>
		</Animated.ScrollView>
	);
};
