import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

import { FormSignUp } from '../../utils/interface';
import PasswordInput from '../../components/form/PasswordInput';

interface Props {
	backBaseUrl: string;
}

function SignUp({ backBaseUrl }: Props) {
	const [formSignUp, setFormSignUp] = useState<FormSignUp>({
		email: '',
		password: '',
		confirmPassword: '',
		username: '',
	});
	const [error, setError] = useState<string>('');
	const navigate = useNavigate();

	async function handleSubmitForm(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault();

		const passwordRegex =
			/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,20}$/;

		if (formSignUp.password !== formSignUp.confirmPassword) {
			setError('Passwords do not match.');
		} else if (!formSignUp.password.match(passwordRegex)) {
			setError(
				'Your password must contain at least one lowercase and one uppercase letter, one digit, one special character and be between 8 and 20 characters'
			);
		} else {
			try {
				const response = await axios.post(`${backBaseUrl}/api/user/signup`, {
					username: formSignUp.username,
					email: formSignUp.email,
					password: formSignUp.password,
				});
				console.log(response.data);

				navigate('/signin');
				window.scrollTo(0, 0);
			} catch (err) {
				console.error(err);
				if (axios.isAxiosError(err)) {
					if (err.response) {
						setError(err.response.data.message);
					}
				}
			}
		}
	}

	return (
		<div className='auth-wrapper'>
			<div className='card'>
				<h1>Sign up</h1>
				<form onSubmit={(event) => handleSubmitForm(event)}>
					<div className='form-group'>
						<input
							id='input-email-signup'
							type='email'
							placeholder='Email'
							value={formSignUp.email}
							onChange={(event) =>
								setFormSignUp({ ...formSignUp, email: event.target.value })
							}
						/>
					</div>
					<div className='form-group'>
						<input
							id='input-username-signup'
							type='text'
							placeholder='Username'
							value={formSignUp.username}
							onChange={(event) =>
								setFormSignUp({ ...formSignUp, username: event.target.value })
							}
						/>
					</div>
					<PasswordInput<FormSignUp>
						nameOfFormContainer='signup'
						form={formSignUp}
						setForm={setFormSignUp}
						isConfirmPassword={false}
					/>
					<PasswordInput<FormSignUp>
						nameOfFormContainer='confirm-signup'
						form={formSignUp}
						setForm={setFormSignUp}
						isConfirmPassword={true}
					/>
					<div className='form-group'>
						<input type='submit' value='Sign up' />
					</div>
					{error !== '' && <div className='error'>{error}</div>}
				</form>
				<div className='card-bottom'>
					<p>Already have an account ?</p>
					<Link to='/signin'>Log in to your account</Link>
				</div>
			</div>
		</div>
	);
}

export default SignUp;
