import { ActivityIndicator, Image, ImageBackground, View } from 'react-native';
import { FC, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LocalStorage } from '@/constant';
import AppBg from '@/theme/assets/images/app_bg.png';
import CarrierLogoLight from '@/theme/assets/images/carrier_logo_light.png';
import BgIcons from '@/theme/assets/images/bg_icons.png';
import { Text } from '@/components/atoms';
import { Button } from '@/components/molecules';
import { styles } from '@/components/template/ErrorBoundary/styles';
import { useTheme } from '@/theme';

interface Props {
	resetError: () => void;
}

export const ErrorDetails: FC<Props> = ({ resetError }) => {
	const { colors } = useTheme();
	const [isResetting, setIsResetting] = useState(false);

	useEffect(() => {
		let timeout: any;
		if (isResetting) {
			timeout = setTimeout(() => {
				resetError();
			}, 1000);
		}
		return () => {
			clearTimeout(timeout);
		};
	}, [isResetting]);
	const resetErrors = async () => {
		setIsResetting(true);
		await AsyncStorage.removeItem(LocalStorage.SHOPIFY_CUSTOMER_ACCESS_TOKEN);
	};
	return (
		<ImageBackground source={AppBg} style={styles.container}>
			<View style={styles.logoContainer}>
				<Image source={CarrierLogoLight} style={styles.logo} />
			</View>
			<Text
				size="size_24"
				weight="light"
				color="white"
				style={styles.errorText}
			>
				Something went wrong...
			</Text>
			<View style={styles.buttonContainer}>
				<Button title={isResetting ? '' : 'Reset'} onPress={resetErrors}>
					{isResetting && (
						<ActivityIndicator size="small" color={colors.tint_blue} />
					)}
				</Button>
			</View>
			<Image source={BgIcons} style={styles.bgIcons} />
		</ImageBackground>
	);
};
