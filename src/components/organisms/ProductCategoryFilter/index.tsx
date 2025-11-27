import { FC } from 'react';
import { FlatList, View } from 'react-native';
import { Text } from '@/components/atoms';
import { SelectionTab } from '@/components/molecules/SelectionTab';
import { styles } from '@/components/organisms/ProductCategoryFilter/styles';

interface Props {
	categories: string[];
	selectedCategories: string[];
	onSelect: (category: string) => void;
}

export const ProductCategoryFilter: FC<Props> = ({
	categories,
	selectedCategories,
	onSelect,
}) => {
	return (
		<View style={styles.container}>
			<Text size="size_12" weight="light" color="light_gray">
				Categorize Selected{' '}
			</Text>
			<FlatList
				contentContainerStyle={styles.scrollContainer}
				data={categories}
				keyExtractor={item => item}
				renderItem={({ item }) => (
					<SelectionTab
						selected={selectedCategories.includes(item)}
						text={item}
						onPress={() => onSelect(item)}
					/>
				)}
				horizontal
				showsHorizontalScrollIndicator={false}
			/>
		</View>
	);
};
