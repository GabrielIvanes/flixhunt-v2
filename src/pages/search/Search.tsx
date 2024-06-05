// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { useEffect, useState } from 'react';
import axios from 'axios';

import {
	SearchType,
	Movie,
	MultiSearch,
	TVShow,
	Person,
} from '../../utils/interface';
import Element from '../../components/element/Element';
import Pagination from '../../components/pagination/Pagination';

interface Props {
	backBaseUrl: string;
	TMDBBaseUrl: string;
	xsrfToken: string;
}

function Search({ backBaseUrl, TMDBBaseUrl, xsrfToken }: Props) {
	const [multiSearch, setMultiSearch] = useState<SearchType<MultiSearch>>();
	const [moviesSearch, setMoviesSearch] = useState<SearchType<Movie>>();
	const [TVShowsSearch, setTVShowsSearch] = useState<SearchType<TVShow>>();
	const [personsSearch, setPersonsSearch] = useState<SearchType<Person>>();

	const [elementsOnTheScreen, setElementsOnTheScreen] = useState<
		'movie' | 'tv' | 'person'
	>('movie');
	const [moviesPage, setMoviesPage] = useState<number>(1);
	const [TVShowsPage, setTVShowsPage] = useState<number>(1);
	const [personsPage, setPersonsPage] = useState<number>(1);
	const [moviesLastPage, setMoviesLastPage] = useState<number>(500);
	const [TVShowsLastPage, setTVShowsLastPage] = useState<number>(500);
	const [personsLastPage, setPersonsLastPage] = useState<number>(500);

	const [query, setQuery] = useState<string>('');
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const [_, setRender] = useState<boolean>(window.innerWidth > 500);

	window.addEventListener('resize', () => {
		setRender(window.innerWidth > 500);
	});

	async function search(query: string, type: string, page: number) {
		try {
			const response = await axios.post(
				`${backBaseUrl}/api/TMDB/search`,
				{
					query: query,
					type: type,
					page: page,
				},
				{
					headers: {
						'x-xsrf-token': xsrfToken,
					},
					withCredentials: true,
				}
			);

			console.log(response.data);

			switch (type) {
				case 'movie':
					setMoviesSearch(response.data);
					setMoviesLastPage(
						response.data.total_pages > 500 ? 500 : response.data.total_pages
					);
					break;
				case 'tv':
					setTVShowsSearch(response.data);
					setTVShowsLastPage(
						response.data.total_pages > 500 ? 500 : response.data.total_pages
					);
					break;
				case 'person':
					setPersonsSearch(response.data);
					setPersonsLastPage(
						response.data.total_pages > 500 ? 500 : response.data.total_pages
					);
					break;
				default:
					setMultiSearch(response.data);
					break;
			}
		} catch (err) {
			console.error(err);
		}
	}

	// useEffect(() => {
	// 	if (inputQuery && inputQuery.current) inputQuery.current.focus();
	// }, []);

	useEffect(() => {
		if (query !== '') {
			search(query, 'multi', 1);
		}
	}, [query]);

	useEffect(() => {
		query !== '' && search(query, 'movie', moviesPage);
	}, [moviesPage, query]);

	useEffect(() => {
		query !== '' && search(query, 'tv', TVShowsPage);
	}, [TVShowsPage, query]);

	useEffect(() => {
		query !== '' && search(query, 'person', personsPage);
	}, [personsPage, query]);

	useEffect(() => {
		if (multiSearch && multiSearch.total_results > 0)
			setElementsOnTheScreen(multiSearch.results[0].media_type);
	}, [multiSearch]);

	return (
		<div className='wrapper search'>
			<div className='left'>
				<div className='search-box'>
					<input
						type='text'
						value={query}
						onChange={(event) => setQuery(event.target.value)}
						autoFocus
					/>
					{/* <FontAwesomeIcon icon={faMagnifyingGlass} className='clickable' /> */}
				</div>

				<div className='right'>
					<div
						className={
							elementsOnTheScreen === 'movie' ? 'clickable active' : 'clickable'
						}
						onClick={() => setElementsOnTheScreen('movie')}
					>
						Movies{' '}
						{moviesSearch && query !== '' && `(${moviesSearch.total_results})`}
					</div>
					<div
						className={
							elementsOnTheScreen === 'tv' ? 'clickable active' : 'clickable'
						}
						onClick={() => setElementsOnTheScreen('tv')}
					>
						TV Shows{' '}
						{TVShowsSearch &&
							query !== '' &&
							`(${TVShowsSearch.total_results})`}
					</div>
					<div
						className={
							elementsOnTheScreen === 'person'
								? 'clickable active'
								: 'clickable'
						}
						onClick={() => setElementsOnTheScreen('person')}
					>
						Persons{' '}
						{personsSearch &&
							query !== '' &&
							`(${personsSearch.total_results})`}
					</div>
				</div>

				{elementsOnTheScreen === 'movie' && (
					<div className='elements'>
						{moviesSearch && moviesSearch.total_results > 0 && query !== '' ? (
							<>
								{moviesSearch.results.map((movie) => (
									<Element
										key={movie.id}
										elementId={movie.id}
										elementAdditionalInformation={
											movie.release_date && movie.release_date.slice(0, 4)
										}
										elementName={movie.title}
										elementNavigation={`/movies/${movie.id}`}
										elementPoster={
											movie.poster_path &&
											`${TMDBBaseUrl}original${movie.poster_path}`
										}
										posterWidth={window.innerWidth > 500 ? 200 : 125}
										posterHeight={window.innerWidth > 500 ? 300 : 187.5}
										scrollPosition={0}
									/>
								))}
								<Pagination
									page={moviesPage}
									setPage={setMoviesPage}
									lastPage={moviesLastPage}
								/>
							</>
						) : query === '' ? (
							<h1>Please write at least one character</h1>
						) : (
							<h1>No result found</h1>
						)}
					</div>
				)}
				{elementsOnTheScreen === 'tv' && (
					<div className='elements'>
						{TVShowsSearch &&
						TVShowsSearch.total_results > 0 &&
						query !== '' ? (
							<>
								{TVShowsSearch.results.map((tv) => (
									<Element
										key={tv.id}
										elementId={tv.id}
										elementAdditionalInformation={
											tv.first_air_date && tv.first_air_date.slice(0, 4)
										}
										elementName={tv.name}
										elementNavigation={`/tv/${tv.id}`}
										elementPoster={
											tv.poster_path &&
											`${TMDBBaseUrl}original${tv.poster_path}`
										}
										posterWidth={window.innerWidth > 500 ? 200 : 125}
										posterHeight={window.innerWidth > 500 ? 300 : 187.5}
										scrollPosition={0}
									/>
								))}
								<Pagination
									page={TVShowsPage}
									setPage={setTVShowsPage}
									lastPage={TVShowsLastPage}
								/>
							</>
						) : query === '' ? (
							<h1>Please write at least one character</h1>
						) : (
							<h1>No result found</h1>
						)}
					</div>
				)}
				{elementsOnTheScreen === 'person' && (
					<div className='elements'>
						{personsSearch &&
						personsSearch.total_results > 0 &&
						query !== '' ? (
							<>
								{personsSearch.results.map((person) => (
									<Element
										key={person.id}
										elementId={person.id}
										elementAdditionalInformation={
											person.known_for_department && person.known_for_department
										}
										elementName={person.name}
										elementNavigation={`/persons/${person.id}`}
										elementPoster={
											person.profile_path &&
											`${TMDBBaseUrl}original${person.profile_path}`
										}
										posterWidth={window.innerWidth > 500 ? 200 : 125}
										posterHeight={window.innerWidth > 500 ? 300 : 187.5}
										scrollPosition={0}
									/>
								))}
								<Pagination
									page={personsPage}
									setPage={setPersonsPage}
									lastPage={personsLastPage}
								/>
							</>
						) : query === '' ? (
							<h1>Please write at least one character</h1>
						) : (
							<h1>No result found</h1>
						)}
					</div>
				)}
			</div>
		</div>
	);
}

export default Search;
