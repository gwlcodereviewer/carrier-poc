import React, { FunctionComponent, useMemo, useState } from 'react';
import {
	View,
	TouchableOpacity,
	ViewStyle,
	ImageProps,
	Image,
	TouchableOpacityProps,
} from 'react-native';
import { useTheme } from '@/theme';
import { Text, TextProps } from '@/components/atoms/Text';
import { Colors } from '@/types/theme/colors';
import { Theme } from '@/types/theme/theme';
import Animated, {
	useAnimatedStyle,
	useSharedValue,
} from 'react-native-reanimated';
import styles from './styles';

type ButtonProps = {
	title?: string;
	size?: 'small' | 'medium' | 'large';
	onPress: () => void;
	containerStyle?: ViewStyle;
	textStyle?: ViewStyle;
	textColor?: TextProps['color'];
	backgroundColor?: keyof Theme['backgrounds'];
	iconSource?: ImageProps['source'];
	iconSize?: number;
	iconColor?: keyof Theme['colors'];
	children?: React.ReactNode;
	touchableConfig?: Omit<TouchableOpacityProps, 'style' | 'onPress'>;
	isDisabled?: boolean;
	disabledStyle?: ViewStyle;
};

export const Button: FunctionComponent<ButtonProps> = ({
	title,
	size = 'large',
	onPress,
	containerStyle,
	textStyle,
	textColor = 'white',
	backgroundColor = 'primary_blue',
	iconSize = 30,
	iconSource,
	iconColor = 'white',
	children,
	touchableConfig = {},
	isDisabled = false,
	disabledStyle,
}) => {
	const { backgrounds, colors } = useTheme();

	const $containerSize = useMemo<ViewStyle>(() => {
		switch (size) {
			case 'large':
				return { height: 50, borderRadius: 25 };
			case 'medium':
				return { height: 38, borderRadius: 19 };
			case 'small':
				return { height: 36, borderRadius: 18 };
		}
	}, [size]);

	const buttonStateStyle = useMemo<ViewStyle>(() => {
		if (isDisabled) {
			if (disabledStyle !== undefined) return disabledStyle;
			return {
				opacity: 0.2,
			};
		}

		return {};
	}, [isDisabled, disabledStyle]);

	return (
		<TouchableOpacity
			onPress={() => onPress()}
			style={[
				styles.buttonStyles,
				backgrounds[backgroundColor],
				$containerSize,
				containerStyle,
				buttonStateStyle,
			]}
			{...touchableConfig}
			disabled={isDisabled}
		>
			{iconSource && (
				<Image
					source={iconSource}
					style={{ width: iconSize, height: iconSize }}
					tintColor={colors[iconColor]}
				/>
			)}
			{title && (
				<Text
					size="size_16"
					color={textColor}
					style={textStyle}
					weight="regular"
				>
					{title}
				</Text>
			)}
			{children}
		</TouchableOpacity>
	);
};

export default Button;
