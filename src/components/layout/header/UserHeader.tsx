import { User } from '../../../utils/interface';

interface Props {
	frontBaseUrl: string;
	user: User;
	responsive: boolean;
	isNavigationOpen: boolean;
	handleNavPhoneClick: () => void;
	showParameters: boolean;
	setShowParameters: (bool: boolean) => void;
}

function UserHeader({
	frontBaseUrl,
	user,
	responsive,
	isNavigationOpen,
	handleNavPhoneClick,
	showParameters,
	setShowParameters,
}: Props) {
	return (
		<div className='header-user-wrapper'>
			<span
				className='second-font'
				onClick={() => setShowParameters(!showParameters)}
			>
				{user?.username}
			</span>
			<img
				src={`${frontBaseUrl}/src/assets/images/profile_picture/${user?.image}`}
				alt={user.username}
				width={'40px'}
				height={'40px'}
				onClick={() => setShowParameters(!showParameters)}
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
