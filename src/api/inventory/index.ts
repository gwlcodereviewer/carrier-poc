import {
	DistributionCenter,
	IGetInventoryPayload,
	IGetInventoryResponse,
} from '@/api/inventory/types';
import axios from 'axios';
import { getEnvironmentVars } from '../../../environment';

const { CARRIER_GATEWAY_AUTH_TOKEN, SHOP_BREEZE_URL } = getEnvironmentVars();

const headers = {
	'Content-Type': 'application/json',
	Authorization: CARRIER_GATEWAY_AUTH_TOKEN,
};

export const getInventoryFromDistributionCenter = async (
	shop: string,
	skus: string[],
	distributionCenter: DistributionCenter,
): Promise<IGetInventoryResponse> => {
	const body: IGetInventoryPayload = {
		shop,
		items: skus,
		locations: [
			{
				...distributionCenter,
				brands_valid: false,
				items_found: false,
				pickup_only: 'true',
				is_integrated: 'true',
				is_opticlean: 'true',
				is_partstown: 'true',
				items: skus,
			},
		],
	};

	try {
		const url = `${SHOP_BREEZE_URL}/inventory`;
		const res = await axios.post<IGetInventoryResponse>(url, body, { headers });
		console.log(res.data?.has_inventory);
		return res.data;
	} catch (error: any) {
		throw error;
	}
};
