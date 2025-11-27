import { TextInput } from '@/components/atoms';
import React, { useEffect, useRef, useState } from 'react';
import {
	View,
	ViewStyle,
	TextInput as RNTextInput,
	TextStyle,
} from 'react-native';
import Animated, {
	Easing,
	WithTimingConfig,
	interpolate,
	interpolateColor,
	runOnJS,
	useAnimatedReaction,
	useAnimatedStyle,
	useSharedValue,
	withTiming,
} from 'react-native-reanimated';
import { useTheme } from '@/theme';
import XMark from '@/theme/assets/images/x_mark.png';
import Part from '@/theme/assets/images/part.png';
import Model from '@/theme/assets/images/model.png';
import { styles } from './styles';

interface Props {
	onPartQuerySubmit: (query: string) => void;
	onModelQuerySubmit: (query: string) => void;
	onPartQueryClear: () => void;
	onModelQueryClear: () => void;
	isLoading: boolean;
}

const animationConfig: WithTimingConfig = {
	duration: 500,
	easing: Easing.inOut(Easing.quad),
};

export const ProductSearchBar: React.FC<Props> = ({
	onPartQuerySubmit,
	onModelQuerySubmit,
	onPartQueryClear,
	onModelQueryClear,
	isLoading,
}) => {
	const partSearchRef = useRef<RNTextInput>(null);
	const modelSearchRef = useRef<RNTextInput>(null);

	const [modelQuery, setModelQuery] = useState('');
	const [partQuery, setPartQuery] = useState('');

	const [containerWidth, setContainerWidth] = React.useState(1);
	const [initTextWidth, setInitTextWidth] = React.useState(1);
	const isWidthInitialized = useRef<boolean>(false);

	const [focusedInput, setFocusedInput] = useState<'left' | 'right' | ''>('');
	const [animationFocusedInput, setAnimationFocusedInput] = useState<
		'left' | 'right' | ''
	>('');

	const leftAnimatedWidth = useSharedValue(1);
	const rightAnimatedWidth = useSharedValue(1);
	const { colors } = useTheme();

	useEffect(() => {
		if (
			!isWidthInitialized.current &&
			initTextWidth !== 1 &&
			containerWidth !== 1
		) {
			isWidthInitialized.current = true;
			leftAnimatedWidth.value = initTextWidth;
			rightAnimatedWidth.value = initTextWidth;
		}
	}, [initTextWidth, containerWidth]);

	const $leftPlaceholderStyle = useAnimatedStyle<TextStyle>(() => {
		const color = interpolateColor(
			leftAnimatedWidth.value,
			[initTextWidth, containerWidth],
			[colors.primary_blue, colors.light_gray],
		);

		return { color };
	});

	const $rightPlaceholderStyle = useAnimatedStyle<TextStyle>(() => {
		const color = interpolateColor(
			rightAnimatedWidth.value,
			[initTextWidth, containerWidth],
			[colors.primary_blue, colors.light_gray],
		);

		return { color };
	});

	const $leftAnimatedWidth = useAnimatedStyle<ViewStyle>(() => ({
		width: leftAnimatedWidth.value,
		left: leftAnimatedWidth.value > initTextWidth ? 0 : undefined,
		position: leftAnimatedWidth.value > initTextWidth ? 'absolute' : 'relative',
	}));

	const $rightAnimatedWidth = useAnimatedStyle<ViewStyle>(() => ({
		width: rightAnimatedWidth.value,
		right: rightAnimatedWidth.value > initTextWidth ? 0 : undefined,
		position:
			rightAnimatedWidth.value > initTextWidth ? 'absolute' : 'relative',
	}));

	const $leftTextWrapperStyle = useAnimatedStyle<ViewStyle>(() => {
		const flex = interpolate(
			leftAnimatedWidth.value,
			[initTextWidth, containerWidth / 2],
			[0, 1],
		);

		return { flex, minWidth: 100 };
	});

	const $rightTextWrapperStyle = useAnimatedStyle<ViewStyle>(() => {
		const flex = interpolate(
			rightAnimatedWidth.value,
			[initTextWidth, containerWidth / 2],
			[0, 1],
		);

		return { flex, minWidth: 75 };
	});

	useAnimatedReaction(
		() => {
			if (leftAnimatedWidth.value > rightAnimatedWidth.value) {
				return 'left';
			}
			if (rightAnimatedWidth.value > leftAnimatedWidth.value) {
				return 'right';
			}
			return '';
		},
		(cur, prev) => {
			if (cur !== prev) {
				runOnJS(setAnimationFocusedInput)(cur);
			}
		},
	);

	useEffect(() => {
		switch (focusedInput) {
			case 'left':
				leftAnimatedWidth.value = withTiming(containerWidth, animationConfig);
				rightAnimatedWidth.value = initTextWidth;
				break;
			case 'right':
				rightAnimatedWidth.value = withTiming(containerWidth, animationConfig);
				leftAnimatedWidth.value = initTextWidth;
				break;
			default:
				leftAnimatedWidth.value = withTiming(initTextWidth, animationConfig);
				rightAnimatedWidth.value = withTiming(initTextWidth, animationConfig);
				break;
		}
	}, [focusedInput]);

	const resetFocused = () => {
		setFocusedInput('');
	};

	const onModelRightIconPress = () => {
		if (onModelQueryClear != null) {
			onModelQueryClear();
		}

		modelSearchRef.current?.blur();
		setFocusedInput('');
		setModelQuery('');
	};

	const onPartRightIconPress = () => {
		if (onPartQueryClear != null) {
			onPartQueryClear();
		}

		partSearchRef.current?.blur();
		setFocusedInput('');
		setPartQuery('');
	};

	return (
		<View
			style={styles.container}
			onLayout={e => setContainerWidth(e.nativeEvent.layout.width)}
		>
			<View
				style={[
					styles.textOuterContainer,
					animationFocusedInput === 'left' && styles.higherZIndex,
				]}
				onLayout={e => setInitTextWidth(e.nativeEvent.layout.width)}
			>
				<Animated.View style={[$leftAnimatedWidth]}>
					<TextInput
						ref={partSearchRef}
						placeholderStyle={$leftPlaceholderStyle}
						textWrapperStyle={$leftTextWrapperStyle}
						onFocus={() => setFocusedInput('left')}
						blurOnSubmit
						variant="search"
						value={partQuery}
						onChangeText={setPartQuery}
						resetMode={focusedInput === 'left' ? 'always' : 'never'}
						placeholder="#Part / Desc"
						returnKeyType="search"
						onSubmitEditing={() => onPartQuerySubmit(partQuery)}
						leftIcon={Part}
						rightIcon={XMark}
						isUseRightIconColor
						rightIconColor={colors.light_gray}
						onRightIconPress={onPartRightIconPress}
						isLoading={isLoading}
					/>
				</Animated.View>
			</View>
			<View
				style={[
					styles.textOuterContainer,
					animationFocusedInput === 'right' && styles.higherZIndex,
				]}
			>
				<Animated.View style={[$rightAnimatedWidth]}>
					<TextInput
						ref={modelSearchRef}
						placeholderStyle={$rightPlaceholderStyle}
						textWrapperStyle={$rightTextWrapperStyle}
						onFocus={() => setFocusedInput('right')}
						value={modelQuery}
						variant="search"
						blurOnSubmit
						onChangeText={setModelQuery}
						resetMode={focusedInput === 'right' ? 'always' : 'never'}
						placeholder="#Model"
						returnKeyType="search"
						onSubmitEditing={() => onModelQuerySubmit(modelQuery)}
						leftIcon={Model}
						rightIcon={XMark}
						isUseRightIconColor
						rightIconColor={colors.light_gray}
						onRightIconPress={onModelRightIconPress}
						isLoading={isLoading}
					/>
				</Animated.View>
			</View>
		</View>
	);
};
