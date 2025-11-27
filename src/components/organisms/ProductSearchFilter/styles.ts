import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
	container: {
		flexDirection: 'row',
		width: '100%',
		justifyContent: 'space-between',
		paddingTop: 20,
		paddingBottom: 10,
	},
	rightContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		columnGap: 4,
	},
	chevronIcon: {
		width: 12,
	},
});
