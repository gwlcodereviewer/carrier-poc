import { FC, useCallback, useContext, useEffect, useMemo } from 'react';
import { View } from 'react-native';
import { DetailsRow } from '@/screens/Product/ProductDetails/components/DetailsSection/DetailsRow';
import { styles } from '@/screens/Product/ProductDetails/components/DetailsSection/styles';
import { ProductInfoContext } from '@/screens/Product/ProductDetails/context';

interface Props {
	description: string;
}

function extractDimensions(description: string) {
	// Regular expressions to find dimension values in the description
	const heightRegex = /Height\s*([0-9.]+)/;
	const lengthRegex = /Length\s*([0-9.]+)/;
	const widthRegex = /Width\s*([0-9.]+)/;
	const weightRegex = /Weight\s*([0-9.]+)/;

	// Extracting the dimension values using the regular expressions
	const heightMatch = description.match(heightRegex);
	const lengthMatch = description.match(lengthRegex);
	const widthMatch = description.match(widthRegex);
	const weightMatch = description.match(weightRegex);

	// Parsing the matched values to float, if found, or setting them to null if not found
	const height = heightMatch ? parseFloat(heightMatch[1]) : null;
	const length = lengthMatch ? parseFloat(lengthMatch[1]) : null;
	const width = widthMatch ? parseFloat(widthMatch[1]) : null;
	const weight = weightMatch ? parseFloat(weightMatch[1]) : null;

	// Returning an object with the extracted dimension values
	return { height, length, width, weight };
}

const getStringWithUnit = (value: number | string | null, unit: string) => {
	if (!value) return '';
	return `${value}${unit}`;
};

export const DetailsSection: FC<Props> = ({ description }) => {
	const dimensionsAndWeight = useMemo(
		() => extractDimensions(description),
		[description],
	);

	const dimensionString = useMemo(() => {
		if (!dimensionsAndWeight) return '';
		const dimensionStrings = [];
		if (dimensionsAndWeight.width) {
			dimensionStrings.push(getStringWithUnit(dimensionsAndWeight.width, 'W'));
		}
		if (dimensionsAndWeight.height) {
			dimensionStrings.push(getStringWithUnit(dimensionsAndWeight.height, 'H'));
		}
		if (dimensionsAndWeight.length) {
			dimensionStrings.push(getStringWithUnit(dimensionsAndWeight.length, 'L'));
		}
		return dimensionStrings.join(' x ');
	}, [dimensionsAndWeight]);
	return (
		<View style={styles.container}>
			{dimensionString.length > 0 && (
				<DetailsRow title="Dimensions" content={dimensionString} />
			)}
			{dimensionsAndWeight.weight && (
				<DetailsRow
					title="Weight"
					content={`${dimensionsAndWeight.weight} lbs`}
				/>
			)}
			<DetailsRow title="Est. Delivery Date" content="Monday, Jan 29" />
			<DetailsRow title="Description" content={description} />
		</View>
	);
};
