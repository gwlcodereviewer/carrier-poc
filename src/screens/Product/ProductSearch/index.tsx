import React, {
	FunctionComponent,
	ReactElement,
	useEffect,
	useMemo,
	useContext,
	useRef,
	useState,
} from 'react';
import { View } from 'react-native';

import { useAppDispatch } from '@/app/store';
import { RootState } from '@/app/rootReducer';
import { useSelector } from 'react-redux';
import {
	searchPartsByModel,
	searchPartsByQuery,
	setSearchProducts,
	setSearchQueryProducts,
} from '@/reducers/productSearchReducer';
import { useGlobalHeaderContext, ANIMATION_STOP_POINTS } from '@/contexts';
import { StackNavigationProp } from '@react-navigation/stack';
import { SearchStackParamList } from '@/types/navigation';
import {
	ProductCategoryFilter,
	ProductSearchBar,
	ProductSearchFilter,
} from '@/components/organisms';
import { SearchResult } from '@/components/template/SearchResult';
import { setShouldShowSwipeOverlay } from '@/reducers/configReducer';
import { useIsFocused } from '@react-navigation/native';
import { common } from '@/translations/en';
import { createCheckoutForOneItem, linkCheckoutWithCustomer } from '@/api/cart';
import { useToast } from '@/contexts/ToastContext';
import { TOAST_TYPES } from '@/constant/utils';
import { ProductInfoContext } from '@/screens/Product/ProductDetails/context';
import { addToCart } from '@/reducers/cartReducer';
import { IProduct } from '@/api/product/types';
import {
	Easing,
	useSharedValue,
	withTiming,
	WithTimingConfig,
} from 'react-native-reanimated';
import styles from './styles';
import { AnimatedHeader } from './components/AnimatedHeader';
import SwipeModal from './components/SwipeModal';
import { EmptySearch } from './components/EmptySearch';

type ProductSearchProps = {
	navigation: StackNavigationProp<SearchStackParamList, 'ProductSearch'>;
};

interface IOverViewHeight {
	topHeight: number;
	bottomHeight: number;
}

const orderProducts = (products: IProduct[], order: 'asc' | 'desc') => {
	return [...products].sort((a, b) => {
		const variantA = a.node.variants.edges[0]?.node;
		const variantB = b.node.variants.edges[0]?.node;
		const priceA =
			typeof variantA?.price === 'string'
				? variantA?.price
				: variantA?.price?.amount;
		const priceB =
			typeof variantB?.price === 'string'
				? variantB?.price
				: variantB?.price?.amount;
		if (order === 'asc') {
			return Number(priceA) - Number(priceB);
		}
		return Number(priceB) - Number(priceA);
	});
};

