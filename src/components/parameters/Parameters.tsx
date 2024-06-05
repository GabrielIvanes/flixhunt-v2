import './parameters.scss';

interface Props {
	logout: () => void;
	setShowParameters: (bool: boolean) => void;
}

function Parameters({ logout, setShowParameters }: Props) {
	return (
		<div
			className='parameters-wrapper clickable'
			onClick={() => {
				logout();
				setShowParameters(false);
			}}
		>
			Log out
		</div>
	);
}

export default Parameters;
