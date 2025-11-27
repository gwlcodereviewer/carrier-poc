import { Text } from '@/components/atoms';
import EmptyBox from '@/theme/assets/images/empty_box.png';
import { FC } from 'react';
import { Image, View } from 'react-native';
import { styles } from '@/screens/Product/ProductSearch/components/EmptySearch/styles';

interface Props {}

/**
 * Name: EmptySearch
 * Desc: Functional component to render the UI of empty search
 * @returns JSX element
 */
export const EmptySearch: FC<Props> = () => {
	return (
		<View style={styles.container}>
			<Image source={EmptyBox} style={styles.box} />
			<Text
				size="size_32"
				color="tertiary"
				weight="light"
				style={[styles.titleText, styles.textPadding]}
			>
				No results found
			</Text>
			<Text
				size="size_22"
				color="dark_grey"
				weight="light"
				style={styles.titleText}
			>
				Let's search again!
			</Text>
		</View>
	);
};