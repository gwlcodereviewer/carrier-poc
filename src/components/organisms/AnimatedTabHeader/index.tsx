import { TouchableOpacity, View } from 'react-native';
import { Text } from '@/components/atoms';
import { styles } from '@/components/organisms/AnimatedTabHeader/styles';
import { useEffect, useState } from 'react';
import Animated, {
	clamp,
	FadeIn,
	SharedValue,
	useAnimatedStyle,
	WithTimingConfig,
} from 'react-native-reanimated';
import { useTheme } from '@/theme';

export type TabOption = { label: string; key: string };

export interface Props {
	tabs: TabOption[];
	selected: string;
	onPress: (key: string) => void;
	animatedBarPadding?: number;
	animationConfig?: WithTimingConfig;
	sharedIndex: SharedValue<number>;
}

const calculateCurrentTranslationX = (
	tabWidth: number,
	selectedIndex: number,
	animatedBarPadding: number,
) => {
	'worklet';

	if (selectedIndex === 0) {
		return animatedBarPadding;
	}
	return (
		selectedIndex * (tabWidth + animatedBarPadding * 2) -
		animatedBarPadding * selectedIndex
	);
};

/**
 * Only supports 2 tabs
 */
export function AnimatedTabHeader({
	tabs,
	selected,
	animatedBarPadding = 20,
	onPress,
	sharedIndex,
}: Props) {
	const { backgrounds, borders } = useTheme();
	const [tabWidth, setTabWidth] = useState(0);

	const $translationXStyle = useAnimatedStyle(() => {
		const curTranslationX = calculateCurrentTranslationX(
			tabWidth,
			sharedIndex.value,
			animatedBarPadding,
		);
		return {
			transform: [
				{
					translateX: clamp(
						curTranslationX,
						animatedBarPadding,
						tabWidth * tabs.length - animatedBarPadding,
					),
				},
			],
		};
	});

	return (
		<View>
			<View style={styles.tabContainer}>
				{tabs.map((tab, index) => (
					<TouchableOpacity
						key={tab.key}
						style={styles.tab}
						onLayout={e => {
							if (index === 0) {
								setTabWidth(e.nativeEvent.layout.width);
							}
						}}
						onPress={() => onPress(tab.key)}
					>
						<Text
							color={selected === tab.key ? 'primary_light_blue' : 'dark_grey'}
							size="size_16"
							weight="light"
						>
							{tab.label}
						</Text>
					</TouchableOpacity>
				))}
			</View>
			{tabWidth > 0 && (
				<Animated.View
					style={[
						styles.animatedBar,
						borders.primary_blue,
						{ width: tabWidth - animatedBarPadding * 2 },
						$translationXStyle,
						backgrounds.primary_light_blue,
					]}
					entering={FadeIn}
				/>
			)}
		</View>
	);
}
