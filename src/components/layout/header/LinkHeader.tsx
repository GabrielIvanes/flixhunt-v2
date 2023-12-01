import { Link } from 'react-router-dom';

interface Props {
	locationPathname: string;
	path: string;
	name: string;
}

function LinkHeader({ locationPathname, path, name }: Props) {
	return (
		<Link
			to={`${path}`}
			className={locationPathname === path ? 'nav-active nav-path' : 'nav-path'}
		>
			{name}
		</Link>
	);
}

export default LinkHeader;
