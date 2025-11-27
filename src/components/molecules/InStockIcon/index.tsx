import { FC, useMemo } from 'react';
import { useTheme } from '@/theme';
import { Image, View } from 'react-native';
import Check from '@/theme/assets/images/check.png';
import XMark from '@/theme/assets/images/x_mark.png';
import { styles } from '@/components/molecules/InStockIcon/styles';
import { Text } from '@/components/atoms';

interface Props {
	inStock: boolean;
}
export const InStockIcon: FC<Props> = ({ inStock }) => {
	const { borders, colors } = useTheme();

	const iconSource = useMemo(() => (inStock ? Check : XMark), [inStock]);

	const colorKey = useMemo(
		() => (inStock ? 'tertiary_green' : 'dark_red'),
		[inStock],
	);
	return (
		<View style={[borders[colorKey], styles.container]}>
			<Image
				source={iconSource}
				style={styles.image}
				tintColor={colors[colorKey]}
			/>
			<Text size="size_12" color={colorKey} weight="bold" style={styles.text}>
				{inStock ? 'In Stock' : 'Out of Stock'}
			</Text>
		</View>
	);
};
