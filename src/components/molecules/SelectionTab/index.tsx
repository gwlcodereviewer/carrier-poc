import { TouchableOpacity } from 'react-native';
import { Text } from '@/components/atoms';
import { FC } from 'react';
import { useTheme } from '@/theme';
import { styles } from './styles';

interface Props {
	selected: boolean;
	text: string;
	onPress: () => void;
}

export const SelectionTab: FC<Props> = ({ selected, text, onPress }) => {
	const { borders, backgrounds } = useTheme();
	return (
		<TouchableOpacity
			style={[
				styles.container,
				borders.tint_blue,
				selected ? backgrounds.tint_blue : backgrounds.white,
			]}
			onPress={onPress}
		>
			<Text
				size="size_14"
				weight="light"
				color={selected ? 'primary_light_blue' : 'dark_grey'}
			>
				{text}
			</Text>
		</TouchableOpacity>
	);
};
