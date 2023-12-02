import { useState, useEffect } from 'react';
import axios from 'axios';

import { Genre, HomeList, Movie, TVShow } from '../../utils/interface';
import ElementsCarousel from '../../components/carousel/ElementsCarousel';
import Loader from '../../components/loader/Loader';

interface Props {
	backBaseUrl: string;
	TMDBBaseUrl: string;
}

function Home({ backBaseUrl, TMDBBaseUrl }: Props) {
	const [moviesGenres, setMoviesGenres] = useState<Genre[]>([]);
	const [TVShowsGenres, setTVShowsGenres] = useState<Genre[]>([]);
	const [homeList, setHomeList] = useState<HomeList[]>([]);
	const [isLoading, setIsLoading] = useState<boolean>(false);

	/**
	 * Get the list of official genres for movies
	 */
	async function getMoviesGenres() {
		try {
			const response = await axios.get(
				`${backBaseUrl}/api/TMDB/movies/genres`,
				{
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
			const response = await axios.get(`${backBaseUrl}/api/TMDB/TV/genres`, {
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
				`${backBaseUrl}/api/TMDB/movies?genre=${genreId}`,
				{
					withCredentials: true,
				}
			);
			console.log(response.data.results);
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
				`${backBaseUrl}/api/TMDB/TV?genre=${genreId}`,
				{
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
			const response = await axios.get(`${backBaseUrl}/api/TMDB/TV/trending`, {
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
	 * Get the elements of the home page
	 */
	async function getAllElementsHomePage(
		moviesGenres: Genre[],
		TVShowsGenres: Genre[]
	) {
		try {
			setIsLoading(true);

			const updatedHomeList: HomeList[] = [...homeList];

			const trendingMovies: Movie[] = await getTrendingMovies();
			if (!updatedHomeList.some((list) => list.name === 'Trending movies'))
				updatedHomeList.push({
					name: 'Trending movies',
					elements: trendingMovies,
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

	return (
		<div className='wrapper home'>
			{isLoading ? (
				<Loader />
			) : (
				homeList.map((list) => (
					<div className='list' key={list.name}>
						<h1>{list.name}</h1>
						<ElementsCarousel
							elements={list.elements}
							TMDBBaseUrl={TMDBBaseUrl}
							elementWidth={200}
						/>
					</div>
				))
			)}
		</div>
	);
}

export default Home;
