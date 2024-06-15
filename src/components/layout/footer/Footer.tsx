import tmdb from '../../../assets/images/tmdb.svg';

function Footer() {
	return (
		<footer>
			<div>
				<a href='https://www.themoviedb.org/'>
					<img src={tmdb} alt='TMDB logo' />
				</a>
				<div>
					This product uses the{' '}
					<a href='https://www.themoviedb.org/'>TMDB API</a> but is not endorsed
					or certified by TMDB.
				</div>
			</div>
		</footer>
	);
}

export default Footer;
