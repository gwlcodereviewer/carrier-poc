import React, {
	forwardRef,
	FunctionComponent,
	RefObject,
	useCallback,
	useEffect,
	useMemo,
	useRef,
	useState,
} from 'react';
import {
	TextInput as RNTextInput,
	View,
	Text,
	ViewStyle,
	TextInputProps as RNTextInputProps,
	Pressable,
	ImageProps,
	TextStyle,
	Image,
	NativeSyntheticEvent,
	TextInputFocusEventData,
	ActivityIndicator,
} from 'react-native';
import { useTheme } from '@/theme';
import XMark from '@/theme/assets/images/x_mark.png';
import Animated, {
	Easing,
	runOnJS,
	useAnimatedReaction,
	useAnimatedStyle,
	useSharedValue,
	withTiming,
} from 'react-native-reanimated';
import { Colors } from '@/types/theme/colors';
import styles from './styles';

export interface TextInputProps extends RNTextInputProps {
	variant?: 'default' | 'search';
	containerStyle?: ViewStyle;
	placeholderStyle?: TextStyle;
	textWrapperStyle?: ViewStyle;
	disabled?: boolean;
	resetMode?: 'auto' | 'never' | 'always';
	leftIcon?: ImageProps['source'];
	leftIconSize?: number;
	leftIconColor?: ImageProps['tintColor'];
	rightIcon?: ImageProps['source'];
	rightIconSize?: number;
	rightIconColor?: ImageProps['tintColor'];
	isUseRightIconColor?: boolean;
	error?: boolean | string;
	success?: boolean | string;
	onRightIconPress?: () => void;
	isLoading?: boolean;
}

