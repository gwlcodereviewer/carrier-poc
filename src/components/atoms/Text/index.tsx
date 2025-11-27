import { useTheme } from '@/theme';
import React, { useMemo } from 'react';
import { Text as RNText, TextProps as RNTextProps } from 'react-native';
import { FontSizesKeys } from '@/types/theme/fonts';
import { Theme } from '@/types/theme/theme';

export interface TextProps extends RNTextProps {
	size: FontSizesKeys;
	color:
		| 'primary'
		| 'tertiary'
		| 'book'
		| 'black'
		| 'white'
		| 'primary-light'
		| keyof Theme['fonts'];
	weight: 'bold' | 'regular' | 'light' | 'thin';
}

export const Text: React.FC<TextProps> = ({
	size,
	color,
	children,
	style,
	weight,
	...rest
}) => {
	const { fonts } = useTheme();

	const $fontColor = useMemo(() => {
		switch (color) {
			case 'primary':
				return fonts.primary_blue;
			case 'book':
				return fonts.light_gray;
			case 'tertiary':
				return fonts.tertiary_green;
			case 'black':
				return fonts.black;
			case 'white':
				return fonts.white;
			case 'primary-light':
				return fonts.primary_light_blue;
			default:
				return fonts[color];
		}
	}, [color, fonts]);

	const $fontWeight = useMemo(() => {
		switch (weight) {
			case 'bold':
				return fonts.bold;
			case 'regular':
				return fonts.regular;
			case 'light':
				return fonts.light;
			case 'thin':
				return fonts.thin;
		}
	}, [weight]);

	return (
		<RNText style={[fonts[size], $fontColor, $fontWeight, style]} {...rest}>
			{children}
		</RNText>
	);
};
