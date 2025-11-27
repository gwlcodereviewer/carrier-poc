import { IModelSearchResultData, PartNumberByCategory } from './types';

export const getNormalizeModelSearchResult = (
	data: IModelSearchResultData[],
): PartNumberByCategory => {
	const result: PartNumberByCategory = {};
	data.forEach(val => {
		result[val.category] = val.parts
			? val.parts.map(part => part.PartNumber)
			: [];
	});
	return result;
};
