import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
	wrapper: {
		width: '100%',
	},
	mainContainer: {
		width: '100%',
		borderWidth: 1,
		borderRadius: 50,
		height: 48,
		flexDirection: 'row',
		alignItems: 'center',
		paddingHorizontal: 10,
	},
	inputWrapper: {
		position: 'relative',
		flex: 1,
		justifyContent: 'center',
	},
	placeholder: {
		position: 'absolute',
		textAlign: 'center',
		paddingLeft: 10,
	},
	input: {
		color: 'black',
		flex: 1,
		paddingLeft: 10,
		fontWeight: '400',
		zIndex: 1,
	},
	message: {
		paddingHorizontal: 20,
	},
});

export default styles;
