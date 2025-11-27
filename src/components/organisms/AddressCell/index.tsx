import { FC } from 'react';
import { Image, View } from 'react-native';
import { Text } from '@/components/atoms';
import { useTheme } from '@/theme';
import { styles } from '@/components/organisms/AddressCell/styles';
import Pickup from '@/theme/assets/images/pickup.png';
import Truck from '@/theme/assets/images/truck.png';

interface Props {
	deliveryAddress: string;
	pickupAddress: string;
}

export const AddressCell: FC<Props> = ({ deliveryAddress, pickupAddress }) => {
	const { backgrounds, borders } = useTheme();
	return (
		<View style={[styles.container, backgrounds.white, borders.light_gray]}>
			<View style={styles.row}>
				<View style={[styles.cell]}>
					<Image source={Truck} style={styles.truck} />
					<Text size="size_16" color="tertiary" weight="light">
						Deliver to
					</Text>
				</View>
				<View style={[styles.cell]}>
					<Image source={Pickup} style={styles.pickup} />
					<Text size="size_16" color="tertiary" weight="light">
						Pickup from
					</Text>
				</View>
			</View>
			<View
				style={[styles.row, styles.deliveryInfo, backgrounds.light_grey_15]}
			>
				<View style={[styles.cell, styles.itemPaddings]}>
					<Text size="size_16" color="dark_grey" weight="light">
						{deliveryAddress}
					</Text>
				</View>
				<View style={[styles.cell, styles.itemPaddings]}>
					<Text size="size_16" color="dark_grey" weight="light">
						{pickupAddress}
					</Text>
				</View>
			</View>
		</View>
	);
};
