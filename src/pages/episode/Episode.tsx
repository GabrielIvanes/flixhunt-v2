import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';

import {
	Comment as CommentType,
	Crew,
	VideoItem,
	TVShowDetails,
	ElementList,
	EpisodeDetails,
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

function Episode({
	backBaseUrl,
	TMDBBaseUrl,
	elementsId,
	userId,
	setElementsId,
	xsrfToken,
}: Props) {
	const { id, nbSeason, nbEpisode } = useParams();
	const [TVShow, setTVShow] = useState<TVShowDetails>();
	const [episode, setEpisode] = useState<EpisodeDetails>();
	const [lists, setLists] = useState<ElementList[]>([]);
	const [trailer, setTrailer] = useState<VideoItem>();
	const [userLists, setUserLists] = useState<UserList[]>([]);
	const [episodeLists, setEpisodeLists] = useState<ElementAction[]>([]);
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
		if (episode) {
			if (comment.comment === '') createComment(commentValue, episode?.id);
			else updateComment(commentValue, episode.id);
		}
	}

	async function createComment(commentValue: string, episodeId: number) {
		try {
			const response = await axios.post(
				`${backBaseUrl}/api/comments/add`,
				{
					userId: userId,
					TMDBId: episodeId,
					elementModel: 'episode',
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

			const dateString = response.data.comment.date.substring(0, 10);

			response.data.comment.date = dateString;

			setComment(response.data.comment);
		} catch (err) {
			console.error(err);
		}
	}

	async function getComment(userId: string, episodeId: number) {
		try {
			const response = await axios.get(
				`${backBaseUrl}/api/comments/user/${userId}/episode/${episodeId}`,

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

	async function updateComment(commentValue: string, episodeId: number) {
		try {
			await axios.put(
				`${backBaseUrl}/api/comments/update`,
				{
					userId: userId,
					TMDBId: episodeId,
					elementModel: 'episode',
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

	async function getEpisodeDetails(
		TVId: number,
		nbSeason: number,
		nbEpisode: number
	) {
		try {
			const response = await axios.get(
				`${backBaseUrl}/api/TMDB/tv/${TVId}/seasons/${nbSeason}/episodes/${nbEpisode}`,
				{
					headers: {
						'x-xsrf-token': xsrfToken,
					},
					withCredentials: true,
				}
			);
			console.log(response.data);
			setEpisode(response.data);
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

	async function getEpisodeLists(userLists: UserList[], episodeList: number) {
		try {
			const tmpEpisodeLists: ElementAction[] = [];
			for (const userList of userLists) {
				const response = await axios.get(
					`${backBaseUrl}/api/lists/${userList._id}/elements/${episodeList}/model/episode/isInList`,
					{
						headers: {
							'x-xsrf-token': xsrfToken,
						},
						withCredentials: true,
					}
				);
				tmpEpisodeLists.push({
					_id: userList._id,
					name: userList.name,
					value: response.data.include,
					date: response.data.include ? response.data.date : null,
				});
			}
			setEpisodeLists(tmpEpisodeLists);
		} catch (err) {
			console.error(err);
		} finally {
			setElementActionsReady(true);
		}
	}

	async function addEpisodeToList(episodeId: number, listId: string) {
		try {
			await axios.post(
				`${backBaseUrl}/api/lists/${listId}/elements/add`,
				{ elementId: episodeId, elementModel: 'episode' },
				{
					headers: {
						'x-xsrf-token': xsrfToken,
					},
					withCredentials: true,
				}
			);
			const episodeListsTmp = [...episodeLists];
			const listIndex = episodeLists.findIndex(
				(episodeList) => episodeList._id === listId
			);
			episodeListsTmp[listIndex].value = true;
			episodeListsTmp[listIndex].date = Date.now().toLocaleString();
			setEpisodeLists(episodeListsTmp);
		} catch (err) {
			console.error(err);
		}
	}

	async function removeEpisodeToList(episodeId: number, listId: string) {
		try {
			await axios.delete(
				`${backBaseUrl}/api/lists/${listId}/elements/remove/episode/${episodeId}`,
				{
					headers: {
						'x-xsrf-token': xsrfToken,
					},
					withCredentials: true,
				}
			);
			const episodeListsTmp = [...episodeLists];
			const listIndex = episodeLists.findIndex(
				(episodeList) => episodeList._id === listId
			);
			episodeListsTmp[listIndex].value = false;
			episodeListsTmp[listIndex].date = '';
			setEpisodeLists(episodeListsTmp);
		} catch (err) {
			console.error(err);
		}
	}

	async function addEpisodeToDb(
		episode: EpisodeDetails,
		tvShow: TVShowDetails
	) {
		try {
			console.log(
				episode.images.stills.map((image) => ({
					path: image.file_path,
				}))
			);
			await axios.post(
				`${backBaseUrl}/api/elements/episodes/add`,
				{
					credits: {
						cast: episode.credits.cast.map((cast) => ({
							id: cast.id,
						})),
						crew: episode.credits.crew.map((crew) => ({
							id: crew.id,
						})),
					},
					TMDBId: episode.id,
					TMDBTvId: tvShow.id,
					nbSeason: episode.season_number,
					overview: episode.overview,
					posterPath: episode.still_path,
					date: episode.air_date,
					runtime: episode.runtime,
					episodeNumber: episode.episode_number,
					name: episode.name,
					video: trailer,
					images: episode.images.stills.map((image) => ({
						path: image.file_path,
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
			if (elementsAction && episode && TVShow) {
				if (!elementsAction.value) {
					await addEpisodeToDb(episode, TVShow);
					addEpisodeToList(episode.id, elementsAction._id);
				} else removeEpisodeToList(episode.id, elementsAction._id);
			}
		} catch (err) {
			console.error(err);
		}
	}

	useEffect(() => {
		if (userId && episode) getComment(userId, episode.id);
	}, [userId, episode]);

	useEffect(() => {
		if (id && nbSeason && nbEpisode) {
			const TVId = parseInt(id);
			const season = parseInt(nbSeason);
			const episode = parseInt(nbEpisode);

			if (
				elementsId.length === 1 ||
				elementsId.length === 2 ||
				(TVId !== elementsId[0] &&
					season !== elementsId[1] &&
					episode !== elementsId[2])
			)
				setElementsId([TVId, season, episode]);

			getTVDetails(TVId);
			getEpisodeDetails(TVId, season, episode);
		}
	}, [id, nbSeason, nbEpisode]);

	useEffect(() => {
		if (episode) {
			let videosTrailer: VideoItem[] = episode.videos.results.filter(
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

			for (const crewMember of episode.credits.crew) {
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

			const listsTmp: ElementList[] = [];

			episode.images.stills.length > 0 &&
				listsTmp.push({
					list: {
						name: 'Images',
						elements: episode.images.stills,
					},
					elementWidth: 150 * (16 / 9),
					elementHeight: 150,
					TMDBBaseUrl: TMDBBaseUrl,
				});

			episode.credits.cast.length > 0 &&
				listsTmp.push({
					list: {
						name: 'Cast',
						elements: episode.credits.cast,
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
	}, [episode]);

	useEffect(() => {
		getUserLists(userId);
	}, [userId]);

	useEffect(() => {
		if (userLists.length > 0 && episode) getEpisodeLists(userLists, episode.id);
	}, [userLists, episode]);

	return episode &&
		nbSeason &&
		TVShow &&
		episodeLists &&
		elementActionsReady ? (
		<ElementPage
			comment={comment}
			handleSubmitComment={handleSubmitComment}
			elementId={episode.id}
			elementBackdropPath={
				TVShow.backdrop_path && `${TMDBBaseUrl}original${TVShow.backdrop_path}`
			}
			elementCreatorsOrDirectors={null}
			elementDate={episode.air_date}
			elementDuration={episode.runtime}
			elementGenres={null}
			elementLists={lists}
			elementMedia='episode'
			elementName={episode.name}
			elementNumberEpisodes={null}
			elementNumberSeasons={null}
			elementParents={[
				{
					name: TVShow.name,
					number: TVShow.id,
				},
				{
					name: `Season ${nbSeason}`,
					number: parseInt(nbSeason),
				},
			]}
			elementOverview={episode.overview}
			elementPoster={
				episode.still_path && `${TMDBBaseUrl}original${episode.still_path}`
			}
			elementPosterHeight={
				window.innerWidth > 600 ? 337.5 : (window.innerWidth - 10) * (9 / 16)
			}
			elementPosterWidth={
				window.innerWidth > 600 ? 600 : window.innerWidth - 10
			}
			elementProviders={null}
			elementRating={null}
			elementTagline={null}
			elementActions={episodeLists}
			handleIconClick={handleIconClick}
			trailer={trailer ? trailer : null}
			elementsId={elementsId}
			setElementsId={setElementsId}
		/>
	) : (
		<Loader />
	);
}

export default Episode;
