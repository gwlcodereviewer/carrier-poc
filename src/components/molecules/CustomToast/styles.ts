import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
	container: {
		position: 'absolute',
		bottom: 0,
		left: 0,
		right: 0,
		padding: 12,
		alignItems: 'center',
		justifyContent: 'center',
		zIndex: 999,
		elevation: 5,
	},
	message: {
		textAlign: 'center',
	},
	visible: {
		display: 'flex',
	},
	hidden: {
		display: 'none',
	},
});
