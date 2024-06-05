import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';

import {
	Comment as CommentType,
	Crew,
	Provider,
	VideoItem,
	SeasonDetails,
	TVShowDetails,
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

function Season({
	backBaseUrl,
	TMDBBaseUrl,
	elementsId,
	userId,
	setElementsId,
	xsrfToken,
}: Props) {
	const { id, nbSeason } = useParams();
	const [TVShow, setTVShow] = useState<TVShowDetails>();
	const [season, setSeason] = useState<SeasonDetails>();
	const [providers, setProviders] = useState<Provider[]>([]);
	const [lists, setLists] = useState<ElementList[]>([]);
	const [trailer, setTrailer] = useState<VideoItem>();
	const [userLists, setUserLists] = useState<UserList[]>([]);
	const [seasonLists, setSeasonLists] = useState<ElementAction[]>([]);
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
		if (season) {
			if (comment.comment === '') createComment(commentValue, season.id);
			else updateComment(commentValue, season.id);
		}
	}

	async function createComment(commentValue: string, seasonId: number) {
		try {
			const response = await axios.post(
				`${backBaseUrl}/api/comments/add`,
				{
					userId: userId,
					TMDBId: seasonId,
					elementModel: 'season',
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

	async function getComment(userId: string, seasonId: number) {
		try {
			const response = await axios.get(
				`${backBaseUrl}/api/comments/user/${userId}/season/${seasonId}`,

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

	async function updateComment(commentValue: string, seasonId: number) {
		try {
			const response = await axios.put(
				`${backBaseUrl}/api/comments/update`,
				{
					userId: userId,
					TMDBId: seasonId,
					elementModel: 'season',
					comment: commentValue,
				},
				{
					headers: {
						'x-xsrf-token': xsrfToken,
					},
					withCredentials: true,
				}
			);

			console.log(response.data);

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

	async function getSeasonDetails(TVId: number, nbSeason: number) {
		try {
			const response = await axios.get(
				`${backBaseUrl}/api/TMDB/tv/${TVId}/seasons/${nbSeason}`,
				{
					headers: {
						'x-xsrf-token': xsrfToken,
					},
					withCredentials: true,
				}
			);
			console.log(response.data);
			setSeason(response.data);
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

	async function getSeasonLists(userLists: UserList[], seasonId: number) {
		try {
			const tmpSeasonLists: ElementAction[] = [];
			for (const userList of userLists) {
				const response = await axios.get(
					`${backBaseUrl}/api/lists/${userList._id}/elements/${seasonId}/model/season/isInList`,
					{
						headers: {
							'x-xsrf-token': xsrfToken,
						},
						withCredentials: true,
					}
				);
				tmpSeasonLists.push({
					_id: userList._id,
					name: userList.name,
					value: response.data.include,
					date: response.data.include ? response.data.date : null,
				});
			}
			setSeasonLists(tmpSeasonLists);
		} catch (err) {
			console.error(err);
		} finally {
			setElementActionsReady(true);
		}
	}

	async function addSeasonToList(seasonId: number, listId: string) {
		try {
			await axios.post(
				`${backBaseUrl}/api/lists/${listId}/elements/add`,
				{ elementId: seasonId, elementModel: 'season' },
				{
					headers: {
						'x-xsrf-token': xsrfToken,
					},
					withCredentials: true,
				}
			);
			const seasonListsTmp = [...seasonLists];
			const listIndex = seasonLists.findIndex(
				(seasonList) => seasonList._id === listId
			);
			seasonListsTmp[listIndex].value = true;
			seasonListsTmp[listIndex].date = Date.now().toLocaleString();
			setSeasonLists(seasonListsTmp);
		} catch (err) {
			console.error(err);
		}
	}

	async function removeSeasonToList(seasonId: number, listId: string) {
		try {
			await axios.delete(
				`${backBaseUrl}/api/lists/${listId}/elements/remove/season/${seasonId}`,
				{
					headers: {
						'x-xsrf-token': xsrfToken,
					},
					withCredentials: true,
				}
			);
			const seasonListsTmp = [...seasonLists];
			const listIndex = seasonLists.findIndex(
				(seasonList) => seasonList._id === listId
			);
			seasonListsTmp[listIndex].value = false;
			seasonListsTmp[listIndex].date = '';
			setSeasonLists(seasonListsTmp);
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

	async function addSeasonToDb(season: SeasonDetails, tvShow: TVShowDetails) {
		try {
			await axios.post(
				`${backBaseUrl}/api/elements/seasons/add`,
				{
					credits: {
						cast: season.credits.cast.map((cast) => ({
							id: cast.id,
						})),
						crew: season.credits.crew.map((crew) => ({
							id: crew.id,
						})),
					},
					TMDBId: season.id,
					TMDBTvId: tvShow.id,
					overview: season.overview,
					posterPath: season.poster_path,
					date: season.air_date,
					seasonNumber: season.season_number,
					name: season.name,
					video: trailer,
					providers: providers.map((provider) => ({
						id: provider.provider_id,
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
		if (elementsAction && season && TVShow) {
			addProvidersToDb(providers);
			await addSeasonToDb(season, TVShow);

			if (!elementsAction.value) addSeasonToList(season.id, elementsAction._id);
			else removeSeasonToList(season.id, elementsAction._id);
		}
	}

	useEffect(() => {
		if (userId && season) getComment(userId, season.id);
	}, [userId, season]);

	useEffect(() => {
		if (id && nbSeason) {
			const TVId = parseInt(id);
			const season = parseInt(nbSeason);

			if (
				elementsId.length === 1 ||
				(TVId !== elementsId[0] && season !== elementsId[1])
			)
				setElementsId([TVId, season]);

			getTVDetails(TVId);
			getSeasonDetails(TVId, season);
		}
	}, [id, nbSeason]);

	useEffect(() => {
		if (season) {
			let videosTrailer: VideoItem[] = season.videos.results.filter(
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
			 * TMDB provides as many lines in the 'crew' array as a person on the team has roles in the TV show.
			 * Here, I redefine the crew array by adding the different jobs a person had on the set.
			 */
			const filteredCrew: Crew[] = [];
			const ids: number[] = [];

			for (const crewMember of season.credits.crew) {
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

			const filteredProvider: Provider[] = [];
			if (
				season['watch/providers'].results.FR &&
				season['watch/providers'].results.FR.flatrate
			) {
				season['watch/providers'].results.FR.flatrate.map((provider) => {
					/**
					 * Here we change to logo path to not have to transmit the TMDBBaseUrl
					 */
					provider.logo_path = `${TMDBBaseUrl}original${provider.logo_path}`;
					filteredProvider.push(provider);
				});
			}
			setProviders(filteredProvider);

			const listsTmp: ElementList[] = [];

			season.episodes.length > 0 &&
				listsTmp.push({
					list: {
						name: 'Episodes',
						elements: season.episodes,
					},
					elementWidth: 150 * (16 / 9),
					elementHeight: 150,
					TMDBBaseUrl: TMDBBaseUrl,
				});

			season.credits.cast.length > 0 &&
				listsTmp.push({
					list: {
						name: 'Cast',
						elements: season.credits.cast,
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

			setLists(listsTmp);
		}
	}, [season]);

	useEffect(() => {
		getUserLists(userId);
	}, [userId]);

	useEffect(() => {
		if (userLists.length > 0 && season) getSeasonLists(userLists, season.id);
	}, [userLists, season]);

	return season && TVShow && seasonLists && elementActionsReady ? (
		<ElementPage
			comment={comment}
			handleSubmitComment={handleSubmitComment}
			elementId={season.id}
			elementBackdropPath={
				TVShow.backdrop_path && `${TMDBBaseUrl}original${TVShow.backdrop_path}`
			}
			elementCreatorsOrDirectors={null}
			elementDate={season.air_date}
			elementDuration={null}
			elementGenres={null}
			elementLists={lists}
			elementMedia='season'
			elementName={season.name}
			elementNumberEpisodes={
				season.episodes.length > 0 ? season.episodes.length : null
			}
			elementNumberSeasons={null}
			elementParents={[
				{
					name: TVShow.name,
					number: TVShow.id,
				},
			]}
			elementOverview={season.overview}
			elementPoster={
				season.poster_path && `${TMDBBaseUrl}original${season.poster_path}`
			}
			elementPosterHeight={500}
			elementPosterWidth={333}
			elementProviders={providers}
			elementRating={null}
			elementTagline={null}
			elementActions={seasonLists}
			handleIconClick={handleIconClick}
			trailer={trailer ? trailer : null}
			elementsId={elementsId}
			setElementsId={setElementsId}
		/>
	) : (
		<div className='wrapper'>
			<Loader />
		</div>
	);
}

export default Season;
