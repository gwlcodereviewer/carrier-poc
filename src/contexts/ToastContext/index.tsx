import { CustomToast } from '@/components/molecules/CustomToast';
import React, { createContext, useContext, useState } from 'react';

interface IToastContextProp {
	showToast: (type: string, message: string) => void;
}

interface Props {
	children?: React.ReactNode;
}

const ToastContext = createContext<IToastContextProp>(null as any);

export function ToastProvider({ children }: Props) {
	const [toastContent, setToastContent] = useState<string>('');
	const [toastType, setToastType] = useState<string>('');

	/**
	 * Name: showToast
	 * Desc: Function to trigger on show toast
	 * @param {string} type - Type of toast
	 * @param {string} message - message to be shown on toast
	 */
	const showToast = (type: string, message: string) => {
		setToastType(type);
		setToastContent(message);
	};

	/**
	 * Name: hideToast
	 * Desc: Function to trigger on hide toast
	 */
	const hideToast = () => {
		setToastContent('');
	};

	return (
		<ToastContext.Provider value={{ showToast }}>
			{children}
			{toastContent && (
				<CustomToast
					message={toastContent}
					toastType={toastType}
					hideToast={hideToast}
				/>
			)}
		</ToastContext.Provider>
	);
}

/**
 * Name: useToast
 * Desc: Function to use the toast context
 */
export const useToast = () => {
	const context = useContext(ToastContext);
	if (!context) {
		throw new Error('useToast must be used within a ToastProvider');
	}
	return context.showToast;
};
