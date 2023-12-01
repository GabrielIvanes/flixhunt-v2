import { useState } from 'react';
import { Link } from 'react-router-dom';

import { FormSignIn } from '../../utils/interface';
import PasswordInput from '../../components/form/PasswordInput';

function SignIn() {
	const [formSignIn, setFormSignIn] = useState<FormSignIn>({
		email: '',
		password: '',
	});
	return (
		<div className='auth-wrapper'>
			<div className='card'>
				<h1>Sign in</h1>
				<form>
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
