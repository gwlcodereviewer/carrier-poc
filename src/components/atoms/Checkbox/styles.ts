import { StyleSheet } from 'react-native';

export const BORDER_WIDTH = 2;

export const styles = StyleSheet.create({
	containerBorder: {
		borderRadius: 4,
		position: 'relative',
	},
	background: {
		...StyleSheet.absoluteFillObject,
	},
	check: {
		position: 'absolute',
	},
});
