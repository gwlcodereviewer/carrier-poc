import React from 'react';
import Animated from 'react-native-reanimated';

/**
 * Name: TOAST_TYPES
 * Desc: Constant declaration for toast types
 */
export const TOAST_TYPES = {
	success: 'success',
	warning: 'warning',
	info: 'info',
	alert: 'alert',
};

// This HOC takes a function component and return an animated version
export function createAnimatedFunctionComponent<P>(
	Component: React.ComponentType<P>,
) {
	// Function components have to be wrapped with React.forwardRef()
	// https://docs.swmansion.com/react-native-reanimated/docs/core/createAnimatedComponent/#component
	const FunctionComponentWithRef = React.forwardRef<React.Component, P>(
		(props, ref) => (
			// Use React.forwardRef to forward the ref to the Component
			<Component {...props} innerRef={ref} />
		),
	);

	return Animated.createAnimatedComponent(FunctionComponentWithRef);
}
