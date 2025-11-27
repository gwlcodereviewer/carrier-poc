import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
	container: {
		justifyContent: 'space-between',
		flex: 1,
	},
	contentContainer: {
		flex: 1,
	},
	partNumContainer: {
		flexDirection: 'row',
		justifyContent: 'space-between',
	},
	imageContainer: {
		width: '100%',
		alignItems: 'center',
	},
	informationContainer: {
		marginTop: 30,
		rowGap: 25,
	},
	buttonContainer: {
		width: '100%',
		rowGap: 10,
	},
});
