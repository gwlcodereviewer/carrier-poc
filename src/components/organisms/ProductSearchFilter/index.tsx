import { Text } from '@/components/atoms/Text';
import React from 'react';
import {
	View,
	Text as RNText,
	Touchable,
	TouchableOpacity,
	Image,
} from 'react-native';
import ChevronDown from '@/theme/assets/images/chevron_down.png';
import { styles } from './styles';

interface Props {
	numProducts: number;
	filterBy: 'desc' | 'asc';
	setFilterBy: (filterBy: 'desc' | 'asc') => void;
}

export const ProductSearchFilter: React.FC<Props> = ({
	numProducts,
	filterBy,
	setFilterBy,
}) => {
	return (
		<View style={styles.container}>
			<RNText>
				<Text size="size_16" color="primary" weight="light">
					{numProducts >= 100 ? '99+' : numProducts}{' '}
				</Text>
				<Text size="size_12" color="book" weight="light">
					Matches Found
				</Text>
			</RNText>
			<View style={styles.rightContainer}>
				<Text size="size_12" color="book" weight="light">
					Sort By{' '}
				</Text>
				<TouchableOpacity
					style={styles.rightContainer}
					onPress={() => setFilterBy(filterBy === 'asc' ? 'desc' : 'asc')}
				>
					<Text size="size_16" color="primary" weight="light">
						{filterBy === 'asc' ? '$ Low - High' : '$ High - Low'}
					</Text>
					<Image source={ChevronDown} style={styles.chevronIcon} />
				</TouchableOpacity>
			</View>
		</View>
	);
};
