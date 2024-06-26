import { useState, useEffect } from 'react';
import axios from 'axios';

import { Genre, ListType, Movie, TVShow } from '../../utils/interface';
import Loader from '../../components/loader/Loader';
import List from '../../components/list/List';

interface Props {
	backBaseUrl: string;
	TMDBBaseUrl: string;
	xsrfToken: string;
}

function Home({ backBaseUrl, TMDBBaseUrl, xsrfToken }: Props) {
	const [moviesGenres, setMoviesGenres] = useState<Genre[]>([]);
	const [TVShowsGenres, setTVShowsGenres] = useState<Genre[]>([]);
	const [homeList, setHomeList] = useState<ListType[]>([]);
	const [isLoading, setIsLoading] = useState<boolean>(false);

	/**
	 * Get the list of official genres for movies
	 */
	async function getMoviesGenres() {
		try {
			const response = await axios.get(
				`${backBaseUrl}/api/TMDB/movies/genres`,
				{
					headers: {
						'x-xsrf-token': xsrfToken,
					},
					withCredentials: true,
				}
			);
			setMoviesGenres(response.data.genres);
		} catch (err) {
			console.error(err);
		}
	}

	/**
	 * Get the list of official genres for TV shows
	 */
	async function getTVShowsGenres() {
		try {
			const response = await axios.get(`${backBaseUrl}/api/TMDB/tv/genres`, {
				headers: {
					'x-xsrf-token': xsrfToken,
				},
				withCredentials: true,
			});
			setTVShowsGenres(response.data.genres);
		} catch (err) {
			console.error(err);
		}
	}

	/**
	 * Get 20 movies based on the genre given in the body sort by popularity
	 */
	async function getMoviesByGenre(genreId: number) {
		try {
			const response = await axios.get(
				`${backBaseUrl}/api/TMDB/movies/genres/${genreId}`,
				{
					headers: {
						'x-xsrf-token': xsrfToken,
					},
					withCredentials: true,
				}
			);
			return response.data.results.filter(
				(movie: Movie) => movie.adult === false
			);
		} catch (err) {
			console.error(err);
		}
	}

	/**
	 * Get 20 TV shows based on the genre given in the body sort by popularity
	 */
	async function getTVShowsByGenre(genreId: number) {
		try {
			const response = await axios.get(
				`${backBaseUrl}/api/TMDB/tv/genres/${genreId}`,
				{
					headers: {
						'x-xsrf-token': xsrfToken,
					},
					withCredentials: true,
				}
			);
			return response.data.results;
		} catch (err) {
			console.error(err);
		}
	}

	/**
	 * Get all the trending TV shows of the week
	 */
	async function getTrendingTVShows() {
		try {
			const response = await axios.get(`${backBaseUrl}/api/TMDB/tv/trending`, {
				headers: {
					'x-xsrf-token': xsrfToken,
				},
				withCredentials: true,
			});
			return response.data.results;
		} catch (err) {
			console.error(err);
		}
	}

	/**
	 * Get all the trending movies of the week
	 */
	async function getTrendingMovies() {
		try {
			const response = await axios.get(
				`${backBaseUrl}/api/TMDB/movies/trending`,
				{
					headers: {
						'x-xsrf-token': xsrfToken,
					},
					withCredentials: true,
				}
			);
			return response.data.results.filter(
				(movie: Movie) => movie.adult === false
			);
		} catch (err) {
			console.error(err);
		}
	}

	/**
	 * Get movies that are in french theaters. This function need to be modified to take into account the user's location.
	 */
	async function getMoviesInTheater() {
		try {
			const response = await axios.get(
				`${backBaseUrl}/api/TMDB/movies/in-theater`,
				{
					headers: {
						'x-xsrf-token': xsrfToken,
					},
					withCredentials: true,
				}
			);
			return response.data.results;
		} catch (err) {
			console.error(err);
		}
	}

	/**
	 * Get the elements of the home page
	 */
	async function getAllElementsHomePage(
		moviesGenres: Genre[],
		TVShowsGenres: Genre[]
	) {
		try {
			setIsLoading(true);
			const updatedHomeList: ListType[] = [...homeList];

			const trendingMovies: Movie[] = await getTrendingMovies();
			if (!updatedHomeList.some((list) => list.name === 'Trending movies'))
				updatedHomeList.push({
					name: 'Trending movies',
					elements: trendingMovies,
				});

			const moviesInTheater: Movie[] = await getMoviesInTheater();
			if (!updatedHomeList.some((list) => list.name === 'Movies in theater'))
				updatedHomeList.push({
					name: 'Movies in theater',
					elements: moviesInTheater,
				});

			const trendingTVShows: TVShow[] = await getTrendingTVShows();
			if (!updatedHomeList.some((list) => list.name === 'Trending TV shows'))
				updatedHomeList.push({
					name: 'Trending TV shows',
					elements: trendingTVShows,
				});

			for (const moviesGenre of moviesGenres) {
				const movies: Movie[] = await getMoviesByGenre(moviesGenre.id);
				if (!updatedHomeList.some((list) => list.name === moviesGenre.name))
					updatedHomeList.push({ name: moviesGenre.name, elements: movies });
			}

			for (const TVShowsGenre of TVShowsGenres) {
				const TVShows: TVShow[] = await getTVShowsByGenre(TVShowsGenre.id);
				if (!updatedHomeList.some((list) => list.name === TVShowsGenre.name))
					updatedHomeList.push({ name: TVShowsGenre.name, elements: TVShows });
			}

			setHomeList(updatedHomeList);
		} catch (err) {
			console.error(err);
		} finally {
			setIsLoading(false);
		}
	}

	useEffect(() => {
		getMoviesGenres();
		getTVShowsGenres();
	}, []);

	useEffect(() => {
		if (moviesGenres.length > 0 && TVShowsGenres.length > 0) {
			getAllElementsHomePage(moviesGenres, TVShowsGenres);
		}
	}, [moviesGenres, TVShowsGenres]);

	return !isLoading ? (
		<div className='wrapper'>
			{homeList.map((list) => (
				<List
					key={list.name}
					name={list.name}
					elements={list.elements}
					TMDBBaseUrl={TMDBBaseUrl}
					elementWidth={200}
					elementHeight={300}
				/>
			))}
		</div>
	) : (
		<Loader />
	);
}

export default Home;
