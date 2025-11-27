import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
	formFields: {
		alignItems: 'center',
		paddingTop: 30,
		paddingHorizontal: 12,
		rowGap: 20,
	},
	forgotPassword: {
		padding: 4,
	},
	footer: {
		alignItems: 'center',
		paddingTop: 30,
		rowGap: 30,
	},
	loginButton: {
		width: 250,
	},
	signUpContainer: {
		flexDirection: 'row',
		columnGap: 4,
	},
	errorContainer: {
		height: 15,
		justifyContent: 'center',
	},
});

export default styles;
