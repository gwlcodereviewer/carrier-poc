import { Dimensions } from 'react-native';

export enum ANIMATION_STOP_POINTS {
	SPLASH = Dimensions.get('window').height,
	SIGN_IN = Dimensions.get('window').height * 0.4,
	INIT_SEARCH = Dimensions.get('window').height * 0.35,
	FIXED_HEADER = 60,
}

export const ICON_SIZE = {
	width: Dimensions.get('window').width - 180,
	height: 100,
};
export const IconSize: Record<ANIMATION_STOP_POINTS, number> = {
	[ANIMATION_STOP_POINTS.SPLASH]: 1,
	[ANIMATION_STOP_POINTS.SIGN_IN]: 0.88,
	[ANIMATION_STOP_POINTS.INIT_SEARCH]: 0.88,
	[ANIMATION_STOP_POINTS.FIXED_HEADER]: 0.5,
};

export const LOGO_HEIGHT = 100;
export const LOGO_WIDTH = 250;
