import {
	AnimatedTabHeader,
	Props as HeaderProps,
} from '@/components/organisms';
import React, { useEffect, useMemo, useState } from 'react';
import { useWindowDimensions, View } from 'react-native';
import Animated, {
	runOnJS,
	useAnimatedRef,
	useAnimatedScrollHandler,
	useSharedValue,
} from 'react-native-reanimated';
import { styles } from '@/components/template/AnimatedTabPages/styles';

export interface Props extends Omit<HeaderProps, 'sharedIndex'> {
	children: React.ReactNode;
	showAddress: boolean;
}

/**
 * Make sure the width of the page is '100%'
 */
export const AnimatedTabPages: React.FC<Props> = props => {
	const { width } = useWindowDimensions();
	const animatedScrollRef = useAnimatedRef<Animated.ScrollView>();

	const sharedScrollIndex = useSharedValue(0);

	const selectedIndex = useMemo(() => {
		return props.tabs.findIndex(tab => tab.key === props.selected);
	}, [props.selected, props.tabs]);

	useEffect(() => {
		animatedScrollRef.current?.scrollTo({ x: selectedIndex * width + 1 });
	}, [selectedIndex,props.showAddress]);

	const scrollHandler = useAnimatedScrollHandler({
		onScroll: event => {
			const position = event.contentOffset.x;
			sharedScrollIndex.value = position / width;
		},
		onMomentumEnd: event => {
			const index = Math.round(event.contentOffset.x / width);
			runOnJS(props.onPress)(props.tabs[index].key);
		},
	});

	return (
		<View style={{ flex: 1 }}>
			<AnimatedTabHeader {...props} sharedIndex={sharedScrollIndex} />
			<Animated.ScrollView
				ref={animatedScrollRef}
				horizontal
				showsHorizontalScrollIndicator={false}
				pagingEnabled
				removeClippedSubviews
				scrollEventThrottle={16}
				nestedScrollEnabled
				onScroll={scrollHandler}
			>
				{props.children}
			</Animated.ScrollView>
		</View>
	);
};
