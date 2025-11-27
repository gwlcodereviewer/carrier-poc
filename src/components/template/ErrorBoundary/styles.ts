import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'center',
		rowGap: 30,
	},
	logoContainer: {
		width: '100%',
		alignItems: 'center',
		justifyContent: 'center',
	},
	logo: {
		width: 250,
		height: 100,
	},
	errorText: {
		textAlign: 'center',
	},
	bgIcons: {
		position: 'absolute',
		bottom: 0,
		width: '100%',
	},
	buttonContainer: {
		paddingHorizontal: 20,
	},
});
