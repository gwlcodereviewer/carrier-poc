import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
	container: {
		padding: 24,
		rowGap: 20,
	},
	shippingMethod: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		columnGap: 10,
	},
	bottomSection: {
		flexDirection: 'row',
	},
	fromText: {
		width: '30%',
	},
	fromAddress: {
		width: '70%',
		rowGap: 8,
	},
	fromAddressText: {
		width: '80%',
	},
	factoryShipping: {
		flexDirection: 'row',
		width: '80%',
		alignSelf: 'center',
	},
});
