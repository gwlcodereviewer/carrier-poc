import { FC } from 'react';
import { View } from 'react-native';
import { styles } from '@/components/organisms/OrderInfo/styles';
import { useTheme } from '@/theme';
import { Text } from '@/components/atoms';

interface Props {
	orderNumber: string | number;
	totalAmount: number | string;
	completionDate?: string;
	billTo: string;
}

export const OrderInfo: FC<Props> = ({
	orderNumber,
	totalAmount,
	billTo,
	completionDate,
}) => {
	const { backgrounds } = useTheme();
	return (
		<View style={[styles.container, backgrounds.tint_blue]}>
			<View style={styles.leftColumn}>
				<View>
					<Text size="size_12" weight="light" color="light_gray">
						Order
					</Text>
					<Text size="size_16" weight="light" color="dark_grey">
						{orderNumber}
					</Text>
				</View>
				<View>
					<Text size="size_12" weight="light" color="light_gray">
						Total Amount
					</Text>
					<Text size="size_16" weight="bold" color="tertiary_green">
						$ {totalAmount}
					</Text>
				</View>
				{completionDate && (
					<View>
						<Text size="size_12" weight="light" color="light_gray">
							Completion Date
						</Text>
						<Text size="size_16" weight="light" color="dark_grey">
							{completionDate}
						</Text>
					</View>
				)}
			</View>
			<View style={styles.rightColumn}>
				<Text size="size_12" weight="light" color="light_gray">
					Bill To Info
				</Text>
				<Text size="size_16" weight="light" color="dark_grey">
					{billTo}
				</Text>
			</View>
		</View>
	);
};
