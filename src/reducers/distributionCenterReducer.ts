import { DistributionCenter } from '@/api/inventory/types';
import { createSlice } from '@reduxjs/toolkit';

export interface DistributionCenterState {
	readonly shop: string;
	readonly distributionCenter: DistributionCenter;
}

const distributionSlice = createSlice({
	name: 'distributionCenter',
	initialState: {
		shop: 'rchvactest.myshopify.com',
		distributionCenter: {
			hvacid: '2301',
			name: 'North East Distribution, Long Island City',
			geocode_longitude: '-73.939770000000000',
			geocode_latitude: '40.738048000000000',
			branch_number: '0701',
			region_code: '1NE',
			address: {
				address: '5201 29th St',
				apt_suite: '',
				city: 'Long Island City',
				state: 'NY',
				zip: '11101-3258',
				country: 'US',
				phone: '(718) 472-0200',
			},
			full_address: '5201 29th St Long Island City NY 11101-3258 US',
		} as unknown as DistributionCenter,
	} as DistributionCenterState,
	reducers: {},
});

export default distributionSlice.reducer;
