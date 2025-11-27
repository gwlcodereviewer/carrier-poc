import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
	tabContainer: {
		flexDirection: 'row',
	},
	tab: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		height: 50,
	},
	animatedBar: {
		position: 'absolute',
		height: 5,
		bottom: 2,
	},
});
