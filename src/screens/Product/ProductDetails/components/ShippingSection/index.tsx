import { FC, useContext, useState } from 'react';
import { View } from 'react-native';
import { useTheme } from '@/theme';
import CheckCircle from '@/theme/assets/images/check_circle.png';
import { DeliveryButton } from '@/screens/Product/ProductDetails/components/ShippingSection/DeliveryButton';
import { styles } from '@/screens/Product/ProductDetails/components/ShippingSection/styles';
import { Text } from '@/components/atoms';
import { InStockIcon } from '@/components/molecules';
import { ProductInfoContext } from '@/screens/Product/ProductDetails/context';

interface Props {}

export const ShippingSection: FC<Props> = ({}) => {
	const { backgrounds } = useTheme();
	const {
		selectedDistributionCenter,
		inventoryStatus,
		deliveryMethod,
		updateDeliveryMethod,
	} = useContext(ProductInfoContext);

	return (
		<View style={[backgrounds.light_grey_15, styles.container]}>
			{inventoryStatus && inventoryStatus.has_inventory ? (
				<View style={styles.shippingMethod}>
					<DeliveryButton
						isSelected={deliveryMethod === 'shipto'}
						onPress={() => updateDeliveryMethod('shipto')}
						titleLg="Ship to"
						titleSm="My Address"
						subText="Tax are calculated at checkout"
					/>
					<DeliveryButton
						isSelected={deliveryMethod === 'pickup'}
						onPress={() => updateDeliveryMethod('pickup')}
						titleLg="Pickup"
						titleSm="Available"
						subText="Check distributor details in checkout"
					/>
				</View>
			) : (
				<View style={styles.factoryShipping}>
					<DeliveryButton
						isSelected={deliveryMethod === 'shipto'}
						onPress={() => updateDeliveryMethod('shipto')}
						titleLg="Factory"
						titleSm="Delivery"
						subText="Arranging factory delivery to fulfill the order."
						isFactoryDelivery
					/>
				</View>
			)}
			<View style={styles.bottomSection}>
				<Text
					size="size_14"
					color="book"
					weight="light"
					style={styles.fromText}
				>
					From
				</Text>
				<View style={styles.fromAddress}>
					<Text
						size="size_16"
						color="black"
						weight="light"
						style={styles.fromAddressText}
					>
						{selectedDistributionCenter?.full_address}
					</Text>
					{inventoryStatus && (
						<InStockIcon inStock={inventoryStatus.has_inventory} />
					)}
					{inventoryStatus && !inventoryStatus.has_inventory && (
						<Text
							size="size_12"
							color="dark_grey"
							weight="light"
							style={styles.fromAddressText}
						>
							Product currently is out of stock at the selected location.
						</Text>
					)}
				</View>
			</View>
		</View>
	);
};
