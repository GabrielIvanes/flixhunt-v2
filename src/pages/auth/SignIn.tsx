import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

import { FormSignIn, UserList } from '../../utils/interface';
import PasswordInput from '../../components/form/PasswordInput';

interface Props {
	backBaseUrl: string;
	setUserId: (id: string) => void;
	setXsrfToken: (xsrf: string) => void;
}

function SignIn({ backBaseUrl, setUserId, setXsrfToken }: Props) {
	const [formSignIn, setFormSignIn] = useState<FormSignIn>({
		email: '',
		password: '',
	});
	const [error, setError] = useState<string>();
	const navigate = useNavigate();

	async function handleSubmitForm(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault();

		try {
			const response = await axios.post(
				`${backBaseUrl}/api/user/signin`,

				{
					email: formSignIn.email,
					password: formSignIn.password,
				},
				{
					withCredentials: true,
				}
			);
			console.log(response.data);
			setUserId(response.data.user);

			const xsrfToken = response.data.xsrfToken;
			localStorage.setItem('xsrfToken', JSON.stringify(xsrfToken));
			setXsrfToken(xsrfToken);

			const userLists: UserList[] = await getUserLists(
				response.data.user,
				xsrfToken
			);

			if (userLists.length === 0) {
				createDefaultLists(response.data.user, xsrfToken);
			}

			navigate('/');
			window.scrollTo(0, 0);
		} catch (err) {
			console.error(err);
			if (axios.isAxiosError(err)) {
				if (err.response) {
					setError(err.response.data.message);
				}
			}
			localStorage.setItem('xsrfToken', '');
			setUserId('');
		}
	}

	async function createDefaultLists(userId: string, xsrfToken: string) {
		try {
			for (const name of ['Like', 'Watchlist', 'Seen', 'TheaterSeen']) {
				await axios.post(
					`${backBaseUrl}/api/lists/add`,
					{
						name: name,
						userId: userId,
					},
					{
						headers: {
							'x-xsrf-token': xsrfToken,
						},
						withCredentials: true,
					}
				);
			}
		} catch (err) {
			console.error(err);
		}
	}

	async function getUserLists(userId: string, xsrfToken: string) {
		try {
			const response = await axios.get(
				`${backBaseUrl}/api/lists/userId/${userId}`,
				{
					headers: {
						'x-xsrf-token': xsrfToken,
					},
					withCredentials: true,
				}
			);
			return response.data;
		} catch (err) {
			console.error(err);
			return 0;
		}
	}

	return (
		<div className='auth-wrapper'>
			<div className='card'>
				<h1>Sign in</h1>
				<form onSubmit={(event) => handleSubmitForm(event)}>
					<div className='form-group'>
						<input
							id='input-email-signin'
							type='email'
							placeholder='Email'
							value={formSignIn.email}
							onChange={(event) =>
								setFormSignIn({ ...formSignIn, email: event.target.value })
							}
						/>
					</div>
					<PasswordInput<FormSignIn>
						nameOfFormContainer='signin'
						form={formSignIn}
						setForm={setFormSignIn}
						isConfirmPassword={false}
					/>
					<div className='form-group'>
						<input type='submit' value='Sign in' />
					</div>
					{error !== '' && <div className='error'>{error}</div>}
				</form>

				<div className='card-bottom'>
					<p>Don't have an account yet ?</p>
					<Link to='/signup'>Create an account</Link>
				</div>
			</div>
		</div>
	);
}

export default SignIn;
