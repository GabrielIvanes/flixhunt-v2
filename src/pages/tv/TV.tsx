/* eslint-disable no-mixed-spaces-and-tabs */
import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';

import {
	Comment as CommentType,
	Crew,
	TVShowDetails,
	Provider,
	VideoItem,
	Cast,
	ElementList,
	UserList,
	ElementAction,
} from '../../utils/interface';
import ElementPage from '../../components/element-page/ElementPage';
import Loader from '../../components/loader/Loader';

interface Props {
	backBaseUrl: string;
	TMDBBaseUrl: string;
	elementsId: number[];
	userId: string;
	setElementsId: (elementsId: number[]) => void;
	xsrfToken: string;
}

function TV({
	backBaseUrl,
	TMDBBaseUrl,
	elementsId,
	userId,
	setElementsId,
	xsrfToken,
}: Props) {
	const { id } = useParams();
	const [TVShow, setTVShow] = useState<TVShowDetails>();
	const [trailer, setTrailer] = useState<VideoItem>();
	const [lists, setLists] = useState<ElementList[]>([]);
	const [creators, setCreators] = useState<Crew[]>([]);
	const [providers, setProviders] = useState<Provider[]>([]);
	const [userLists, setUserLists] = useState<UserList[]>([]);
	const [TVLists, setTVLists] = useState<ElementAction[]>([]);
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
					elementModel: 'tv',
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
				`${backBaseUrl}/api/comments/user/${userId}/tv/${id}`,

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
					elementModel: 'tv',
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

	async function getTVDetails(TVId: number) {
		try {
			const response = await axios.get(`${backBaseUrl}/api/TMDB/tv/${TVId}`, {
				headers: {
					'x-xsrf-token': xsrfToken,
				},
				withCredentials: true,
			});
			console.log(response.data);
			setTVShow(response.data);
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

	async function getTvLists(userLists: UserList[], TVId: number) {
		try {
			const tmpTVLists: ElementAction[] = [];

			if (userLists)
				for (const userList of userLists) {
					const response = await axios.get(
						`${backBaseUrl}/api/lists/${userList._id}/elements/${TVId}/model/tv/isInList`,
						{
							headers: {
								'x-xsrf-token': xsrfToken,
							},
							withCredentials: true,
						}
					);
					tmpTVLists.push({
						_id: userList._id,
						name: userList.name,
						value: response.data.include,
						date: response.data.include ? response.data.date : null,
					});
				}
			setTVLists(tmpTVLists);
		} catch (err) {
			console.error(err);
		} finally {
			setElementActionsReady(true);
		}
	}

	async function addTVToList(TVId: number, listId: string) {
		try {
			await axios.post(
				`${backBaseUrl}/api/lists/${listId}/elements/add`,
				{ elementId: TVId, elementModel: 'tv' },
				{
					headers: {
						'x-xsrf-token': xsrfToken,
					},
					withCredentials: true,
				}
			);
			const TVListsTmp = [...TVLists];
			const listIndex = TVLists.findIndex((TVList) => TVList._id === listId);
			TVListsTmp[listIndex].value = true;
			TVListsTmp[listIndex].date = Date.now().toLocaleString();
			setTVLists(TVListsTmp);
		} catch (err) {
			console.error(err);
		}
	}

	async function removeTVToList(TVId: number, listId: string) {
		try {
			await axios.delete(
				`${backBaseUrl}/api/lists/${listId}/elements/remove/tv/${TVId}`,
				{
					headers: {
						'x-xsrf-token': xsrfToken,
					},
					withCredentials: true,
				}
			);
			const TVListsTmp = [...TVLists];
			const listIndex = TVLists.findIndex((TVList) => TVList._id === listId);
			TVListsTmp[listIndex].value = false;
			TVListsTmp[listIndex].date = '';
			setTVLists(TVListsTmp);
		} catch (err) {
			console.error(err);
		}
	}

	async function addGenresToDb(TVShow: TVShowDetails) {
		try {
			for (const genre of TVShow.genres) {
				axios.post(
					`${backBaseUrl}/api/elements/genres/add`,
					{
						id: genre.id,
						name: genre.name,
						type: 'tv',
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

	async function addTVToDb(TVShow: TVShowDetails) {
		try {
			await axios.post(
				`${backBaseUrl}/api/elements/tv-shows/add`,
				{
					backdropPath: TVShow.backdrop_path,
					credits: {
						cast: TVShow.aggregate_credits.cast.map((cast) => ({
							id: cast.id,
						})),
						crew: TVShow.aggregate_credits.crew.map((crew) => ({
							id: crew.id,
						})),
					},
					genres: TVShow.genres.map((genre) => ({
						id: genre.id,
					})),
					TMDBId: TVShow.id,
					overview: TVShow.overview,
					posterPath: TVShow.poster_path,
					recommendations: TVShow.recommendations.results.map((reco) => ({
						id: reco.id,
					})),
					firstDate: TVShow.first_air_date,
					lastDate: TVShow.last_air_date,
					tagline: TVShow.tagline,
					name: TVShow.name,
					voteAverage: TVShow.vote_average,
					numberEpisodes: TVShow.number_of_episodes,
					numberSeasons: TVShow.number_of_seasons,
					video: trailer,
					providers: providers.map((provider) => ({
						id: provider.provider_id,
					})),
					creators: creators.map((creator) => ({
						id: creator.id,
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
		if (elementsAction && TVShow) {
			if (!elementsAction.value) {
				addProvidersToDb(providers);
				addGenresToDb(TVShow);
				await addTVToDb(TVShow);
				addTVToList(TVShow.id, elementsAction._id);
			} else removeTVToList(TVShow.id, elementsAction._id);
		}
	}

	useEffect(() => {
		if (userId && id) getComment(userId);
	}, [userId, id]);

	useEffect(() => {
		if (id) {
			const TVId = parseInt(id);
			if (TVId !== elementsId[0]) setElementsId([TVId]);
			getTVDetails(TVId);
		}
	}, [id]);

	useEffect(() => {
		if (TVShow) {
			/**
			 * We define the directors' array before modifying the crew members' array.
			 */

			/**
			 * We first filter videos to search for YouTube trailers.
			 */
			let videosTrailer: VideoItem[] = TVShow.videos.results.filter(
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

			const filteredCreators: Crew[] = [];

			TVShow.created_by.map((creator) => {
				const crewMember: Crew = {
					adult: false,
					gender: creator.gender,
					id: creator.id,
					known_for_department: '',
					name: creator.name,
					original_name: '',
					popularity: 0,
					profile_path: creator.profile_path ? creator.profile_path : '',
					credit_id: '',
					department: '',
					job: '',
				};
				filteredCreators.push(crewMember);
			});

			setCreators(filteredCreators);

			/**
			 * We replace the crew array of type AggregateCrew with an array of type Crew
			 */

			const newCrew: Crew[] = [];

			TVShow.aggregate_credits.crew.forEach((crew) => {
				const concatenatedJobs = crew.jobs.map((job) => job.job).join(', ');

				const crewMember: Crew = {
					adult: crew.adult,
					gender: crew.gender,
					id: crew.id,
					known_for_department: crew.known_for_department,
					name: crew.name,
					original_name: crew.original_name,
					popularity: crew.popularity,
					profile_path: crew.profile_path,
					credit_id: crew.jobs[0].credit_id.toString(),
					department: crew.department,
					job: concatenatedJobs,
				};
				newCrew.push(crewMember);
			});

			/**
			 * TMDB provides as many lines in the 'crew' array as a person on the team has roles in the TV show.
			 * Here, I redefine the crew array by adding the different jobs a person had on the set.
			 */
			const filteredCrew: Crew[] = [];
			const ids: number[] = [];

			for (const crewMember of newCrew) {
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
			 * We replace the cast array of type AggregateCast with an array of type Cast
			 */

			const newCast: Cast[] = [];

			TVShow.aggregate_credits.cast.forEach((cast) => {
				const concatenatedCharacters = cast.roles
					.map((role) => role.character)
					.join(', ');

				const castMember: Cast = {
					adult: cast.adult,
					gender: cast.gender,
					id: cast.id,
					known_for_department: cast.known_for_department,
					name: cast.name,
					original_name: cast.original_name,
					popularity: cast.popularity,
					profile_path: cast.profile_path,
					credit_id: cast.roles[0].credit_id.toString(),
					character: concatenatedCharacters,
					cast_id: cast.roles[0].credit_id,
					order: cast.order,
				};
				newCast.push(castMember);
			});

			/**
			 * We sort providers to keep only those offering the TV show for streaming in France
			 * Need to be change to show providers depending on the country of the user (I'm French ;))
			 */
			const filteredProvider: Provider[] = [];
			if (
				TVShow['watch/providers'].results.FR &&
				TVShow['watch/providers'].results.FR.flatrate
			) {
				TVShow['watch/providers'].results.FR.flatrate.map((provider) => {
					/**
					 * Here we change to logo path to not have to transmit the TMDBBaseUrl
					 */
					provider.logo_path = `${TMDBBaseUrl}original${provider.logo_path}`;
					filteredProvider.push(provider);
				});
			}
			setProviders(filteredProvider);

			const listsTmp: ElementList[] = [];

			TVShow.seasons.length > 0 &&
				listsTmp.push({
					list: {
						name: 'Seasons',
						elements: TVShow.seasons,
					},
					elementWidth: 200,
					elementHeight: 200 * (3 / 2),
					TMDBBaseUrl: TMDBBaseUrl,
				});

			newCast.length > 0 &&
				listsTmp.push({
					list: {
						name: 'Cast',
						elements: newCast,
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

			TVShow.recommendations.total_results > 0 &&
				listsTmp.push({
					list: {
						name: 'Recommendation',
						elements: TVShow.recommendations.results,
					},
					elementWidth: 200,
					elementHeight: 200 * (3 / 2),
					TMDBBaseUrl: TMDBBaseUrl,
				});

			setLists(listsTmp);
		}
	}, [TVShow]);

	useEffect(() => {
		getUserLists(userId);
	}, [userId]);

	useEffect(() => {
		if (userLists.length > 0 && TVShow) getTvLists(userLists, TVShow.id);
	}, [userLists, TVShow]);

	return TVShow && TVLists && elementActionsReady ? (
		<ElementPage
			comment={comment}
			handleSubmitComment={handleSubmitComment}
			elementId={TVShow.id}
			elementBackdropPath={
				TVShow.backdrop_path && `${TMDBBaseUrl}original${TVShow.backdrop_path}`
			}
			elementCreatorsOrDirectors={creators}
			elementDate={
				TVShow.first_air_date
					? TVShow.last_air_date
						? TVShow.first_air_date.slice(0, 4) +
						  ' - ' +
						  TVShow.last_air_date.slice(0, 4)
						: TVShow.first_air_date.slice(0, 4)
					: null
			}
			elementDuration={null}
			elementGenres={TVShow.genres}
			elementLists={lists}
			elementMedia='tv'
			elementName={TVShow.name}
			elementNumberEpisodes={TVShow.number_of_episodes}
			elementNumberSeasons={TVShow.number_of_seasons}
			elementOverview={TVShow.overview}
			elementPoster={
				TVShow.poster_path && `${TMDBBaseUrl}original${TVShow.poster_path}`
			}
			elementPosterHeight={500}
			elementPosterWidth={333}
			elementProviders={providers}
			elementRating={
				TVShow.vote_average > 0
					? Math.round(TVShow.vote_average * 1e1) / 1e1
					: null
			}
			elementTagline={TVShow.tagline}
			elementParents={null}
			elementActions={TVLists}
			handleIconClick={handleIconClick}
			trailer={trailer ? trailer : null}
			elementsId={elementsId}
			setElementsId={setElementsId}
		/>
	) : (
		<Loader />
	);
}

export default TV;
