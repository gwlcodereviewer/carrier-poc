import { StyleSheet } from 'react-native';

export const PROGRESS_BAR_HEIGHT = 5;
export const styles = StyleSheet.create({
	container: {
		position: 'absolute',
		bottom: 0,
		width: '100%',
		backgroundColor: 'rgba(255, 255, 255, 0.3)',
		height: PROGRESS_BAR_HEIGHT,
	},
	progressBarHeight: {
		height: '100%',
		width: 1,
	},
});
