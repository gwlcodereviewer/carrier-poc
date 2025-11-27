import { View } from 'react-native';
import { FC, useCallback, useContext } from 'react';
import { styles } from '@/screens/Cart/MyJob/components/BalanceOverlay/styles';
import { useTheme } from '@/theme';
import { Text } from '@/components/atoms';
import { Button } from '@/components/molecules';
import { useSelector } from 'react-redux';
import { RootState } from '@/app/rootReducer';
import { MyJobContext } from '@/screens/Cart/MyJob/context';
import { useAppDispatch } from '@/app/store';
import { IDraftOrderInput } from '@/api/cart/types';
import { checkoutWithLineOfCredit } from '@/reducers/cartReducer';
import { useToast } from '@/contexts/ToastContext';
import { TOAST_TYPES } from '@/constant/utils';
import { common } from '@/translations/en';

interface Props {}

const { toastMessage } = common;

export const BalanceOverlay: FC<Props> = ({}) => {
	const { backgrounds, borders } = useTheme();
	const dispatch = useAppDispatch();
	const {
		cartState: { cart },
		isApplyingLineOfCredit,
	} = useSelector((state: RootState) => state.cart);
	const { authCustomer } = useSelector((state: RootState) => state.auth);
	const { navigation } = useContext(MyJobContext);
	const showToast = useToast();

	const getDraftOrderInput = useCallback<
		() => IDraftOrderInput | undefined
	>(() => {
		if (!authCustomer) return undefined;
		return {
			billingAddress: {
				address1: authCustomer.defaultAddress.address1,
				address2: authCustomer.defaultAddress.address2,
				city: authCustomer.defaultAddress.city,
				zip: authCustomer.defaultAddress.zip,
				province: authCustomer.defaultAddress.province,
				country: authCustomer.defaultAddress.country,
				firstName: authCustomer.defaultAddress.firstName,
				lastName: authCustomer.defaultAddress.lastName,
				company: authCustomer.defaultAddress.company,
			},
			customerId: authCustomer.id,
			email: authCustomer.email,
			lineItems:
				cart?.lines.edges.map(({ node: lineItem }) => ({
					variantId: lineItem.merchandise.id,
					quantity: lineItem.quantity,
					customAttributes: lineItem.attributes,
				})) || [],
			shippingAddress: {
				address1: authCustomer.defaultAddress.address1,
				address2: authCustomer.defaultAddress.address2,
				city: authCustomer.defaultAddress.city,
				zip: authCustomer.defaultAddress.zip,
				province: authCustomer.defaultAddress.province,
				country: authCustomer.defaultAddress.country,
				firstName: authCustomer.defaultAddress.firstName,
				lastName: authCustomer.defaultAddress.lastName,
				company: authCustomer.defaultAddress.company,
			},
			useCustomerDefaultAddress: true,
			visibleToCustomer: true,
		};
	}, [cart, authCustomer]);

	return (
		<View style={[styles.container, backgrounds.tint_blue]}>
			<View style={[styles.balanceRow, borders.primary_light_blue]}>
				<Text size="size_22" color="primary" weight="regular">
					{cart?.totalQuantity || 0}{' '}
					<Text size="size_12" color="dark_grey" weight="light">
						orders in My Job
					</Text>
				</Text>
				<Text size="size_22" color="tertiary" weight="regular">
					${' '}
					<Text size="size_22" color="tertiary" weight="bold">
						{cart?.cost?.subtotalAmount?.amount || 0}
					</Text>
				</Text>
			</View>
			<View style={styles.paymentMethodContainer}>
				<Text
					size="size_12"
					color="dark_grey"
					weight="light"
					style={styles.paymentText}
				>
					Choose your payment method
				</Text>
				<View style={styles.buttonContainer}>
					<Button
						onPress={() =>
							navigation
								?.getParent()
								?.navigate('Common', { screen: 'Checkout' })
						}
						title="Credit Card"
						backgroundColor="primary_light_blue"
						containerStyle={styles.button}
					/>
					<Button
						onPress={() => {
							const draftOrderInput = getDraftOrderInput();
							if (!draftOrderInput || !cart) return;
							const lineIds =
								cart.lines.edges.map(({ node: lineItem }) => lineItem.id) || [];
							dispatch(
								checkoutWithLineOfCredit(
									draftOrderInput,
									lineIds,
									cart.id,
									() => {
										showToast(
											TOAST_TYPES.warning,
											toastMessage.lineOfCreditSuccess,
										);
									},
									() => {
										showToast(
											TOAST_TYPES.alert,
											toastMessage.lineOfCreditError,
										);
									},
								),
							);
						}}
						title="Invoice"
						backgroundColor="primary_light_blue"
						containerStyle={styles.button}
					/>
				</View>
			</View>
		</View>
	);
};
