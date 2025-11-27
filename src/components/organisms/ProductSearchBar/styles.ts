import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
	container: {
		flexDirection: 'row',
		columnGap: 4,
		width: '100%',
	},
	textOuterContainer: {
		position: 'relative',
		flex: 1,
	},
	leftAbsPos: {
		position: 'absolute',
	},
	rightAbsPos: {
		position: 'absolute',
	},
	higherZIndex: {
		zIndex: 10,
	},
});
