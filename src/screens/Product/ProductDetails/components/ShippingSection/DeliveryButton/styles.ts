import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
	container: {
		flexDirection: 'row',
		flex: 1,
		justifyContent: 'center',
		padding: 12,
		borderRadius: 12,
		columnGap: 6,
	},
	image: {
		height: 18,
		width: 18,
	},
	textContainer: {
		rowGap: 8,
	},
	factoryImage: {
		height: 48,
		width: 48,
	},
	imageWithFactory: {
		position: 'absolute',
		height: 18,
		width: 18,
		right: 5,
		top: 0,
	},
	imageContainer: {
		flex: 0.2,
		flexDirection: 'row',
		alignItems: 'flex-end',
	},
	textFlex: {
		flex: 0.8,
	},
});
