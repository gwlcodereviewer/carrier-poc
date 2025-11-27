import {
	FlatList,
	Image,
	ImageStyle,
	TouchableOpacity,
	View,
} from 'react-native';
import { styles } from '@/screens/Account/MyAccount/components/MyAddresses/styles';
import { FC, useEffect, useState } from 'react';
import { useMyAccountContext } from '@/screens/Account/MyAccount/context';
import { Text } from '@/components/atoms';
import { useTheme } from '@/theme';
import ChevronUp from '@/theme/assets/images/chevron_up.png';
import Animated, {
	FadeInUp,
	FadeOutUp,
	useAnimatedStyle,
	useSharedValue,
	withTiming,
} from 'react-native-reanimated';
import { AddressCell } from '@/components/organisms/AddressCell';
import { getFormattedAddress } from '@/screens/Account/MyAccount/utils';

interface Props {
	showAddresses: boolean;
	setShowAddresses: (show: boolean) => void;
}

export const MyAddresses: FC<Props> = ({ showAddresses, setShowAddresses }) => {
	const { borders } = useTheme();
	const { addresses } = useMyAccountContext();

	const sharedRotation = useSharedValue(0);

	useEffect(() => {
		if (showAddresses) {
			sharedRotation.value = withTiming(0, { duration: 300 });
		} else {
			sharedRotation.value = withTiming(180, { duration: 300 });
		}
	}, [showAddresses]);

	const $rotationStyle = useAnimatedStyle<ImageStyle>(() => {
		return {
			transform: [{ rotate: `${sharedRotation.value}deg` }],
		};
	});

	return (
		<View>
			<View style={[styles.header, borders.light_gray]}>
				<TouchableOpacity>
					<Text size="size_16" color="primary" weight="light">
						My Addresses
					</Text>
				</TouchableOpacity>
			</View>
			<View style={[styles.chevronContainer]}>
				<TouchableOpacity
					style={[styles.chevronButton]}
					onPress={() => setShowAddresses(!showAddresses)}
				>
					<Animated.Image
						source={ChevronUp}
						style={[styles.chevron, $rotationStyle]}
					/>
				</TouchableOpacity>
			</View>
			{showAddresses && (
				<Animated.View
					entering={FadeInUp.duration(500)}
					exiting={FadeOutUp.duration(500)}
				>
					{addresses.map(address => {
						return (
							<AddressCell
								key={address.deliveryAddress.id}
								deliveryAddress={getFormattedAddress(address.deliveryAddress)}
								pickupAddress={address.pickupAddress?.full_address || ''}
							/>
						);
					})}
				</Animated.View>
			)}
		</View>
	);
};
