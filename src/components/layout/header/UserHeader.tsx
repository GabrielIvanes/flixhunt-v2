import { User } from '../../../utils/interface';

interface Props {
	frontBaseUrl: string;
	user: User;
	responsive: boolean;
	isNavigationOpen: boolean;
	handleNavPhoneClick: () => void;
}

function UserHeader({
	frontBaseUrl,
	user,
	responsive,
	isNavigationOpen,
	handleNavPhoneClick,
}: Props) {
	return (
		<div className='header-user-wrapper'>
			<span className='second-font'>{user?.username}</span>
			<img
				src={`${frontBaseUrl}/src/assets/images/${user?.image}`}
				alt='user'
				width={'40px'}
				height={'40px'}
			/>
			{responsive && !isNavigationOpen && (
				<div className='nav-phone-open' onClick={handleNavPhoneClick}>
					&#8801;
				</div>
			)}
		</div>
	);
}

export default UserHeader;
