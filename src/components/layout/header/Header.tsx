import { Link, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';

import { User } from '../../../utils/interface';
import Logo from '../../../assets/images/logo.png';
import navLinks from './nav.json';
import LinkHeader from './LinkHeader';

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
			username: 'Gabriel',
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

	function handleNavPhoneCLick() {
		setIsNavigationOpen(!isNavigationOpen);
	}

	window.addEventListener('scroll', handleScroll);
	window.addEventListener('resize', handleResize);

	return (
		<header
			style={isScrolled || isAuthPage ? { backdropFilter: 'blur(10px)' } : {}}
		>
			{isAuthPage ? (
				<div className='auth-header'>
					<img src={Logo} alt='logo' width={'40px'} height={'40px'} />
					<span className='second-font'>Flixhunt</span>
				</div>
			) : (
				<>
					<nav>
						<Link to='/'>
							<img src={Logo} alt='logo' width={'40px'} height={'40px'} />
							<span className='second-font'>Flixhunt</span>
						</Link>
						{isNavigationOpen && (
							<ul>
								{navLinks.navigation.map(
									(navLink: { path: string; name: string }) => (
										<li key={navLink.name}>
											<LinkHeader
												locationPathname={location.pathname.substring(1)}
												path={navLink.path}
												name={navLink.name}
											/>
										</li>
									)
								)}
							</ul>
						)}
					</nav>

					<div className='header-user-wrapper'>
						<span className='second-font'>{user.username}</span>
						<img
							src={`${frontBaseUrl}/src/assets/images/${user.image}`}
							alt='1'
							width={'40px'}
							height={'40px'}
						/>
						{responsive && !isNavigationOpen && (
							<div className='nav-phone-open' onClick={handleNavPhoneCLick}>
								&#8801;
							</div>
						)}
					</div>

					{responsive && isNavigationOpen && (
						<div className='nav-phone-close' onClick={handleNavPhoneCLick}>
							&#10006;
						</div>
					)}
				</>
			)}
		</header>
	);
}

export default Header;
