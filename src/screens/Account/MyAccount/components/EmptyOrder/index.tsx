import { Text } from '@/components/atoms';
import EmptyBox from '@/theme/assets/images/empty_box.png';
import { FC } from 'react';
import { Image, View } from 'react-native';
import { styles } from '@/screens/Account/MyAccount/components/EmptyOrder/styles';

interface Props {
	isOrderHistory?: boolean;
}

/**
 * Name: EmptyOrder
 * Desc: Functional component to render the UI of empty order
 * @returns JSX element
 */
export const EmptyOrder: FC<Props> = ({ isOrderHistory }) => {
	return (
		<View style={styles.container}>
			<Image source={EmptyBox} style={styles.box} />
			<Text
				size="size_32"
				color="tertiary"
				weight="light"
				style={[styles.titleText, styles.textPadding]}
			>
				{isOrderHistory ? 'No order history' : 'No orders to track'}
			</Text>
			<Text
				size="size_22"
				color="dark_grey"
				weight="light"
				style={styles.titleText}
			>
				Let's start adding items!
			</Text>
		</View>
	);
};

EmptyOrder.defaultProps = {
	isOrderHistory: false,
};
