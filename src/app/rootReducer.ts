import { combineReducers } from '@reduxjs/toolkit';

import authReducer from '@/reducers/authReducer';
import productSearchReducer from '@/reducers/productSearchReducer';
import configReducer from '@/reducers/configReducer';
import cartReducer from '@/reducers/cartReducer';
import distributionCenterReducer from '@/reducers/distributionCenterReducer';

const rootReducer = combineReducers({
	auth: authReducer,
	config: configReducer,
	productSearch: productSearchReducer,
	cart: cartReducer,
	distributionCenter: distributionCenterReducer,
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
