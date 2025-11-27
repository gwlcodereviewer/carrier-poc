import { FC } from 'react';
import { TextInputProps, TextInput, Text } from '@/components/atoms';
import { View } from 'react-native';
import { styles } from '@/components/molecules/TextInputWithTitle/styles';

interface Props extends TextInputProps {
	title: string;
}

export const TextInputWithTitle: FC<Props> = ({ title, ...props }) => {
	return (
		<View style={styles.container}>
			<Text size="size_14" weight="bold" color="black" style={styles.title}>
				{title}
			</Text>
			<TextInput {...props} />
		</View>
	);
};
