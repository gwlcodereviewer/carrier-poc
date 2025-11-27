export interface DistributionCenter {
	hvacid: string;
	name: string;
	geocode_longtitude: string;
	geocode_latitude: string;
	branch_number: string;
	region_code: string;
	address: {
		address: string;
		apt_suite: string;
		city: string;
		zip: string;
		state: string;
		country: string;
		phone: string;
	};
	full_address: string;
}

export interface IDistributionCenterPayload extends DistributionCenter {
	items: string[];
	brands_valid: boolean;
	items_found: boolean;
	pickup_only: string;
	is_integrated: string;
	is_opticlean: string;
	is_partstown: string;
}
export interface IGetInventoryPayload {
	shop: string;
	items: string[];
	locations: IDistributionCenterPayload[];
}

export interface IGetInventoryResponseData
	extends Omit<IGetInventoryPayload, 'items'> {
	items: {
		brand: string | null;
		sku: string;
		quantity: number;
		item_found: boolean;
		supersede_sku: null | string;
		supersede_quantity: 0;
		supersede_found: boolean;
		has_error: boolean;
		message: string | null;
	};
}

export interface IGetInventoryResponse {
	has_inventory: boolean;
	has_supersedes: boolean;
	transactionKey: string;
	supersedes: string[];
	results: IGetInventoryResponseData[];
}
