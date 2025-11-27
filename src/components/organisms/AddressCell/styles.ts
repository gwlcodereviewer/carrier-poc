import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
	container: {
		paddingTop: 10,
		borderBottomWidth: 0.5,
	},
	row: {
		flexDirection: 'row',
		paddingHorizontal: 12,
	},
	cell: {
		flex: 1,
		flexDirection: 'row',
		columnGap: 6,
		alignItems: 'center',
	},
	itemPaddings: {
		paddingVertical: 5,
		paddingRight: 6,
	},
	truck: {
		height: 22,
		width: 35,
	},
	pickup: {
		width: 28,
		height: 28,
	},
	deliveryInfo: {
		marginTop: 10,
		paddingVertical: 10,
	},
});
