import { StyleSheet } from 'react-native';

export const CHECKOUT_OVERLAY_HEIGHT = 150;
export const styles = StyleSheet.create({
	container: {
		height: CHECKOUT_OVERLAY_HEIGHT,
		position: 'absolute',
		bottom: 0,
		width: '100%',
		justifyContent: 'center',
		alignItems: 'center',
		rowGap: 10,
	},
	swipeableContainer: {
		borderRadius: 54,
	},
	button: {
		width: 250,
		flexDirection: 'row',
		columnGap: 8,
	},
	swipeIcon: {
		width: 26,
		height: 11,
	},
});
