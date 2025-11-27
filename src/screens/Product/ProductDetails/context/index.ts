import { createContext } from 'react';
import { StackNavigationProp } from '@react-navigation/stack';
import { SearchStackParamList } from '@/types/navigation';
import { ICartLine } from '@/api/cart/types';
import {
	DistributionCenter,
	IGetInventoryResponse,
} from '@/api/inventory/types';

export interface IProductInfoContext {
	quantity: number;
	updateQuantity: (quantity: number) => void;
	navigation: StackNavigationProp<
		SearchStackParamList,
		'ProductDetails'
	> | null;
	lineItem?: ICartLine;
	selectedDistributionCenter: DistributionCenter | null;
	inventoryStatus: IGetInventoryResponse | null;
	deliveryMethod: 'shipto' | 'pickup';
	updateDeliveryMethod: (method: 'shipto' | 'pickup') => void;
}

export const ProductInfoContext = createContext<IProductInfoContext>({
	quantity: 0,
	updateQuantity: () => {},
	navigation: null,
	selectedDistributionCenter: null,
	inventoryStatus: null,
	deliveryMethod: 'shipto',
	updateDeliveryMethod: () => {},
});
