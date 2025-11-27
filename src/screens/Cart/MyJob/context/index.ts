import { StackNavigationProp } from '@react-navigation/stack';
import { CartStackParamList } from '@/types/navigation';
import { createContext } from 'react';

interface IMyJobContext {
	navigation: StackNavigationProp<CartStackParamList, 'MyJob'> | null;
}

const defaultContext: IMyJobContext = {
	navigation: null,
};
export const MyJobContext = createContext<IMyJobContext>(defaultContext);
