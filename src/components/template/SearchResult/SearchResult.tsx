import { IProduct } from '@/api/product/types';
import { ProductItem } from '@/components/organisms';
import React, {
	useCallback,
	useEffect,
	useMemo,
	useRef,
	useState,
} from 'react';
import {
	View,
	FlatList,
	findNodeHandle,
	NativeModules,
	ActivityIndicator,
} from 'react-native';
import { ProductLoadingSheet } from '@/components/template';
import { styles } from '@/components/template/SearchResult/styles';
import Animated, {
	FadeIn,
	FadeOut,
	SharedValue,
	useAnimatedStyle,
} from 'react-native-reanimated';
import { useTheme } from '@/theme';

interface Props {
	isLoading: boolean;
	products: IProduct[];
	navigateToProduct: (productId: string) => void;
	onSwipeToCheckout: (variantId: string) => void;
	onAddToJob: (variantId: string) => void;
	onEndReached: () => void;
	getHeightValues?: (topHeight: number, bottomHeight: number) => void;
	filterBy: 'asc' | 'desc';
	isSorting: boolean;
}

export const SearchResult: React.FC<Props> = ({
	isLoading,
	products,
	navigateToProduct,
	onSwipeToCheckout,
	onAddToJob,
	onEndReached,
	getHeightValues,
	isSorting,
}) => {
	const { colors, backgrounds } = useTheme();
	const flatListRef = useRef(null);
	const renderFooter = useCallback(
		() => isLoading && <ProductLoadingSheet />,
		[isLoading],
	);
	const [topHeight, setTopHeight] = useState<number>(0);
	const [bottomHeight, setBottomHeight] = useState<number>(0);

	/**
	 * Name: useEffect
	 * Desc: useEffect to get the top height above flatList
	 */
	useEffect(() => {
		if (flatListRef.current) {
			const flatListHandle = findNodeHandle(flatListRef.current)!;
			NativeModules.UIManager.measure(
				flatListHandle,
				(
					x: number,
					y: number,
					width: number,
					height: number,
					pageX: number,
					pageY: number,
				) => {
					setTopHeight(pageY);
				},
			);
		}
	}, [bottomHeight]);

	/**
	 * Name: useEffect
	 * Desc: useEffect to send the height values to parent component
	 */
	useEffect(() => {
		if (topHeight > 0 && bottomHeight > 0) {
			if (getHeightValues) getHeightValues(topHeight, bottomHeight);
		}
	}, [topHeight, bottomHeight]);

	return (
		<View style={styles.container}>
			<FlatList
				ref={flatListRef}
				data={products}
				showsVerticalScrollIndicator={false}
				keyExtractor={item => item.node.id}
				renderItem={({ item, index }) => {
					const onLayout = (event: any) => {
						if (index === 0) {
							const { height } = event.nativeEvent.layout;
							setBottomHeight(height);
						}
					};
					return (
						<ProductItem
							product={item}
							navigateToProduct={navigateToProduct}
							onSwipeToCheckout={onSwipeToCheckout}
							onAddToJob={onAddToJob}
							onLayout={onLayout}
						/>
					);
				}}
				ListFooterComponent={renderFooter}
				onEndReached={onEndReached}
				onEndReachedThreshold={0.5}
			/>
			{isSorting && (
				<Animated.View
					style={[styles.loadingOverlay]}
					entering={FadeIn}
					exiting={FadeOut}
				>
					<ActivityIndicator size="small" color={colors.primary_light_blue} />
				</Animated.View>
			)}
		</View>
	);
};
