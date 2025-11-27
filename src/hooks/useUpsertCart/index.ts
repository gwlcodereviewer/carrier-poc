import { useAppDispatch } from '@/app/store';
import { useSelector } from 'react-redux';
import { RootState } from '@/app/rootReducer';
import { useCallback } from 'react';
import { upsertCart } from '@/reducers/cartReducer';

export const useUpsertCart = () => {
	const dispatch = useAppDispatch();
	const {
		cartState: { cart },
	} = useSelector((state: RootState) => state.cart);
	const { authCustomer, customerAccessToken } = useSelector(
		(state: RootState) => state.auth,
	);
	const { distributionCenter } = useSelector(
		(state: RootState) => state.distributionCenter,
	);

	const updateOrCreateCart = useCallback(() => {
		if (authCustomer && distributionCenter && customerAccessToken) {
			dispatch(
				upsertCart(
					cart?.id || '',
					authCustomer.id,
					authCustomer.defaultAddress.countryCodeV2,
					{
						customerAccessToken,
						deliveryAddressPreferences: {
							deliveryAddress: {
								address1: authCustomer.defaultAddress.address1,
								address2: authCustomer.defaultAddress.address2,
								city: authCustomer.defaultAddress.city,
								company: authCustomer.defaultAddress.company,
								country: authCustomer.defaultAddress.country,
								firstName: authCustomer.defaultAddress.firstName,
								lastName: authCustomer.defaultAddress.lastName,
								province: authCustomer.defaultAddress.province,
								zip: authCustomer.defaultAddress.zip,
							},
						},
						countryCode: authCustomer.defaultAddress.countryCodeV2,
					},
				),
			);
		}
	}, [cart]);

	return { updateOrCreateCart };
};
