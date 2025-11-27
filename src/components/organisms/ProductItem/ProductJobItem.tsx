import React, { useEffect, useMemo, useState } from 'react';
import {
	ActivityIndicator,
	Image,
	Pressable,
	TouchableOpacity,
	View,
} from 'react-native';
import { NetworkImage } from '@/components/molecules';
import { Text } from '@/components/atoms/Text';
import useTheme from '@/theme/hooks/useTheme';
import { QuantitySelector } from '@/components/organisms';
import { IAttribute, ICartLine } from '@/api/cart/types';
import TrashCan from '@/theme/assets/images/trash_can.png';
import { styles } from './styles';

interface Props {
	cartLine: ICartLine;
	onDeletePress: (lineId: string) => void;
	navigateToProduct: () => void;
	isRemoveFromCartLoading: boolean;
	updateQuantity: (
		lineId: string,
		quantity: number,
		attributes: IAttribute[],
	) => void;
}

export const ProductJobItem: React.FC<Props> = ({
	cartLine,
	navigateToProduct,
	onDeletePress,
	isRemoveFromCartLoading,
	updateQuantity,
}) => {
	const { borders, backgrounds, colors } = useTheme();
	const [isDeletePressed, setIsDeletePressed] = useState(false);
	const [quantity, setQuantity] = useState(cartLine.quantity);

	useEffect(() => {
		setQuantity(cartLine.quantity);
	}, [cartLine]);

	const decreaseQuantity = () => {
		if (quantity > 1) {
			updateQuantity(cartLine.id, quantity - 1, cartLine.attributes);
		} else if (quantity === 1) {
			onDeletePress(cartLine.id);
			setIsDeletePressed(true);
		}
	};

	const increaseQuantity = () => {
		updateQuantity(cartLine.id, quantity + 1, cartLine.attributes);
	};

	useEffect(() => {
		if (!isRemoveFromCartLoading) {
			setIsDeletePressed(false);
		}
	}, [isRemoveFromCartLoading]);

	const isLoading = useMemo(() => {
		return isRemoveFromCartLoading && isDeletePressed;
	}, [isRemoveFromCartLoading, isDeletePressed]);

	return (
		<Pressable
			style={[
				styles.productContainer,
				styles.productJobContainer,
				borders.light_gray,
				backgrounds.white,
			]}
			onPress={navigateToProduct}
		>
			<NetworkImage
				uri={cartLine.merchandise.product.featuredImage.url}
				height={173}
				width={173}
			/>
			<View style={styles.rightContainer}>
				<Text size="size_16" color="black" numberOfLines={1} weight="light">
					{cartLine.merchandise.sku}
				</Text>
				<Text size="size_14" color="black" numberOfLines={3} weight="light">
					{cartLine.merchandise.product.title}
				</Text>
				<Text size="size_16" color="tertiary" numberOfLines={1} weight="bold">
					$ {cartLine.merchandise.price?.amount}
				</Text>
				<View style={styles.quantityContainer}>
					<QuantitySelector
						quantity={cartLine.quantity}
						increaseQuantity={increaseQuantity}
						decreaseQuantity={decreaseQuantity}
					/>
				</View>
			</View>
			<TouchableOpacity
				style={[styles.deleteContainer, backgrounds.tint_blue]}
				disabled={isLoading}
				onPress={() => {
					onDeletePress(cartLine.id);
					setIsDeletePressed(true);
				}}
			>
				{isLoading ? (
					<ActivityIndicator
						size="small"
						color={colors.primary}
						animating={isLoading}
						style={styles.deleteIconContainer}
					/>
				) : (
					<View style={styles.deleteIconContainer}>
						<Image source={TrashCan} style={styles.deleteIcon} />
					</View>
				)}
			</TouchableOpacity>
		</Pressable>
	);
};