const ProductSearch: FunctionComponent<ProductSearchProps> = ({
	navigation,
}): ReactElement => {
	const dispatch = useAppDispatch();

	const { cartId } = useSelector((state: RootState) => state.cart);

	const { deliveryMethod } = useContext(ProductInfoContext);

	const { updateStopPoint, animationStopPoint } = useGlobalHeaderContext();
	const { productByModel, productByQuery } = useSelector(
		(state: RootState) => state.productSearch,
	);
	const { authCustomer } = useSelector((state: RootState) => state.auth);
	const { shouldShowSwipeOverlay } = useSelector(
		(state: RootState) => state.config,
	);
	const isFocused = useIsFocused();
	const { hasSearched } = useSelector((state: RootState) => state.config);
	const { distributionCenter } = useSelector(
		(state: RootState) => state.distributionCenter,
	);
	const showToast = useToast();

	const [lastSearched, setLastSearched] = useState<'model' | 'query' | ''>('');
	const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
	const [overlayViewHeight, setOverlayViewHeight] = useState<IOverViewHeight>({
		topHeight: 0,
		bottomHeight: 0,
	});
	const [filterBy, setFilterBy] = useState<'desc' | 'asc'>('asc');
	const [isSorting, setIsSorting] = useState(false);

	const selectCategory = (category: string) => {
		if (selectedCategories.includes(category)) {
			setSelectedCategories(selectedCategories.filter(c => c !== category));
		} else {
			setSelectedCategories([...selectedCategories, category]);
		}
	};

	const {
		isLoading: isModelSearchLoading,
		products: modelProducts,
		partNumberByCategory,
		productSearchError: modelSearchError,
	} = productByModel;

	const {
		isLoading: isQuerySearchLoading,
		products: queryProducts,
		productSearchError: querySearchError,
	} = productByQuery;

	const { isDataLoading, productData, error, categories } = useMemo(() => {
		switch (lastSearched) {
			case 'model':
				return {
					isDataLoading: isModelSearchLoading,
					productData: modelProducts,
					categories: Object.keys(partNumberByCategory),
					error: modelSearchError,
				};
			case 'query':
				return {
					isDataLoading: isQuerySearchLoading,
					productData: queryProducts,
					categories: [],
					error: querySearchError,
				};
		}
		return {
			isDataLoading: false,
			productData: [],
			categories: [],
			error: null,
		};
	}, [
		isModelSearchLoading,
		modelProducts,
		modelSearchError,
		isQuerySearchLoading,
		queryProducts,
		querySearchError,
		lastSearched,
	]);

	// category effects
	useEffect(() => {
		setSelectedCategories([]);
	}, [categories]);

	useEffect(() => {
		if (isFocused && productData.length === 0 && lastSearched === '') {
			updateStopPoint(ANIMATION_STOP_POINTS.INIT_SEARCH);
		}
	}, [isFocused, productData, lastSearched, updateStopPoint]);

	useEffect(() => {
		if (lastSearched) {
			updateStopPoint(ANIMATION_STOP_POINTS.FIXED_HEADER);
		} else {
			updateStopPoint(ANIMATION_STOP_POINTS.INIT_SEARCH);
		}
	}, [lastSearched, updateStopPoint]);

	const filteredProducts = useMemo(() => {
		if (selectedCategories.length === 0) {
			return orderProducts(productData, filterBy);
		}

		const productSkus = Object.keys(partNumberByCategory).reduce<string[]>(
			(acc, key) => {
				if (selectedCategories.includes(key)) {
					return acc.concat(partNumberByCategory[key]);
				}
				return acc;
			},
			[],
		);
		const filteredProductData = productData.filter(product => {
			return productSkus.includes(product.node.variants.edges[0]?.node?.sku);
		});
		return orderProducts(filteredProductData, filterBy);
	}, [selectedCategories, productData, partNumberByCategory, filterBy]);

	useEffect(() => {
		setIsSorting(false);
	}, [filteredProducts]);

	useEffect(() => {
		if (
			filteredProducts.length > 0 &&
			!hasSearched &&
			overlayViewHeight.topHeight > 0 &&
			overlayViewHeight.bottomHeight > 0
		) {
			dispatch(setShouldShowSwipeOverlay(true));
		}
	}, [filteredProducts, hasSearched, overlayViewHeight]);

	/**
	 * Name: onAddToJob
	 * Desc: Function to add item to job.
	 */
	const onAddToJob = async (variantId: string) => {
		cartId &&
			dispatch(
				addToCart(
					cartId,
					[
						{
							merchandiseId: variantId,
							quantity: 1,
							attributes: [
								{
									key: 'delivery_type',
									value: deliveryMethod,
								},
								{
									key: 'distributor_address',
									value: JSON.stringify(distributionCenter.address),
								},
								{
									key: 'distributor_hvac_id',
									value: distributionCenter.hvacid.toString(),
								},
							],
						},
					],
					() => {
						showToast(TOAST_TYPES.warning, common.toastMessage.itemAdded);
					},
				),
			);
	};

	const onSwipeToCheckout = async (variantId: string) => {
		if (!authCustomer) return;
		const [checkoutInfo, error] = await createCheckoutForOneItem(
			{
				countryCode: authCustomer.defaultAddress.countryCodeV2,
			},
			authCustomer.email,
			{
				address1: authCustomer.defaultAddress.address1,
				address2: authCustomer.defaultAddress.address2,
				firstName: authCustomer.defaultAddress.firstName,
				city: authCustomer.defaultAddress.city,
				zip: authCustomer.defaultAddress.zip,
				province: authCustomer.defaultAddress.province,
				country: authCustomer.defaultAddress.country,
				lastName: authCustomer.defaultAddress.lastName,
				company: authCustomer.defaultAddress.company,
			},
			{
				variantId,
				quantity: 1,
				customAttributes: [
					{
						key: 'delivery_type',
						value: 'shipto',
					},
					{
						key: 'distributor_address',
						value: JSON.stringify(distributionCenter.address),
					},
					{
						key: 'distributor_hvac_id',
						value: distributionCenter.hvacid.toString(),
					},
				],
			},
		);
		if (error || !checkoutInfo) {
			showToast(TOAST_TYPES.alert, common.toastMessage.checkoutError);
			return;
		}
		const { id } = checkoutInfo;
		const [associatedCheckout, associateError] = await linkCheckoutWithCustomer(
			id,
		);
		if (associateError || !associatedCheckout) {
			showToast(TOAST_TYPES.alert, common.toastMessage.checkoutError);
			return;
		}
		navigation.navigate('Checkout', { checkoutUrl: associatedCheckout.webUrl });
	};

	const onModelSearch = async (query: string) => {
		dispatch(searchPartsByModel(query));
		setLastSearched('model');
	};

	const onModelClear = () => {
		dispatch(setSearchProducts([]));
		setLastSearched('');
	};

	const onPartSearch = (query: string) => {
		dispatch(searchPartsByQuery(query));
		setLastSearched('query');
	};

	const onPartClear = () => {
		dispatch(setSearchQueryProducts([]));
		setLastSearched('');
	};

	return (
		<>
			<View style={styles.mainContainer}>
				<View style={styles.headerContainer}>
					<AnimatedHeader
						username={authCustomer?.displayName || ''}
						hide={animationStopPoint === ANIMATION_STOP_POINTS.FIXED_HEADER}
					/>
					<ProductSearchBar
						onModelQuerySubmit={onModelSearch}
						onPartQuerySubmit={onPartSearch}
						onModelQueryClear={onModelClear}
						onPartQueryClear={onPartClear}
						isLoading={isDataLoading}
					/>
					{categories.length > 0 && productData.length > 0 && (
						<ProductCategoryFilter
							categories={categories}
							selectedCategories={selectedCategories}
							onSelect={selectCategory}
						/>
					)}
					{lastSearched !== '' && (
						<ProductSearchFilter
							numProducts={filteredProducts.length}
							filterBy={filterBy}
							setFilterBy={order => {
								setIsSorting(true);
								setFilterBy(order);
							}}
						/>
					)}
				</View>
				{filteredProducts.length === 0 &&
					!isDataLoading &&
					lastSearched !== '' && <EmptySearch />}
				{(isDataLoading || filteredProducts.length > 0) &&
					(<SearchResult
						products={filteredProducts}
						isLoading={isDataLoading}
						onEndReached={() => {}}
						navigateToProduct={(productId: string) => {
							navigation.navigate('ProductDetails', { productId });
						}}
						onSwipeToCheckout={variantId => onSwipeToCheckout(variantId)}
						onAddToJob={variantId => onAddToJob(variantId)}
						getHeightValues={(_top, _bottom) =>
							setOverlayViewHeight({ topHeight: _top, bottomHeight: _bottom })
						}
						filterBy={filterBy}
						isSorting={isSorting}
					/>
				)}
			</View>
			{shouldShowSwipeOverlay && (
				<SwipeModal overlayViewHeight={overlayViewHeight} />
			)}
		</>
	);
};

export default ProductSearch;
