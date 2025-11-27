import { Text } from '@/components/atoms';
import EmptyBox from '@/theme/assets/images/empty_box.png';
import { FC } from 'react';
import { Image, View } from 'react-native';
import { styles } from '@/components/template/SearchResult/EmptySearchResult.styles';

interface Props {}

/**
 * Name: EmptyJob
 * Desc: Functional component to render the UI of empty job
 * @returns JSX element
 */
export const EmptySearchResult: FC<Props> = ({}) => {
	return (
		<View style={styles.container}>
			<Image source={EmptyBox} style={styles.box} />
			<Text
				size="size_32"
				color="tertiary"
				weight="light"
				style={[styles.titleText, styles.textPadding]}
			>
				Nothing is found
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
