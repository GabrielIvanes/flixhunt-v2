import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';

import {
	Crew,
	Provider,
	VideoItem,
	SeasonDetails,
	TVShowDetails,
	ElementList,
} from '../../utils/interface';
import ElementPage from '../../components/element-page/ElementPage';

interface Props {
	backBaseUrl: string;
	TMDBBaseUrl: string;
	elementsId: number[];
	setElementsId: (elementsId: number[]) => void;
}

function Season({
	backBaseUrl,
	TMDBBaseUrl,
	elementsId,
	setElementsId,
}: Props) {
	const { id, nbSeason } = useParams();
	const [TVShow, setTVShow] = useState<TVShowDetails>();
	const [season, setSeason] = useState<SeasonDetails>();
	const [providers, setProviders] = useState<Provider[]>([]);
	const [lists, setLists] = useState<ElementList[]>([]);
	const [trailer, setTrailer] = useState<VideoItem>();

	async function getSeasonDetails(TVId: number, nbSeason: number) {
		try {
			const response = await axios.get(
				`${backBaseUrl}/api/TMDB/tv/${TVId}/seasons/${nbSeason}`,
				{
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
				withCredentials: true,
			});
			setTVShow(response.data);
		} catch (err) {
			console.error(err);
		}
	}

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
					elementWidth: 266.7,
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

	return (
		season &&
		TVShow && (
			<ElementPage
				elementId={season.id}
				elementBackdropPath={
					TVShow.backdrop_path &&
					`${TMDBBaseUrl}original${TVShow.backdrop_path}`
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
				elementProviders={providers}
				elementRating={null}
				elementTagline={null}
				trailer={trailer ? trailer : null}
				elementsId={elementsId}
				setElementsId={setElementsId}
			/>
		)
	);
}

export default Season;
