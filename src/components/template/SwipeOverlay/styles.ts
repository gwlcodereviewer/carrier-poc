import { StyleSheet } from 'react-native';

export const IMAGE_SIZE = 150;

export const styles = StyleSheet.create({
	container: {
		...StyleSheet.absoluteFillObject,
		zIndex: 100,
		justifyContent: 'center',
	},
	opacityBackground: {
		...StyleSheet.absoluteFillObject,
		opacity: 0.5,
	},
	imageContainer: {
		position: 'absolute',
		right: 0,
		alignItems: 'center',
		paddingTop: 50,
	},
	image: {
		width: IMAGE_SIZE,
		height: IMAGE_SIZE,
	},
});
