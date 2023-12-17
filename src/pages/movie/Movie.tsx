import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';

import {
	Crew,
	ElementList,
	MovieDetails,
	Provider,
	VideoItem,
} from '../../utils/interface';
import ElementPage from '../../components/element-page/ElementPage';
import Loader from '../../components/loader/Loader';

interface Props {
	backBaseUrl: string;
	TMDBBaseUrl: string;
	elementsId: number[];
	setElementsId: (elementsId: number[]) => void;
}

function Movie({ backBaseUrl, TMDBBaseUrl, elementsId, setElementsId }: Props) {
	const { id } = useParams();
	const [movie, setMovie] = useState<MovieDetails>();
	const [trailer, setTrailer] = useState<VideoItem>();
	const [directors, setDirectors] = useState<Crew[]>([]);
	const [providers, setProviders] = useState<Provider[]>([]);
	const [lists, setLists] = useState<ElementList[]>([]);

	async function getMovieDetails(movieId: number) {
		try {
			const response = await axios.get(
				`${backBaseUrl}/api/TMDB/movies/${movieId}`,
				{
					withCredentials: true,
				}
			);
			console.log(response.data);
			setMovie(response.data);
		} catch (err) {
			console.error(err);
		}
	}

	useEffect(() => {
		if (id) {
			const movieId = parseInt(id);

			if (movieId !== elementsId[0]) setElementsId([movieId]);

			getMovieDetails(movieId);
		}
	}, [id]);

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

	return movie ? (
		<ElementPage
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
			trailer={trailer ? trailer : null}
			elementsId={elementsId}
			setElementsId={setElementsId}
		/>
	) : (
		<Loader />
	);
}

export default Movie;
