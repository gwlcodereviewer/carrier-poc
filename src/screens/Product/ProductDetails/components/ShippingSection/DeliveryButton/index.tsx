import React from 'react';
import { Image, TouchableOpacity, View } from 'react-native';
import CheckCircle from '@/theme/assets/images/check_circle.png';
import FactoryIcon from '@/theme/assets/images/factory_delivery.png';
import { Text } from '@/components/atoms';
import { useTheme } from '@/theme';
import { styles } from '@/screens/Product/ProductDetails/components/ShippingSection/DeliveryButton/styles';

interface Props {
	isSelected: boolean;
	onPress: () => void;
	titleLg: string;
	titleSm: string;
	subText: string;
	isFactoryDelivery?: boolean;
}

export const DeliveryButton: React.FC<Props> = ({
	isSelected,
	onPress,
	titleLg,
	titleSm,
	subText,
	isFactoryDelivery = false,
}) => {
	const { backgrounds, colors } = useTheme();
	return (
		<TouchableOpacity
			style={[isSelected && backgrounds.white, styles.container]}
			onPress={onPress}
			disabled={isFactoryDelivery}
		>
			{isFactoryDelivery ? (
				<View style={styles.imageContainer}>
					{isFactoryDelivery && (
						<Image
							source={FactoryIcon}
							tintColor={colors.light_gray}
							style={styles.factoryImage}
						/>
					)}
					<Image
						source={CheckCircle}
						tintColor={isSelected ? colors.tertiary_green : colors.light_gray}
						style={styles.imageWithFactory}
					/>
				</View>
			) : (
				<Image
					source={CheckCircle}
					tintColor={isSelected ? colors.tertiary_green : colors.light_gray}
					style={styles.image}
				/>
			)}
			<View
				style={[styles.textContainer, { flex: isFactoryDelivery ? 0.8 : 1 }]}
			>
				<Text size="size_16" color="black" weight="light">
					{titleLg}{' '}
					<Text size="size_12" color="black" weight="light">
						{titleSm}
					</Text>
				</Text>
				<Text
					size="size_12"
					color={isFactoryDelivery ? 'dark_grey' : 'book'}
					weight="light"
				>
					{subText}
				</Text>
			</View>
		</TouchableOpacity>
	);
};
