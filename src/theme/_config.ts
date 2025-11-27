import { DarkTheme } from '@react-navigation/native';

import type { ThemeConfiguration } from '@/types/theme/config';

const colorsLight = {
	white: '#FFFFFF',
	light_gray: '#BAC0D0',
	primary_blue: '#152C73',
	tertiary_green: '#61B549',
	primary_light_blue: '#1891F6',
	tint_light_grey: '#EAECF1',
	tint_blue: 'rgba(220, 239, 254, 38)',
	dark_grey: '#617080',
	light_grey_15: '#F5F6F8',
	black: '#000000',
	error: '#FF5500',
	light_yellow: '#F6D009',
	light_green: '#008043',
	dark_red: '#EA0029',
	light_grey: '#D6D9E3',
	transparent: 'transparent',
} as const;

const colorsDark = {
	white: '#FFFFFF',
	light_gray: '#BAC0D0',
	primary_blue: '#152C73',
	tertiary_green: '#61B549',
	primary_light_blue: '#1891F6',
	tint_light_grey: '#EAECF1',
	tint_blue: 'rgba(220, 239, 254, 38)',
	dark_grey: '#617080',
	light_grey_15: '#F5F6F8',
	black: '#000000',
	error: '#FF5500',
	light_yellow: '#F6D009',
	light_green: '#008043',
	dark_red: '#EA0029',
	light_grey: '#D6D9E3',
	transparent: 'transparent',
} as const;

const sizes = [12, 14, 16, 20, 22, 24, 32, 40, 80] as const;

export const config = {
	fonts: {
		sizes,
		colors: colorsLight,
	},
	gutters: sizes,
	backgrounds: colorsLight,
	borders: {
		widths: [],
		radius: [],
		colors: colorsLight,
	},
	navigationColors: {
		...DarkTheme.colors,
		background: colorsLight.white,
	},
	variants: {
		dark: {
			fonts: {
				colors: colorsDark,
			},
			backgrounds: colorsDark,
			navigationColors: {
				...DarkTheme.colors,
				background: colorsDark.white,
			},
		},
	},
} as const satisfies ThemeConfiguration;
