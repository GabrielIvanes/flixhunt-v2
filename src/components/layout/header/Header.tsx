import { useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';

import { User } from '../../../utils/interface';
import AuthHeader from './AuthHeader';
import NavigationHeader from './NavigationHeader';
import UserHeader from './UserHeader';

interface Props {
	frontBaseUrl: string;
}

function Header({ frontBaseUrl }: Props) {
	const [user, setUser] = useState<User>({
		id: 0,
		username: '',
		image: '',
	});
	const [isAuthPage, setIsAuthPage] = useState<boolean>(false);
	const [isScrolled, setIsScrolled] = useState<boolean>(false);
	const [responsive, setResponsive] = useState<boolean>(false);
	const [isNavigationOpen, setIsNavigationOpen] = useState<boolean>(false);
	const location = useLocation();

	useEffect(() => {
		const locationPath = location.pathname.substring(1);

		if (locationPath === 'signin' || locationPath === 'signup')
			setIsAuthPage(true);
		else setIsAuthPage(false);

		setUser({
			id: 1,
			username: 'John Doe',
			image: '1.png',
		});

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
					/>

					{responsive && isNavigationOpen && (
						<div className='nav-phone-close' onClick={handleNavPhoneClick}>
							&#10006;
						</div>
					)}
				</>
			)}
		</header>
	);
}

export default Header;
