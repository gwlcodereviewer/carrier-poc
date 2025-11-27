import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
	container: {
		flexDirection: 'row',
		paddingHorizontal: 15,
		paddingVertical: 20,
	},
	rightColumn: {
		flex: 1,
	},
	leftColumn: {
		flex: 1,
		rowGap: 15,
		justifyContent: 'space-between',
	},
});
