import { ProductSkeleton } from '@/components/organisms';
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface Props {
	// add props here
}

export const ProductLoadingSheet: React.FC<Props> = props => {
	return (
		<>
			{Array(10)
				.fill(1)
				.map((val, index) => (
					<ProductSkeleton key={index} />
				))}
		</>
	);
};
