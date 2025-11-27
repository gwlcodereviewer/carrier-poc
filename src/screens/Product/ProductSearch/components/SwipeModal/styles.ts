import { StyleSheet } from 'react-native';

export const IMAGE_WIDTH = 120;
export const IMAGE_HEIGHT = 135;

export const styles = StyleSheet.create({
	container: {
		...StyleSheet.absoluteFillObject,
		zIndex: 100,
		justifyContent: 'center',
	},
	opacityBackground: {
		...StyleSheet.absoluteFillObject,
		opacity: 0.9,
	},
	imageContainer: {
		paddingHorizontal: 30,
	},
	image: {
		width: IMAGE_WIDTH,
		height: IMAGE_HEIGHT,
	},
	title: {
		paddingTop: 30,
		textAlign: 'center',
	},
	description: {
		paddingTop: 10,
		paddingHorizontal: 40,
		textAlign: 'center',
		lineHeight: 27,
	},
	productContainer: {
		paddingTop: 60,
	},
	gradient: {
		position: 'absolute',
		top: 0,
		left: 0,
		right: 0,
		bottom: 0,
	},
});
