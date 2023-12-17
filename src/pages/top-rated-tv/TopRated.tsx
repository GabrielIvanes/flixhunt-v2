/* eslint-disable no-mixed-spaces-and-tabs */
import { useState, useEffect } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilter } from '@fortawesome/free-solid-svg-icons';
import { useLocation } from 'react-router-dom';

import Element from '../../components/element/Element';
import { Filters, Genre, TVShowsByPage } from '../../utils/interface';
import Pagination from '../../components/pagination/Pagination';
import Loader from '../../components/loader/Loader';
import Filter from '../../components/filter/Filter';

interface Props {
	backBaseUrl: string;
	TMDBBaseUrl: string;
}

function TopRated({ backBaseUrl, TMDBBaseUrl }: Props) {
	const [page, setPage] = useState<number>(1);
	const [lastPage, setLastPage] = useState<number>(500);
	const [genres, setGenres] = useState<Genre[]>([]);
	const [filters, setFilters] = useState<Filters>({
		genres: [],
		date: null,
		date_gte: null,
		date_lte: null,
		vote_gte: 150,
		vote_lte: null,
		rate_gte: null,
		rate_lte: null,
	});
	const [showFilters, setShowFilters] = useState<boolean>(false);
	const [TVShowsByPage, setTVShowsByPage] = useState<TVShowsByPage>();
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const [_, setRender] = useState<boolean>(window.innerWidth > 1020);
	const location = useLocation();

	window.addEventListener('resize', () => {
		setRender(window.innerWidth > 1020);
	});

	async function getTopRatedTVShows(page: number, filters: Filters) {
		let genresStringify: string = '';

		if (filters.genres.length > 0) {
			for (let i = 0; i < filters.genres.length; i++) {
				if (i === 0) genresStringify += `${filters.genres[i].id}`;
				else genresStringify += `,${filters.genres[i].id}`;
			}
		}

		try {
			const response = await axios.post(
				`${backBaseUrl}/api/TMDB/tv/top-rated`,
				{
					page: page,
					genres: genresStringify,
					date: filters.date,
					date_gte: filters.date_gte,
					date_lte: filters.date_lte,
					vote_gte: filters.vote_gte,
					vote_lte: filters.vote_lte,
					rate_gte: filters.rate_gte,
					rate_lte: filters.rate_lte,
				},
				{
					withCredentials: true,
				}
			);
			console.log(response);
			setTVShowsByPage(response.data);
		} catch (err) {
			console.error(err);
		}
	}

	/**
	 * Get the list of official genres for TV shows
	 */
	async function getGenres() {
		try {
			const response = await axios.get(`${backBaseUrl}/api/TMDB/tv/genres`, {
				withCredentials: true,
			});
			setGenres(response.data.genres);
		} catch (err) {
			console.error(err);
		}
	}

	useEffect(() => {
		getGenres();
	}, []);

	useEffect(() => {
		if (location.state) {
			const updatedFilters = { ...filters };
			updatedFilters.genres = [...filters.genres, location.state];

			setFilters(updatedFilters);
		}
	}, [location]);

	useEffect(() => {
		getTopRatedTVShows(page, filters);
	}, [page, filters]);

	useEffect(() => {
		if (TVShowsByPage)
			setLastPage(
				TVShowsByPage.total_pages > 500 ? 500 : TVShowsByPage.total_pages
			);
	}, [TVShowsByPage]);

	return TVShowsByPage ? (
		<div
			className='wrapper top-rated'
			style={
				showFilters
					? { overflow: 'hidden', height: '100vh' }
					: { overflow: 'visible', height: 'fit-content' }
			}
		>
			{showFilters && (
				<Filter
					genres={genres}
					filters={filters}
					setFilters={setFilters}
					setShowFilters={setShowFilters}
				/>
			)}
			<div className='filters-button-wrapper'>
				<button
					className='filters-button clickable'
					onClick={() => setShowFilters(true)}
				>
					<span>Filters</span>
					<FontAwesomeIcon icon={faFilter} />
				</button>
			</div>

			{TVShowsByPage.total_results > 0 ? (
				<>
					<section>
						{TVShowsByPage.results.map((TVShow) => (
							<Element
								key={TVShow.id}
								elementId={TVShow.id}
								elementName={TVShow.name}
								elementAdditionalInformation={
									TVShow.first_air_date && TVShow.first_air_date.slice(0, 4)
								}
								elementNavigation={`${TVShow.id}`}
								elementPoster={
									TVShow.poster_path
										? `${TMDBBaseUrl}original${TVShow.poster_path}`
										: null
								}
								posterHeight={window.innerWidth > 1020 ? 450 : 225}
								posterWidth={window.innerWidth > 1020 ? 300 : 150}
								scrollPosition={null}
							/>
						))}
					</section>
					<Pagination page={page} setPage={setPage} lastPage={lastPage} />
				</>
			) : (
				<h1 className='error-no-data'>No TV Shows found</h1>
			)}
		</div>
	) : (
		<Loader />
	);
}

export default TopRated;
