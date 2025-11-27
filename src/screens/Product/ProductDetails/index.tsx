import React, {
	FunctionComponent,
	ReactElement,
	useCallback,
	useEffect,
	useMemo,
	useState,
} from 'react';
import { View } from 'react-native';
import { useAppDispatch } from '@/app/store';
import { StackScreenProps } from '@react-navigation/stack';
import { SearchStackParamList } from '@/types/navigation';
import { IProduct, IProductDetails } from '@/api/product/types';
import { getProductById } from '@/services/product';
import { ProductDetailsSkeleton } from '@/components/template';
import { ProductDetailsPage } from '@/screens/Product/ProductDetails/ProductDetailsPage';
import { useSelector } from 'react-redux';
import { RootState } from '@/app/rootReducer';
import { ICartLine } from '@/api/cart/types';
import { IGetInventoryResponse } from '@/api/inventory/types';
import { getInventoryFromDistributionCenter } from '@/api/inventory';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import styles from './styles';

const ProductDetails: FunctionComponent<
	StackScreenProps<SearchStackParamList, 'ProductDetails'>
> = ({ navigation, route }): ReactElement => {
	const dispatch = useAppDispatch();
	const {
		cartState: { cart },
	} = useSelector((state: RootState) => state.cart);
	const { shop, distributionCenter } = useSelector(
		(state: RootState) => state.distributionCenter,
	);
	const [product, setProduct] = useState<IProductDetails>();
	const [lineItem, setLineItem] = useState<ICartLine>();
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [inventoryStatus, setInventoryStatus] =
		useState<IGetInventoryResponse | null>(null);

	const fetchProduct = async () => {
		setIsLoading(true);
		const result = await getProductById(route.params.productId);
		setLineItem(
			cart?.lines?.edges.find(
				lineItem =>
					lineItem.node.merchandise.product.id === route.params.productId,
			)?.node,
		);
		setProduct(result);
		setIsLoading(false);
	};

	useEffect(() => {
		if (distributionCenter && product) {
			const sku = product?.variants.edges[0]?.node?.sku;
			if (sku) {
				getInventoryFromDistributionCenter(
					shop,
					[sku],
					distributionCenter,
				).then(inventory => {
					setInventoryStatus(inventory);
				});
			}
		}
	}, [distributionCenter, product]);

	useEffect(() => {
		setLineItem(
			cart?.lines?.edges.find(
				lineItem =>
					lineItem.node.merchandise.product.id === route.params.productId,
			)?.node,
		);
	}, [cart, product]);

	useEffect(() => {
		fetchProduct();
	}, [route.params]);

	const renderProductDetails = useCallback(() => {
		if (isLoading || !product || !inventoryStatus) {
			return (
				<Animated.View style={[styles.flex]} exiting={FadeOut}>
					<ProductDetailsSkeleton />
				</Animated.View>
			);
		}
		return (
			<Animated.View style={[styles.flex]} entering={FadeIn}>
				<ProductDetailsPage
					product={product}
					itemQuantity={lineItem?.quantity}
					lineItem={lineItem}
					navigation={navigation}
					inventoryStatus={inventoryStatus}
					distributionCenter={distributionCenter}
				/>
			</Animated.View>
		);
	}, [product, isLoading, lineItem, inventoryStatus, distributionCenter]);

	return <View style={styles.mainContainer}>{renderProductDetails()}</View>;
};

export default ProductDetails;
