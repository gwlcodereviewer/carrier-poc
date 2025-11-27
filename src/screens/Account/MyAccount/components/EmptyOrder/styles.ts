import { Dimensions, StyleSheet } from 'react-native';

const windowHeight = Dimensions.get('window').height;
export const styles = StyleSheet.create({
	container: {
		flexGrow: 1,
		alignItems: 'center',
		marginTop: windowHeight * 0.15
	},
	box: {
		width: 183,
		height: 183,
	},
	titleText: {
		textAlign: 'center',
		paddingTop: 20,
	},
	textPadding: {
		paddingHorizontal: 60,
	},
});
