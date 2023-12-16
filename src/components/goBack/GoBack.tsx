import { useNavigate } from 'react-router-dom';
import './goBack.scss';

function GoBack() {
	const navigate = useNavigate();

	return (
		<button
			className='go-back'
			onClick={() => {
				console.log('ok');
				navigate(-1);
			}}
		>
			&#60;
		</button>
	);
}

export default GoBack;
