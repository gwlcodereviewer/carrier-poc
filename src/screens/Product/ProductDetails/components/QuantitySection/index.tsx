import { FC, useContext, useState } from 'react';
import { View } from 'react-native';
import { Text } from '@/components/atoms';
import { styles } from '@/screens/Product/ProductDetails/components/QuantitySection/styles';
import { QuantitySelector } from '@/components/organisms';
import { ProductInfoContext } from '@/screens/Product/ProductDetails/context';
import { common } from '@/translations/en';

interface Props {
	title: string;
	sku: string;
	price: string;
	availableQuantity: number;
}

export const QuantitySection: FC<Props> = ({
	title,
	sku,
	price,
	availableQuantity,
}) => {
	const { quantity, updateQuantity, lineItem } = useContext(ProductInfoContext);

	const increaseQuantity = () => {
		updateQuantity(quantity + 1);
		// TODO: Uncomment this when we get available items
	};

	const decreaseQuantity = () => {
		if (quantity > 1) {
			updateQuantity(quantity - 1);
		}
	};

	return (
		<View style={styles.container}>
			<Text size="size_24" color="black" weight="light">
				{title}
			</Text>
			<Text size="size_20" color="black" weight="thin">
				{sku}
			</Text>
			<View style={styles.quantityRow}>
				<Text size="size_22" color="tertiary" weight="regular">
					$
					<Text size="size_22" color="tertiary" weight="bold">
						{price}
					</Text>
				</Text>
				<QuantitySelector
					quantity={quantity}
					increaseQuantity={increaseQuantity}
					decreaseQuantity={decreaseQuantity}
					disabled={!!lineItem}
				/>
			</View>
		</View>
	);
};
