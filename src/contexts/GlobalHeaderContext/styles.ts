import { StyleSheet } from 'react-native';
import { LOGO_HEIGHT } from '@/contexts';

export const BUTTON_WIDTH = 40;
export const styles = StyleSheet.create({
	container: {
		justifyContent: 'flex-end',
		alignItems: 'center',
		width: '100%',
	},
	bottomLayerContainer: {
		height: LOGO_HEIGHT,
		width: '100%',
	},
	logo: {
		position: 'absolute',
	},
	buildingBg: {
		position: 'absolute',
		height: '100%',
		width: '100%',
	},
	buttonContainer: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		flex: 1,
		width: '100%',
	},
	leftButtonContainer: {
		width: BUTTON_WIDTH,
		height: '100%',
		paddingLeft: 12,
		alignItems: 'center',
	},
	leftButtonImage: {
		height: 17,
		width: 9,
	},
	bgIconsContainer: {
		position: 'absolute',
		bottom: 0,
		left: 0,
		flex: 1,
	},
});
