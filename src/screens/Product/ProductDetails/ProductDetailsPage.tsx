import React, { FC, useMemo, useState } from 'react';
import { Dimensions, ScrollView, View } from 'react-native';
import { styles } from '@/screens/Product/ProductDetails/ProductDetailsPage.styles';
import { NetworkImage } from '@/components/molecules';
import { IProductDetails } from '@/api/product/types';
import { useTheme } from '@/theme';
import {
	CheckoutOverlay,
	DetailsSection,
	QuantitySection,
	ShippingSection,
} from '@/screens/Product/ProductDetails/components';
import { CHECKOUT_OVERLAY_HEIGHT } from '@/screens/Product/ProductDetails/components/CheckoutOverlay/styles';
import {
	IProductInfoContext,
	ProductInfoContext,
} from '@/screens/Product/ProductDetails/context';
import { ICartLine } from '@/api/cart/types';
import { StackNavigationProp } from '@react-navigation/stack';
import { SearchStackParamList } from '@/types/navigation';
import {
	DistributionCenter,
	IGetInventoryResponse,
} from '@/api/inventory/types';

interface Props {
	product: IProductDetails;
	itemQuantity?: number;
	lineItem?: ICartLine;
	navigation: StackNavigationProp<SearchStackParamList, 'ProductDetails'>;
	distributionCenter: DistributionCenter;
	inventoryStatus: IGetInventoryResponse | null;
}

const windowHeight = Dimensions.get('window').height;

export const ProductDetailsPage: FC<Props> = ({
	product,
	itemQuantity,
	lineItem,
	navigation,
	inventoryStatus,
	distributionCenter,
}) => {
	const { borders } = useTheme();
	const [quantity, setQuantity] = useState(itemQuantity || 1);
	const [deliveryMethod, setDeliveryMethod] =
		useState<IProductInfoContext['deliveryMethod']>('shipto');
	const firstVariant = useMemo(() => product.variants.edges[0].node, [product]);
	return (
		<View style={styles.container}>
			<ProductInfoContext.Provider
				value={{
					quantity,
					updateQuantity: setQuantity,
					navigation,
					lineItem,
					inventoryStatus,
					selectedDistributionCenter: distributionCenter,
					deliveryMethod,
					updateDeliveryMethod: method => setDeliveryMethod(method),
				}}
			>
				<ScrollView
					contentInset={{ bottom: CHECKOUT_OVERLAY_HEIGHT }}
					showsVerticalScrollIndicator={false}
				>
					<View style={[styles.imageContainer, borders.light_gray]}>
						<NetworkImage
							uri={
								product.featuredImage.originalSrc || product.featuredImage.src
							}
							height={windowHeight * 0.25}
							width={windowHeight * 0.25}
						/>
					</View>
					<QuantitySection
						title={product.title}
						sku={firstVariant.sku}
						price={firstVariant.price}
						availableQuantity={firstVariant.inventoryQuantity}
					/>
					<ShippingSection />
					<DetailsSection description={product.description} />
				</ScrollView>
				<CheckoutOverlay productVariantId={firstVariant.id} />
			</ProductInfoContext.Provider>
		</View>
	);
};
