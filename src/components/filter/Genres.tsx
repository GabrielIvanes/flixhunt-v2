import { Filters, Genre } from '../../utils/interface';

interface Props {
	genres: Genre[];
	filters: Filters;
	isGenreInFilter: (genre: Genre, filters: Filters) => boolean;
	handleGenreClick: (genre: Genre, filters: Filters) => void;
}

function Genres({ genres, filters, isGenreInFilter, handleGenreClick }: Props) {
	return (
		<section>
			<h1>Genres</h1>
			<div className='genres'>
				{genres.map((genre) => (
					<div
						key={genre.id}
						className={
							isGenreInFilter(genre, filters)
								? 'filter-genre clickable'
								: 'clickable'
						}
						onClick={() => handleGenreClick(genre, filters)}
					>
						{genre.name}
					</div>
				))}
			</div>
		</section>
	);
}

export default Genres;
