import React from 'react';
import { StyleProp, View, ViewStyle } from 'react-native';
import { Text } from '@/components/atoms';
import { Button } from '@/components/molecules';
import { styles } from '@/components/organisms/QuantitySelector/styles';

interface Props {
	quantity: number;
	increaseQuantity: () => void;
	decreaseQuantity: () => void;
	disabled?: boolean;
	containerStyle?: StyleProp<ViewStyle>;
}

export const QuantitySelector: React.FC<Props> = ({
	quantity,
	increaseQuantity,
	decreaseQuantity,
	containerStyle,
	disabled = false,
}) => {
	return (
		<View style={[styles.container, containerStyle]}>
			<Button
				onPress={decreaseQuantity}
				textColor={disabled ? 'light_gray' : 'primary-light'}
				title="-"
				backgroundColor={disabled ? 'tint_light_grey' : 'tint_blue'}
				containerStyle={styles.button}
				isDisabled={disabled}
				disabledStyle={{}}
			/>
			<Text weight="regular" color="primary" size="size_22">
				{quantity}
			</Text>
			<Button
				onPress={increaseQuantity}
				textColor={disabled ? 'light_gray' : 'primary-light'}
				title="+"
				backgroundColor={disabled ? 'tint_light_grey' : 'tint_blue'}
				containerStyle={styles.button}
				isDisabled={disabled}
				disabledStyle={{}}
			/>
		</View>
	);
};
