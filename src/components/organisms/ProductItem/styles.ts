import { StyleSheet } from 'react-native';

export const BUTTON_WIDTH = 120;

export const styles = StyleSheet.create({
	container: {
		width: '100%',
	},
	productContainer: {
		width: '100%',
		padding: 14,
		paddingLeft: 10,
		flexDirection: 'row',
		borderTopWidth: 1,
		columnGap: 20,
		zIndex: 10,
		overflow: 'hidden',
	},
	productJobContainer: {
		borderTopWidth: 0,
		borderBottomWidth: 1,
	},
	rightContainer: {
		justifyContent: 'center',
		rowGap: 10,
		flex: 1,
	},
	buttonStyle: {
		width: 132,
		padding: 0,
	},
	addToCartContainer: {
		position: 'absolute',
		height: '100%',
		justifyContent: 'center',
		alignItems: 'center',
		width: BUTTON_WIDTH,
		rowGap: 8,
	},
	leftButton: {
		left: 0,
	},
	rightButton: {
		right: 0,
	},
	swipeIcon: {
		width: 26,
		height: 11,
	},
	quantityContainer: {
		flex: 0.5,
		justifyContent: 'center',
	},
	deleteContainer: {
		position: 'absolute',
		left: -40,
		top: -40,
		height: 80,
		width: 80,
		borderRadius: 30,
		justifyContent: 'flex-end',
		alignItems: 'flex-end',
	},
	deleteIconContainer: {
		height: 40,
		width: 40,
		justifyContent: 'center',
		alignItems: 'center',
		paddingRight: 5,
		paddingBottom: 5,
	},
	deleteIcon: {
		height: 19,
		width: 13,
	},
	orderPriceStyle: {
		marginTop: 10,
	},
	orderContainer: {
		borderBottomWidth: 1,
		borderTopWidth: 0,
	},
	swipeText: {
		textAlign: 'center',
	},
	swipeContainer: {
		width: 100,
	},
});
