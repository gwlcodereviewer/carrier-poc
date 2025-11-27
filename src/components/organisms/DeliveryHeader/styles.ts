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
	truck: {
		height: 22,
		width: 35,
	},
	calendar: {
		width: 28,
		height: 28,
	},
	deliveryInfo: {
		marginTop: 10,
		paddingVertical: 15,
	},
	dateCell: {
		justifyContent: 'flex-end',
	},
});
