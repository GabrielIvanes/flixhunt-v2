import loader from '../../assets/images/loader.svg';
import './loader.css';

function Loader() {
	return (
		<div className='loader-wrapper wrapper'>
			<img src={loader} alt='loader' />
		</div>
	);
}

export default Loader;
