import { createContext, useContext } from 'react';
import { IAddress, IOrder } from '@/api/auth/types';
import { DistributionCenter } from '@/api/inventory/types';

export interface IAccountAddress {
	deliveryAddress: IAddress;
	pickupAddress: DistributionCenter | null;
}
export interface IMyAccountContext {
	defaultAddress: IAccountAddress | null;
	addresses: IAccountAddress[];
	orderHistory: IOrder[];
	currentOrders: IOrder[];
}

export const myAccountDefaultValues: IMyAccountContext = {
	defaultAddress: null,
	addresses: [],
	orderHistory: [],
	currentOrders: [],
};

export const MyAccountContext = createContext<IMyAccountContext>(
	myAccountDefaultValues,
);

export const useMyAccountContext = () => {
	const context = useContext(MyAccountContext);
	if (!context) {
		throw new Error('useAccountContext must be used within a AccountProvider');
	}
	return context;
};
