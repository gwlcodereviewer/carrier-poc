import { LocalStorageCart } from '@/api/cart/types';
import { LocalStorage } from '@/constant';
import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Get the cart id from local storage
 */
export const getCartInStorage = async (
	customerId: string,
	countryCode: string,
): Promise<string | undefined> => {
	const cartsInStorage = await AsyncStorage.getItem(LocalStorage.CARTS);
	let cartObjInStorage: LocalStorageCart = {};
	try {
		cartObjInStorage = JSON.parse(cartsInStorage as any) || {};
	} catch (err) {
		console.error('Error parsing cart from local storage', err);
	}
	if (cartObjInStorage && cartObjInStorage[customerId]) {
		return cartObjInStorage[customerId][countryCode];
	}
	return undefined;
};

export const setCartInStorage = async (
	customerId: string,
	countryCode: string,
	cartId: string,
) => {
	const cartsInStorage = await AsyncStorage.getItem(LocalStorage.CARTS);
	let cartObjInStorage: LocalStorageCart = {};
	try {
		cartObjInStorage = JSON.parse(cartsInStorage as any) || {};
	} catch (err) {
		console.error('Error parsing cart from local storage', err);
	}
	cartObjInStorage[customerId] = {
		...cartObjInStorage[customerId],
		[countryCode]: cartId,
	};
	await AsyncStorage.setItem(
		LocalStorage.CARTS,
		JSON.stringify(cartObjInStorage),
	);
};
