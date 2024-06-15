import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';

import {
	Crew,
	ElementAction,
	ElementList,
	MovieDetails,
	Provider,
	UserList,
	VideoItem,
	Comment as CommentType,
} from '../../utils/interface';
import ElementPage from '../../components/element-page/ElementPage';
import Loader from '../../components/loader/Loader';

interface Props {
	backBaseUrl: string;
	TMDBBaseUrl: string;
	userId: string;
	elementsId: number[];
	setElementsId: (elementsId: number[]) => void;
	xsrfToken: string;
}

function Movie({
	backBaseUrl,
	TMDBBaseUrl,
	userId,
	elementsId,
	setElementsId,
	xsrfToken,
}: Props) {
	const { id } = useParams();
	const [movie, setMovie] = useState<MovieDetails>();
	const [trailer, setTrailer] = useState<VideoItem>();
	const [directors, setDirectors] = useState<Crew[]>([]);
	const [providers, setProviders] = useState<Provider[]>([]);
	const [lists, setLists] = useState<ElementList[]>([]);
	const [userLists, setUserLists] = useState<UserList[]>([]);
	const [movieLists, setMovieLists] = useState<ElementAction[]>([]);
	const [elementActionsReady, setElementActionsReady] =
		useState<boolean>(false);
	const [comment, setComment] = useState<CommentType>({
		_id: '',
		userId: '',
		TMDBId: -1,
		comment: '',
		date: '',
	});

	async function handleSubmitComment(commentValue: string) {
		if (comment.comment === '') createComment(commentValue);
		else updateComment(commentValue);
	}

	async function createComment(commentValue: string) {
		try {
			const response = await axios.post(
				`${backBaseUrl}/api/comments/add`,
				{
					userId: userId,
					TMDBId: id && parseInt(id),
					elementModel: 'movie',
					comment: commentValue,
				},
				{
					headers: {
						'x-xsrf-token': xsrfToken,
					},
					withCredentials: true,
				}
			);

			const dateString = response.data.comment.date.substring(0, 10);

			response.data.comment.date = dateString;

			setComment(response.data.comment);
		} catch (err) {
			console.error(err);
		}
	}

	async function getComment(userId: string) {
		try {
			const response = await axios.get(
				`${backBaseUrl}/api/comments/user/${userId}/movie/${id}`,

				{
					headers: {
						'x-xsrf-token': xsrfToken,
					},
					withCredentials: true,
				}
			);

			if (response.data.success) {
				const dateString = response.data.comment.date.substring(0, 10);

				response.data.comment.date = dateString;

				setComment(response.data.comment);
			}
		} catch (err) {
			console.error(err);
		}
	}

	async function updateComment(commentValue: string) {
		try {
			await axios.put(
				`${backBaseUrl}/api/comments/update`,
				{
					userId: userId,
					TMDBId: id && parseInt(id),
					elementModel: 'movie',
					comment: commentValue,
				},
				{
					headers: {
						'x-xsrf-token': xsrfToken,
					},
					withCredentials: true,
				}
			);

			const date = new Date();
			const dateString = `${date.getFullYear()}-${(date.getMonth() + 1)
				.toString()
				.padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;

			setComment((prevComment) => ({
				...prevComment,
				comment: commentValue,
				date: dateString,
			}));
		} catch (err) {
			console.error(err);
		}
	}

	async function getMovieDetails(movieId: number) {
		try {
			const response = await axios.get(
				`${backBaseUrl}/api/TMDB/movies/${movieId}`,
				{
					headers: {
						'x-xsrf-token': xsrfToken,
					},
					withCredentials: true,
				}
			);
			console.log(response.data);
			setMovie(response.data);
		} catch (err) {
			console.error(err);
		}
	}

	async function getUserLists(userId: string) {
		try {
			const response = await axios.get(
				`${backBaseUrl}/api/lists/userId/${userId}`,
				{
					headers: {
						'x-xsrf-token': xsrfToken,
					},
					withCredentials: true,
				}
			);
			setUserLists(response.data);
		} catch (err) {
			console.error(err);
		}
	}

	async function getMovieLists(userLists: UserList[], movieId: number) {
		try {
			const tmpMovieLists: ElementAction[] = [];
			for (const userList of userLists) {
				const response = await axios.get(
					`${backBaseUrl}/api/lists/${userList._id}/elements/${movieId}/model/movie/isInList`,
					{
						headers: {
							'x-xsrf-token': xsrfToken,
						},
						withCredentials: true,
					}
				);
				tmpMovieLists.push({
					_id: userList._id,
					name: userList.name,
					value: response.data.include,
					date: response.data.include ? response.data.date : null,
				});
			}
			setMovieLists(tmpMovieLists);
		} catch (err) {
			console.error(err);
		} finally {
			setElementActionsReady(true);
		}
	}

	async function addMovieToList(movieId: number, listId: string) {
		try {
			await axios.post(
				`${backBaseUrl}/api/lists/${listId}/elements/add`,
				{ elementId: movieId, elementModel: 'movie' },
				{
					headers: {
						'x-xsrf-token': xsrfToken,
					},
					withCredentials: true,
				}
			);
			const movieListsTmp = [...movieLists];
			const listIndex = movieLists.findIndex(
				(movieList) => movieList._id === listId
			);
			movieListsTmp[listIndex].value = true;
			movieListsTmp[listIndex].date = Date.now().toLocaleString();
			setMovieLists(movieListsTmp);
		} catch (err) {
			console.error(err);
		}
	}

	async function removeMovieToList(movieId: number, listId: string) {
		try {
			await axios.delete(
				`${backBaseUrl}/api/lists/${listId}/elements/remove/movie/${movieId}`,
				{
					headers: {
						'x-xsrf-token': xsrfToken,
					},
					withCredentials: true,
				}
			);
			const movieListsTmp = [...movieLists];
			const listIndex = movieLists.findIndex(
				(movieList) => movieList._id === listId
			);
			movieListsTmp[listIndex].value = false;
			movieListsTmp[listIndex].date = '';
			setMovieLists(movieListsTmp);
		} catch (err) {
			console.error(err);
		}
	}

	async function addGenresToDb(movie: MovieDetails) {
		try {
			for (const genre of movie.genres) {
				axios.post(
					`${backBaseUrl}/api/elements/genres/add`,
					{
						id: genre.id,
						name: genre.name,
						type: 'movie',
					},
					{
						headers: {
							'x-xsrf-token': xsrfToken,
						},
						withCredentials: true,
					}
				);
			}
		} catch (err) {
			console.error(err);
		}
	}

	async function addProvidersToDb(providers: Provider[]) {
		try {
			for (const provider of providers) {
				axios.post(
					`${backBaseUrl}/api/elements/providers/add`,
					{
						id: provider.provider_id,
						name: provider.provider_name,
						logoPath: provider.logo_path,
					},
					{
						headers: {
							'x-xsrf-token': xsrfToken,
						},
						withCredentials: true,
					}
				);
			}
		} catch (err) {
			console.error(err);
		}
	}

	async function addMovieToDb(movie: MovieDetails) {
		try {
			await axios.post(
				`${backBaseUrl}/api/elements/movies/add`,
				{
					backdropPath: movie.backdrop_path,
					credits: {
						cast: movie.credits.cast.map((cast) => ({
							id: cast.id,
						})),
						crew: movie.credits.crew.map((crew) => ({
							id: crew.id,
						})),
					},
					genres: movie.genres.map((genre) => ({
						id: genre.id,
					})),
					TMDBId: movie.id,
					overview: movie.overview,
					posterPath: movie.poster_path,
					recommendations: movie.recommendations.results.map((reco) => ({
						id: reco.id,
					})),
					date: movie.release_date,
					runtime: movie.runtime,
					tagline: movie.tagline,
					title: movie.title,
					voteAverage: movie.vote_average,
					video: trailer,
					providers: providers.map((provider) => ({
						id: provider.provider_id,
					})),
					directors: directors.map((director) => ({
						id: director.id,
					})),
				},
				{
					headers: {
						'x-xsrf-token': xsrfToken,
					},
					withCredentials: true,
				}
			);
		} catch (err) {
			console.error(err);
		}
	}

	async function handleIconClick(elementsAction: ElementAction | null) {
		try {
			if (elementsAction && movie) {
				if (!elementsAction.value) {
					addProvidersToDb(providers);
					addGenresToDb(movie);
					await addMovieToDb(movie);
					addMovieToList(movie.id, elementsAction._id);
				} else removeMovieToList(movie.id, elementsAction._id);
			}
		} catch (err) {
			console.error(err);
		}
	}

	useEffect(() => {
		if (userId) getComment(userId);
	}, [userId]);

	useEffect(() => {
		if (id && xsrfToken) {
			const movieId = parseInt(id);

			if (movieId !== elementsId[0]) setElementsId([movieId]);

			getMovieDetails(movieId);
		}
	}, [id, xsrfToken]);

	useEffect(() => {
		if (movie) {
			/**
			 * We define the directors' array before modifying the crew members' array.
			 */
			setDirectors(
				movie.credits.crew.filter((person) => person.job === 'Director')
			);

			/**
			 * We first filter videos to search for YouTube trailers.
			 */
			let videosTrailer: VideoItem[] = movie.videos.results.filter(
				(video) => video.type === 'Trailer' && video.site === 'YouTube'
			);

			/**
			 * If there is only one video, then this is the trailer. Otherwise, we'll filter the videos again to find the official trailers.
			 */
			if (videosTrailer.length === 1) {
				setTrailer(videosTrailer[0]);
			} else if (videosTrailer.length > 1) {
				videosTrailer = videosTrailer.filter(
					(video) => video.official === true
				);

				/**
				 * Again, if there is only one video, then we assign it as the trailer. Otherwise, we filter the videos again to
				 * looking for arbitrary names that are more likely to be the main trailers. Then we assign the first result to the trailer.
				 */
				if (videosTrailer.length === 1) {
					setTrailer(videosTrailer[0]);
				} else if (videosTrailer.length > 1) {
					videosTrailer = videosTrailer.filter(
						(video) =>
							video.name === 'Trailer' ||
							video.name === 'Official Trailer' ||
							video.name === 'Main Trailer' ||
							video.name === 'Official US Trailer'
					);

					if (videosTrailer.length > 0) setTrailer(videosTrailer[0]);
				}
			}

			/**
			 * TMDB provides as many lines in the 'crew' array as a person on the team has roles in the movie.
			 * Here, I redefine the crew array by adding the different jobs a person had on the set.
			 */
			const filteredCrew: Crew[] = [];
			const ids: number[] = [];

			for (const crewMember of movie.credits.crew) {
				if (!ids.includes(crewMember.id)) {
					ids.push(crewMember.id);
					filteredCrew.push(crewMember);
				} else {
					const crewMemberTmp = filteredCrew.find(
						(filteredCrewMember) => filteredCrewMember.id === crewMember.id
					);
					if (crewMemberTmp) {
						crewMemberTmp.job += `, ${crewMember.job}`;
					}
				}
			}

			/**
			 * We sort providers to keep only those offering the film for streaming in France
			 * Need to be change to show providers depending on the country of the user (I'm French ;))
			 */
			const filteredProvider: Provider[] = [];
			if (
				movie['watch/providers'].results.FR &&
				movie['watch/providers'].results.FR.flatrate
			) {
				movie['watch/providers'].results.FR.flatrate.map((provider) => {
					/**
					 * Here we change to logo path to not have to transmit the TMDBBaseUrl
					 */
					provider.logo_path = `${TMDBBaseUrl}original${provider.logo_path}`;
					filteredProvider.push(provider);
				});
			}
			setProviders(filteredProvider);

			const listsTmp: ElementList[] = [];

			movie.credits.cast.length > 0 &&
				listsTmp.push({
					list: {
						name: 'Cast',
						elements: movie.credits.cast,
					},
					elementWidth: 200,
					elementHeight: 200 * (3 / 2),
					TMDBBaseUrl: TMDBBaseUrl,
				});

			filteredCrew.length > 0 &&
				listsTmp.push({
					list: {
						name: 'Crew',
						elements: filteredCrew,
					},
					elementWidth: 200,
					elementHeight: 200 * (3 / 2),
					TMDBBaseUrl: TMDBBaseUrl,
				});

			movie.recommendations.total_results > 0 &&
				listsTmp.push({
					list: {
						name: 'Recommendation',
						elements: movie.recommendations.results,
					},
					elementWidth: 200,
					elementHeight: 200 * (3 / 2),
					TMDBBaseUrl: TMDBBaseUrl,
				});

			setLists(listsTmp);
		}
	}, [movie]);

	useEffect(() => {
		if (userId !== '') getUserLists(userId);
	}, [userId]);

	useEffect(() => {
		if (userLists.length > 0 && movie) getMovieLists(userLists, movie.id);
	}, [userLists, movie]);

	return movie && movieLists && elementActionsReady ? (
		<ElementPage
			comment={comment}
			handleSubmitComment={handleSubmitComment}
			elementId={movie.id}
			elementBackdropPath={
				movie.backdrop_path && `${TMDBBaseUrl}original${movie.backdrop_path}`
			}
			elementCreatorsOrDirectors={directors}
			elementDate={movie.release_date.slice(0, 4)}
			elementDuration={movie.runtime}
			elementGenres={movie.genres}
			elementLists={lists}
			elementMedia='movie'
			elementName={movie.title}
			elementNumberEpisodes={null}
			elementNumberSeasons={null}
			elementOverview={movie.overview}
			elementPoster={
				movie.poster_path && `${TMDBBaseUrl}original${movie.poster_path}`
			}
			elementPosterHeight={500}
			elementPosterWidth={333}
			elementProviders={providers}
			elementRating={
				movie.vote_average > 0
					? Math.round(movie.vote_average * 1e1) / 1e1
					: null
			}
			elementTagline={movie.tagline}
			elementParents={null}
			elementActions={movieLists}
			handleIconClick={handleIconClick}
			trailer={trailer ? trailer : null}
			elementsId={elementsId}
			setElementsId={setElementsId}
		/>
	) : (
		<Loader />
	);
}

export default Movie;
