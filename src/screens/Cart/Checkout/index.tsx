import { FC, useContext, useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import WebView from 'react-native-webview';
import { useSelector } from 'react-redux';
import { RootState } from '@/app/rootReducer';
import { CommonStackParamList } from '@/types/navigation';
import { StackScreenProps } from '@react-navigation/stack';
import { useTheme } from '@/theme';
import { styles } from '@/screens/Cart/Checkout/styles';
import { GlobalHeaderContext } from '@/contexts';
import { useAppDispatch } from '@/app/store';
import { useIsFocused } from '@react-navigation/native';
import { upsertCart } from '@/reducers/cartReducer';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LocalStorage } from '@/constant';
import { getEnvironmentVars } from '../../../../environment';

const { SHOPIFY_AUTH_ACCESS_TOKEN } = getEnvironmentVars();
export const Checkout: FC<
	StackScreenProps<CommonStackParamList, 'Checkout'>
> = ({ route }) => {
	const { colors } = useTheme();
	const {
		cartState: { cart },
	} = useSelector((state: RootState) => state.cart);
	const { customerAccessToken, authCustomer } = useSelector(
		(state: RootState) => state.auth,
	);
	const [isLoading, setIsLoading] = useState(false);

	return (
		<View style={styles.container}>
			{isLoading && (
				<View style={styles.loaderContainer}>
					<ActivityIndicator size="large" color={colors.primary_light_blue} />
				</View>
			)}
			<WebView
				originWhitelist={['*']}
				source={{
					uri: route.params?.checkoutUrl || cart?.checkoutUrl || '',
					headers: {
						'X-Shopify-Storefront-Access-Token': SHOPIFY_AUTH_ACCESS_TOKEN,
						'X-Shopify-Customer-Access-Token': customerAccessToken,
					},
				}}
				onLoadStart={() => setIsLoading(true)}
				onLoadEnd={() => setIsLoading(false)}
				onError={e => console.log(e)}
				onMessage={e => console.log('message', e)}
				onNavigationStateChange={e => console.log('nav state change', e)}
				sharedCookiesEnabled
				thirdPartyCookiesEnabled
			/>
		</View>
	);
};
