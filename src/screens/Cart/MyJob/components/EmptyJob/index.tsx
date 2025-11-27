import { Text } from '@/components/atoms';
import { styles } from '@/screens/Cart/MyJob/components/EmptyJob/styles';
import EmptyBox from '@/theme/assets/images/empty_box.png';
import { FC } from 'react';
import { Image, View } from 'react-native';

interface Props {}

/**
 * Name: EmptyJob
 * Desc: Functional component to render the UI of empty job
 * @returns JSX element
 */
export const EmptyJob: FC<Props> = ({}) => {
	return (
		<View style={styles.container}>
			<Image source={EmptyBox} style={styles.box} />
			<Text
				size="size_32"
				color="tertiary"
				weight="light"
				style={[styles.titleText, styles.textPadding]}
			>
				Your job list seems to be empty,
			</Text>
			<Text
				size="size_22"
				color="dark_grey"
				weight="light"
				style={styles.titleText}
			>
				No items have been added yet
			</Text>
		</View>
	);
};
