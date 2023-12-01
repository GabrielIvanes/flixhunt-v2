import { useState } from 'react';
import { FormSignUp } from '../../utils/interface';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

interface Props<T> {
	nameOfFormContainer: string;
	form: T;
	setForm: React.Dispatch<React.SetStateAction<T>>;
	isConfirmPassword: boolean;
}
function PasswordInput<T>({
	nameOfFormContainer,
	form,
	setForm,
	isConfirmPassword,
}: Props<T>) {
	const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);

	function isOtherPasswordVisible() {
		const signUpVerifyPassword = document.getElementById(
			'input-password-confirm-signup'
		);
		const signUpPassword = document.getElementById('input-password-signup');
		switch (nameOfFormContainer) {
			case 'signup':
				if (
					signUpVerifyPassword &&
					signUpVerifyPassword instanceof HTMLInputElement
				)
					return signUpVerifyPassword.type === 'text';
				else return false;

			case 'confirm-signup':
				if (signUpPassword && signUpPassword instanceof HTMLInputElement)
					return signUpPassword.type === 'text';
				else return false;
			default:
				return false;
		}
	}

	function handleChangePassword(password: string) {
		if (isConfirmPassword) setForm({ ...form, confirmPassword: password });
		else
			setForm({
				...form,
				password: password,
			});
	}

	return (
		<div className='form-group input-password-wrapper'>
			{isPasswordVisible ? (
				<>
					<input
						id={`input-password-${nameOfFormContainer}`}
						type='text'
						value={
							isConfirmPassword
								? (form as FormSignUp).confirmPassword
								: (form as FormSignUp).password
						}
						onChange={(event) => {
							handleChangePassword(event.target.value);
						}}
						placeholder={isConfirmPassword ? 'Confirm password' : 'Password'}
					/>
					<FontAwesomeIcon
						icon={faEyeSlash}
						onClick={() =>
							!isOtherPasswordVisible() && setIsPasswordVisible(false)
						}
						className='password-icon'
					/>
				</>
			) : (
				<>
					<input
						id={`input-password-${nameOfFormContainer}`}
						type='password'
						value={
							isConfirmPassword
								? (form as FormSignUp).confirmPassword
								: (form as FormSignUp).password
						}
						onChange={(event) => {
							handleChangePassword(event.target.value);
						}}
						placeholder={isConfirmPassword ? 'Confirm password' : 'Password'}
					/>
					<FontAwesomeIcon
						icon={faEye}
						onClick={() =>
							!isOtherPasswordVisible() && setIsPasswordVisible(true)
						}
						className='password-icon'
					/>
				</>
			)}
		</div>
	);
}

export default PasswordInput;
