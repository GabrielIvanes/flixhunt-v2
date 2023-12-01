import { Link } from 'react-router-dom';

import Logo from '../../../assets/images/logo.png';
import navLinks from './nav.json';
import LinkHeader from './LinkHeader';

interface Props {
	isNavigationOpen: boolean;
}

function Navigation({ isNavigationOpen }: Props) {
	return (
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
	);
}

export default Navigation;
