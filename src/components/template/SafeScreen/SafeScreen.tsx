import { SafeAreaView, StatusBar } from 'react-native';

import { useTheme } from '@/theme';

import type { PropsWithChildren } from 'react';

function SafeScreen({ children }: PropsWithChildren) {
	const { layout, navigationTheme } = useTheme();

	return (
		<SafeAreaView
			style={[
				layout.flex_1,
				{ backgroundColor: navigationTheme.colors.background },
			]}
		>
			{children}
		</SafeAreaView>
	);
}

export default SafeScreen;
