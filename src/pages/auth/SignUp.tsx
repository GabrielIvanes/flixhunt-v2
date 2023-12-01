import { useState } from 'react';
import { Link } from 'react-router-dom';

import { FormSignUp } from '../../utils/interface';
import PasswordInput from '../../components/form/PasswordInput';

function SignUp() {
	const [formSignUp, setFormSignUp] = useState<FormSignUp>({
		email: '',
		password: '',
		confirmPassword: '',
		username: '',
	});
	return (
		<div className='auth-wrapper'>
			<div className='card'>
				<h1>Sign up</h1>
				<form>
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
