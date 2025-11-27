import { useTheme } from '@/theme';
import React from 'react';
import { View } from 'react-native';
import { Skeleton } from '@/components/atoms';
import { styles } from './styles';

interface Props {
	// add props here
}

export const ProductSkeleton: React.FC<Props> = ({}) => {
	const { borders } = useTheme();
	return (
		<View style={[styles.productContainer, borders.light_grey_15]}>
			<Skeleton variant="rect" height={173} width={173} />
			<View style={styles.rightContainer}>
				<Skeleton variant="rect" height={20} width={100} />
				<Skeleton variant="rect" height={20} width={120} />
				<Skeleton variant="rect" height={20} width={50} />
				<Skeleton variant="rect" height={30} width={132} />
			</View>
		</View>
	);
};
