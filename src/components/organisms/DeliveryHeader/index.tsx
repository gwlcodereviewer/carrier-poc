import { Image, View } from 'react-native';
import { Text } from '@/components/atoms';
import { FC } from 'react';
import Calendar from '@/theme/assets/images/calendar.png';
import Truck from '@/theme/assets/images/truck.png';
import Pickup from '@/theme/assets/images/pickup.png';
import { styles } from '@/components/organisms/DeliveryHeader/styles';
import { useTheme } from '@/theme';

interface Props {
	deliveryMethod: 'shipto' | 'pickup' | '';
	address: string;
	deliveryDate?: string;
}

const getDeliveryMethod = (deliveryMethod: string) => {
	switch (deliveryMethod) {
		case 'shipto':
			return 'Deliver to';
		case 'pickup':
			return 'Pickup from';
		default:
			return '';
	}
};
export const DeliveryHeader: FC<Props> = ({
	deliveryMethod,
	address,
	deliveryDate,
}) => {
	const { backgrounds, borders } = useTheme();
	return (
		<View style={[styles.container, backgrounds.white, borders.light_gray]}>
			<View style={styles.row}>
				<View style={[styles.cell]}>
					<Image
						source={deliveryMethod === 'pickup' ? Pickup : Truck}
						style={styles.truck}
					/>
					<Text size="size_16" color="tertiary" weight="light">
						{getDeliveryMethod(deliveryMethod)}
					</Text>
				</View>
				{deliveryDate && (
					<View style={[styles.cell]}>
						<Image source={Calendar} style={styles.calendar} />
						<Text size="size_16" color="tertiary" weight="light">
							Est. {deliveryMethod === 'shipto' ? 'Delivery' : 'Pickup'} Date
						</Text>
					</View>
				)}
			</View>
			<View
				style={[styles.row, styles.deliveryInfo, backgrounds.light_grey_15]}
			>
				<View style={[styles.cell]}>
					<Text size="size_16" color="dark_grey" weight="light">
						{address}
					</Text>
				</View>
				{deliveryDate && (
					<View style={[styles.cell, styles.dateCell]}>
						<Text size="size_16" color="dark_grey" weight="light">
							{deliveryDate}
						</Text>
					</View>
				)}
			</View>
		</View>
	);
};
