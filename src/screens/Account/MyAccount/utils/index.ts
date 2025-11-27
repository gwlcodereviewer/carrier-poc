import { IAddress } from '@/api/auth/types';

const getStringWithComma = (str: string | undefined) => {
	return str ? `${str},` : '';
};

export const getFormattedAddress = (address: IAddress) => {
	const { address1, formattedArea, zip } = address;
	return `${getStringWithComma(address1)} ${formattedArea ?? ''} ${
		zip ? ` - ${zip}` : ''
	}`;
};
