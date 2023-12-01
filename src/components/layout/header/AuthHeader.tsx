import Logo from '../../../assets/images/logo.png';

function AuthHeader() {
	return (
		<div className='auth-header'>
			<img src={Logo} alt='logo' width={'40px'} height={'40px'} />
			<span className='second-font'>Flixhunt</span>
		</div>
	);
}

export default AuthHeader;
