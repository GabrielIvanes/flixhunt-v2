import { useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';

import { User } from '../../../utils/interface';
import AuthHeader from './AuthHeader';
import NavigationHeader from './NavigationHeader';
import UserHeader from './UserHeader';
import '../layout.scss';
import Parameters from '../../parameters/Parameters';

interface Props {
	frontBaseUrl: string;
	backBaseUrl: string;
	userId: string;
	xsrfToken: string;
}

function Header({ frontBaseUrl, backBaseUrl, userId, xsrfToken }: Props) {
	const [user, setUser] = useState<User>({
		id: '',
		username: '',
		image: '',
	});
	const [isAuthPage, setIsAuthPage] = useState<boolean>(false);
	const [isScrolled, setIsScrolled] = useState<boolean>(false);
	const [responsive, setResponsive] = useState<boolean>(false);
	const [isNavigationOpen, setIsNavigationOpen] = useState<boolean>(false);
	const [showParameters, setShowParameters] = useState<boolean>(false);
	const location = useLocation();
	const navigate = useNavigate();

	async function getUser(id: string) {
		try {
			const response = await axios.get(`${backBaseUrl}/api/user/${id}`, {
				headers: {
					'x-xsrf-token': xsrfToken,
				},
				withCredentials: true,
			});
			console.log(response);

			setUser({
				id: userId,
				username: response.data.username,
				image: response.data.image,
			});
		} catch (err) {
			console.error(err);
		}
	}

	useEffect(() => {
		if (userId !== '') getUser(userId);
	}, [userId]);

	useEffect(() => {
		const locationPath = location.pathname.substring(1);

		if (locationPath === 'signin' || locationPath === 'signup')
			setIsAuthPage(true);
		else setIsAuthPage(false);

		handleResize();
	}, [location.pathname]);

	function handleScroll() {
		if (window.scrollY > 0) {
			setIsScrolled(true);
		} else {
			setIsScrolled(false);
		}
	}

	function handleResize() {
		setResponsive(window.innerWidth < 900);
		setIsNavigationOpen(window.innerWidth > 900);
	}

	function handleNavPhoneClick() {
		setIsNavigationOpen(!isNavigationOpen);
	}

	async function logout() {
		try {
			await axios.get(`${backBaseUrl}/api/user/logout`, {
				withCredentials: true,
			});
			navigate('/signin');
		} catch (err) {
			console.error(err);
		}
	}

	window.addEventListener('scroll', handleScroll);
	window.addEventListener('resize', handleResize);

	return (
		<header
			style={isScrolled || isAuthPage ? { backdropFilter: 'blur(20px)' } : {}}
		>
			{isAuthPage ? (
				<AuthHeader />
			) : (
				<>
					<NavigationHeader isNavigationOpen={isNavigationOpen} />

					<UserHeader
						frontBaseUrl={frontBaseUrl}
						user={user}
						responsive={responsive}
						isNavigationOpen={isNavigationOpen}
						handleNavPhoneClick={handleNavPhoneClick}
						showParameters={showParameters}
						setShowParameters={setShowParameters}
					/>

					{responsive && isNavigationOpen && (
						<div className='nav-phone-close' onClick={handleNavPhoneClick}>
							&#10006;
						</div>
					)}
					{showParameters && (
						<Parameters logout={logout} setShowParameters={setShowParameters} />
					)}
				</>
			)}
		</header>
	);
}

export default Header;
