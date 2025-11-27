import { StyleSheet } from 'react-native';

export const BALANCE_OVERLAY_HEIGHT = 150;
export const styles = StyleSheet.create({
	container: {
		position: 'absolute',
		bottom: 0,
		height: BALANCE_OVERLAY_HEIGHT,
		width: '100%',
	},
	balanceRow: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		paddingHorizontal: 12,
		paddingVertical: 10,
		borderBottomWidth: 0.2,
		borderTopWidth: 0.2,
	},
	paymentMethodContainer: {
		paddingHorizontal: 12,
		flex: 1,
		justifyContent: 'center',
	},
	paymentText: {
		textAlign: 'center',
		marginBottom: 10,
	},
	buttonContainer: {
		flexDirection: 'row',
		columnGap: 8,
	},
	button: {
		flex: 1,
	},
});
