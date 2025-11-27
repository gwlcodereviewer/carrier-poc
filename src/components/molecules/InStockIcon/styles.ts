import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
	container: {
		borderWidth: 1,
		borderRadius: 100,
		paddingHorizontal: 8,
		paddingVertical: 5,
		flexDirection: 'row',
		columnGap: 6,
		alignItems: 'center',
		alignSelf: 'flex-start',
		marginTop: 5,
	},
	image: {
		height: 18,
		width: 18,
		resizeMode: 'contain',
	},
	text: {
		textTransform: 'uppercase',
	},
});
