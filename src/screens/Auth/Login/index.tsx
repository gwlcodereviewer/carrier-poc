import React, {
	FC,
	FunctionComponent,
	ReactElement,
	useEffect,
	useState,
} from 'react';
import {
	ActivityIndicator,
	KeyboardAvoidingView,
	Platform,
	TouchableOpacity,
	View,
	YellowBox,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';

import Button from '@/components/molecules/Button';
import { useAppDispatch } from '@/app/store';
import { clearError, sendLoginRequest } from '@/reducers/authReducer';
import { ApplicationStackParamList, AuthScreenProps } from '@/types/navigation';
import { useSelector } from 'react-redux';
import { RootState } from '@/app/rootReducer';
import { useGlobalHeaderContext, ANIMATION_STOP_POINTS } from '@/contexts';
import { SafeScreen } from '@/components/template';
import { Checkbox } from '@/components/atoms';
import { useTheme } from '@/theme';
import { Text } from '@/components/atoms/Text';
import { TextInputWithTitle } from '@/components/molecules';
import EyeClosed from '@/theme/assets/images/eye_closed.png';
import EyeOpen from '@/theme/assets/images/eye_open.png';
import styles from './styles';

const Login: FC<AuthScreenProps<'Login'>> = ({ navigation }): ReactElement => {
	const dispatch = useAppDispatch();
	const { backgrounds } = useTheme();
	const [isSubmitting, setIsSubmitting] = useState(false);

	const { updateStopPoint } = useGlobalHeaderContext();

	useEffect(() => {
		if (navigation.isFocused()) {
			updateStopPoint(ANIMATION_STOP_POINTS.SIGN_IN);
		}
	}, [navigation, updateStopPoint]);

	const { authError, isLoading } = useSelector(
		(state: RootState) => state.auth,
	);

	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const [hidePassword, setHidePassword] = useState(true);

	const [errorMessage, setErrorMessage] = useState<string | null>(null);

	useEffect(() => {
		if (isLoading) {
			setIsSubmitting(true);
		}
	}, [isLoading]);
	useEffect(() => {
		if (authError) {
			dispatch(clearError());
		}
		setErrorMessage(null);
	}, [username, password]);

	useEffect(() => {
		if (authError) {
			setIsSubmitting(false);
			setErrorMessage(authError);
		}
	}, [authError]);
	const onLogin = () => {
		// navigation.navigate('Search')
		if (!username) {
			setErrorMessage('Please enter username');
			return;
		}
		if (!password) {
			setErrorMessage('Please enter password');
			return;
		}
		setIsSubmitting(true);
		dispatch(
			sendLoginRequest(username, password, () => {
				setTimeout(() => {
					setIsSubmitting(false);
				}, 1000);
			}),
		);
	};

	return (
		<SafeScreen>
			<View style={styles.formFields}>
				<TextInputWithTitle
					title="User Name"
					value={username}
					onChangeText={setUsername}
					placeholder=""
					autoCapitalize="none"
					autoComplete="email"
					autoCorrect={false}
					inputMode="email"
					keyboardType={
						Platform.OS === 'ios' ? 'ascii-capable' : 'visible-password'
					}
					error={errorMessage !== null}
				/>
				<TextInputWithTitle
					title="Password"
					value={password}
					onChangeText={setPassword}
					placeholder=""
					autoCapitalize="none"
					autoCorrect={false}
					keyboardType={
						Platform.OS === 'ios' ? 'ascii-capable' : 'visible-password'
					}
					secureTextEntry={hidePassword}
					rightIcon={hidePassword ? EyeClosed : EyeOpen}
					onRightIconPress={() => setHidePassword(prev => !prev)}
					error={errorMessage !== null}
				/>
				<View style={styles.errorContainer}>
					<Text size="size_14" color="error" weight="light">
						{errorMessage}
					</Text>
				</View>
				<TouchableOpacity
					style={styles.forgotPassword}
					onPress={() => console.log('hello')}
				>
					<Text size="size_14" color="tertiary" weight="light">
						Forgot Password?
					</Text>
				</TouchableOpacity>
			</View>
			<View style={styles.footer}>
				<Button
					title={isSubmitting ? '' : 'LOG IN'}
					onPress={onLogin}
					containerStyle={styles.loginButton}
				>
					{isSubmitting && <ActivityIndicator />}
				</Button>
				<View style={styles.signUpContainer}>
					<Text size="size_14" color="black" weight="light">
						Don't have an account?
					</Text>
					<TouchableOpacity onPress={() => console.log('Sign up')}>
						<Text size="size_16" color="tertiary" weight="bold">
							Sign Up
						</Text>
					</TouchableOpacity>
				</View>
			</View>
		</SafeScreen>
	);
};

export default Login;
