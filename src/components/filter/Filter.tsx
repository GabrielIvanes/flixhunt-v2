import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { useState } from 'react';

import './filter.scss';
import { Filters, Genre } from '../../utils/interface';
import Genres from './Genres';
import Date from './Date';
import Vote from './Vote';

interface Props {
	genres: Genre[];
	filters: Filters;
	setFilters: (filters: Filters) => void;
	setShowFilters: (b: boolean) => void;
}

function Filter({ genres, filters, setFilters, setShowFilters }: Props) {
	const [showDateSpecific, setShowDateSpecific] = useState<boolean>(false);

	function isGenreInFilter(genre: Genre, filters: Filters) {
		return filters.genres.some((filterGenre) => filterGenre.id === genre.id);
	}

	function handleGenreClick(genre: Genre, filters: Filters) {
		const genreInFilter = isGenreInFilter(genre, filters);

		const updatedFilters = { ...filters };

		if (genreInFilter) {
			updatedFilters.genres = filters.genres.filter(
				(filterGenre) => filterGenre.id !== genre.id
			);
		} else {
			updatedFilters.genres = [...filters.genres, genre];
		}
		setFilters(updatedFilters);
	}

	function handleDateChange(
		newDate: string,
		filters: Filters,
		dateChange: string
	) {
		const updatedFilters = { ...filters };

		if (dateChange === 'gte') updatedFilters.date_gte = newDate;
		else if (dateChange === 'lte') updatedFilters.date_lte = newDate;
		else updatedFilters.date = newDate;

		setFilters(updatedFilters);
	}

	function handleVoteChange(
		voteChange: string,
		value: number,
		filters: Filters
	) {
		const updatedFilters = { ...filters };

		if (voteChange === 'rate_gte') updatedFilters.rate_gte = value;
		else if (voteChange === 'rate_lte') updatedFilters.rate_lte = value;
		else if (voteChange === 'vote_gte') updatedFilters.vote_gte = value;
		else if (voteChange === 'vote_lte') updatedFilters.vote_lte = value;

		setFilters(updatedFilters);
	}

	return (
		<div className='filter'>
			<div className='xmark'>
				<FontAwesomeIcon
					icon={faXmark}
					style={{ cursor: 'pointer' }}
					onClick={() => setShowFilters(false)}
				/>
			</div>
			<div className='card'>
				<Genres
					genres={genres}
					filters={filters}
					isGenreInFilter={isGenreInFilter}
					handleGenreClick={handleGenreClick}
				/>
				<hr />
				<Date
					showDateSpecific={showDateSpecific}
					filters={filters}
					handleDateChange={handleDateChange}
					setShowDateSpecific={setShowDateSpecific}
					setFilters={setFilters}
				/>
				<hr />
				<Vote filters={filters} handleVoteChange={handleVoteChange} />
			</div>
		</div>
	);
}

export default Filter;
