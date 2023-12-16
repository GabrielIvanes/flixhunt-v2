import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';

import {
	Crew,
	VideoItem,
	TVShowDetails,
	ElementList,
	EpisodeDetails,
} from '../../utils/interface';
import ElementPage from '../../components/element-page/ElementPage';
import Loader from '../../components/loader/Loader';

interface Props {
	backBaseUrl: string;
	TMDBBaseUrl: string;
	elementsId: number[];
	setElementsId: (elementsId: number[]) => void;
}

function Episode({
	backBaseUrl,
	TMDBBaseUrl,
	elementsId,
	setElementsId,
}: Props) {
	const { id, nbSeason, nbEpisode } = useParams();
	const [TVShow, setTVShow] = useState<TVShowDetails>();
	const [episode, setEpisode] = useState<EpisodeDetails>();
	const [lists, setLists] = useState<ElementList[]>([]);
	const [trailer, setTrailer] = useState<VideoItem>();

	async function getEpisodeDetails(
		TVId: number,
		nbSeason: number,
		nbEpisode: number
	) {
		try {
			const response = await axios.get(
				`${backBaseUrl}/api/TMDB/tv/${TVId}/seasons/${nbSeason}/episodes/${nbEpisode}`,
				{
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
				withCredentials: true,
			});
			setTVShow(response.data);
		} catch (err) {
			console.error(err);
		}
	}

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

	return episode && nbSeason && TVShow ? (
		<ElementPage
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
			trailer={trailer ? trailer : null}
			elementsId={elementsId}
			setElementsId={setElementsId}
		/>
	) : (
		<Loader />
	);
}

export default Episode;
