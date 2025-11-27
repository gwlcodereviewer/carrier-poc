import { FC } from 'react';
import { View } from 'react-native';
import { Text } from '@/components/atoms';
import { styles } from '@/screens/Product/ProductDetails/components/DetailsSection/DetailsRow.styles';

interface Props {
	title: string;
	content: string;
}

export const DetailsRow: FC<Props> = ({ title, content }) => {
	return (
		<View style={styles.container}>
			<Text
				size="size_14"
				color="light_gray"
				weight="light"
				style={styles.leftText}
			>
				{title}
			</Text>
			<Text
				size="size_16"
				color="black"
				weight="light"
				style={styles.rightText}
			>
				{content}
			</Text>
		</View>
	);
};
