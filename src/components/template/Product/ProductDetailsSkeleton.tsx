import { Skeleton } from '@/components/atoms';
import React from 'react';
import { Dimensions, View } from 'react-native';
import { styles } from './ProductDetailsSkeleton.styles';

interface Props {
	// add props here
}

const windowHeight = Dimensions.get('window').height;

export const ProductDetailsSkeleton: React.FC<Props> = () => {
	return (
		<View style={styles.container}>
			<View style={styles.contentContainer}>
				<View style={styles.imageContainer}>
					<Skeleton
						variant="rect"
						height={windowHeight * 0.25}
						width={windowHeight * 0.25}
					/>
				</View>
				<View style={styles.informationContainer}>
					<View style={styles.partNumContainer}>
						<Skeleton variant="rect" height={30} width={60} />
						<Skeleton variant="rect" height={30} width={60} />
					</View>
					<Skeleton variant="rect" height={30} width={100} />
					<Skeleton variant="rect" height={30} width={150} />
					<Skeleton variant="rect" height={90} width="100%" />
				</View>
			</View>
			<View style={styles.buttonContainer}>
				<Skeleton variant="rect" height={30} width="100%" />
				<Skeleton variant="rect" height={30} width="100%" />
			</View>
		</View>
	);
};