export const TextInput = forwardRef<RNTextInput, TextInputProps>(
	(
		{
			variant = 'default',
			value,
			onChangeText,
			placeholder,
			placeholderStyle,
			textWrapperStyle,
			containerStyle,
			disabled = false,
			error,
			success,
			selectionColor,
			resetMode = 'auto',
			leftIcon,
			leftIconSize = 24,
			leftIconColor,
			rightIcon,
			rightIconSize = 24,
			rightIconColor,
			isUseRightIconColor,
			onRightIconPress,
			onFocus: propOnFocus,
			onBlur: propOnBlur,
			isLoading,
			...props
		},
		ref,
	) => {
		const { borders, fonts, colors, layout, backgrounds } = useTheme();

		const isEmpty = useMemo(() => !value, [value]);

		const [inputState, setInputState] = useState<
			'disabled' | 'focused' | 'error' | 'success' | null
		>(null);

		const inputStateStyle: ViewStyle = useMemo(() => {
			switch (inputState) {
				case 'disabled':
					return {
						opacity: 0.5,
					};
				case 'focused':
					return {
						borderWidth: 1,
						borderColor: colors.tint_blue,
					};
				case 'error':
					return {
						borderWidth: 1,
						borderColor: colors.dark_red,
					};
				case 'success':
					return {
						borderWidth: 1,
						borderColor: colors.light_green,
					};
				default:
					return {};
			}
		}, [inputState]);

		const inputMessageStyle: TextStyle = useMemo(() => {
			if (typeof error === 'string' && error.length > 0) {
				return { color: colors.dark_red };
			}

			if (typeof success === 'string' && success.length > 0) {
				return { color: colors.light_green };
			}

			return {};
		}, [error, success]);

		useEffect(() => {
			if (variant === 'search') {
				setInputState(null);
				return;
			}

			if (disabled) {
				setInputState('disabled');
				return;
			}

			if (error) {
				setInputState('error');
				return;
			}

			if (success) {
				setInputState('success');
				return;
			}

			setInputState(null);
		}, [variant, disabled, error, success]);

		const onFocus = (e: NativeSyntheticEvent<TextInputFocusEventData>) => {
			if (propOnFocus != null) {
				propOnFocus(e);
			}

			if (variant === 'default') {
				setInputState('focused');
			}
		};

		const onBlur = (e: NativeSyntheticEvent<TextInputFocusEventData>) => {
			if (propOnBlur != null) {
				propOnBlur(e);
			}

			if (variant === 'default') {
				if (error) {
					setInputState('error');
					return;
				}

				if (success) {
					setInputState('success');
					return;
				}

				setInputState(null);
			}
		};

		const [shouldHideRightIcon, setShouldHideRightIcon] =
			useState<boolean>(true);

		// styles
		const [$border, $textColor, tintColor] = useMemo<
			[ViewStyle | undefined, TextStyle, ImageProps['tintColor']]
		>(() => {
			switch (variant) {
				case 'search':
					return [
						borders.tertiary_green,
						fonts.primary_blue,
						colors.primary_blue,
					];
				default:
					return [borders.light_grey_15, fonts.black, colors.tertiary_green];
			}
		}, [variant]);

		const placeholderOpacity = useMemo<TextStyle>(() => {
			if (value == null || value.length === 0) {
				return { opacity: 1 };
			}

			return { opacity: 0 };
		}, [value]);

		// TODO: implement icons
		const renderLeftIcon = useCallback(() => {
			if (!leftIcon) return null;
			return (
				<Image
					source={leftIcon}
					style={{ height: leftIconSize, width: leftIconSize }}
					tintColor={leftIconColor}
				/>
			);
		}, [leftIcon, leftIconSize, leftIconColor]);

		const renderRightIcon = useCallback(() => {
			if (!rightIcon || shouldHideRightIcon) return null;
			return (
				<Pressable
					onPress={() => {
						onRightIconPress && onRightIconPress();
					}}
				>
					<Animated.Image
						source={rightIcon}
						style={[
							{
								height: rightIconSize,
								width: rightIconSize,
								resizeMode: 'contain',
							},
							$animatedOpacity,
						]}
						tintColor={isUseRightIconColor ? rightIconColor : tintColor}
					/>
				</Pressable>
			);
		}, [
			rightIcon,
			rightIconSize,
			rightIconColor,
			onRightIconPress,
			shouldHideRightIcon,
		]);
		// animations
		const animatedOpacity = useSharedValue(0);

		const $animatedOpacity = useAnimatedStyle(() => ({
			opacity: animatedOpacity.value,
		}));

		useAnimatedReaction(
			() => {
				return animatedOpacity.value === 0;
			},
			(cur, prev) => {
				if (cur !== prev) {
					runOnJS(setShouldHideRightIcon)(cur);
				}
			},
		);

		useEffect(() => {
			let opacity = 0;
			switch (resetMode) {
				case 'auto':
					opacity = isEmpty ? 0 : 1;
					break;
				case 'never':
					opacity = 0;
					break;
				case 'always':
					opacity = 1;
					break;
			}
			animatedOpacity.value = withTiming(opacity, {
				duration: 300,
				easing: Easing.inOut(Easing.quad),
			});
		}, [isEmpty, resetMode]);

		return (
			<View style={styles.wrapper}>
				<View
					style={[
						styles.mainContainer,
						$border,
						layout.justifyCenter,
						backgrounds.light_grey_15,
						containerStyle,
						inputStateStyle,
					]}
				>
					{renderLeftIcon()}
					<Animated.View style={[styles.inputWrapper, textWrapperStyle]}>
						{placeholder != null ? (
							<Animated.Text
								style={[
									fonts.size_16,
									fonts.light,
									styles.placeholder,
									placeholderOpacity,
									{ color: props.placeholderTextColor ?? colors.light_grey },
									placeholderStyle,
								]}
							>
								{placeholder}
							</Animated.Text>
						) : null}
						<RNTextInput
							ref={ref}
							{...props}
							value={value}
							onChangeText={onChangeText}
							onFocus={onFocus}
							onBlur={onBlur}
							style={[
								styles.input,
								$textColor,
								fonts.size_16,
								props.style,
								fonts.light,
							]}
							editable={!disabled}
							selectTextOnFocus={!disabled}
							selectionColor={colors.light_gray}
						/>
					</Animated.View>
					{isLoading ? <ActivityIndicator /> : renderRightIcon()}
				</View>
				{(typeof error === 'string' && error.length > 0) ||
				(typeof success === 'string' && success.length > 0) ? (
					<Text style={[styles.message, inputMessageStyle]}>
						{error ?? success}
					</Text>
				) : null}
			</View>
		);
	},
);
