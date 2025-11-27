import { Skeleton } from '@/components/atoms';
import React, { useEffect } from 'react';
import { View, Image } from 'react-native';
import { styles } from './styles';

interface Props {
	uri: string;
	height: number;
	width: number;
}

export const NetworkImage: React.FC<Props> = ({ uri, height, width }) => {
	const [loadSuccessfully, setLoadSuccessfully] =
		React.useState<boolean>(false);

	return (
		<View>
			<Image
				source={{ uri }}
				height={height}
				width={width}
				style={{ resizeMode: 'contain' }}
				onLoad={() => {
					setLoadSuccessfully(true);
				}}
			/>
			{!loadSuccessfully && (
				<Skeleton
					variant="rect"
					height={height}
					width={width}
					style={styles.positionAbs}
				/>
			)}
		</View>
	);
};
