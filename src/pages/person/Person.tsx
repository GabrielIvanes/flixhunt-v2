/* eslint-disable no-mixed-spaces-and-tabs */
import { useState, useEffect } from 'react';
import axios from 'axios';

import { Media, Movie, PersonDetails, TVShow } from '../../utils/interface';
import { useLocation, useParams } from 'react-router-dom';
import Loader from '../../components/loader/Loader';
import Element from '../../components/element/Element';

interface Props {
	backBaseUrl: string;
	TMDBBaseUrl: string;
}

function Person({ backBaseUrl, TMDBBaseUrl }: Props) {
	const { id } = useParams();
	const [person, setPerson] = useState<PersonDetails>();
	const [elementsOnTheScreen, setElementsOnTheScreen] = useState<string>(''); // Allows us to filter media by job type
	const [directorsCreatorsMedia, setDirectorsCreatorsMedia] = useState<Media[]>(
		[]
	);
	const [castMedia, setCastMedia] = useState<Media[]>([]);
	const [crewMedia, setCrewMedia] = useState<Media[]>([]);
	const [sortType, setSortType] = useState<string>('year-descending');
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const [_, setRerender] = useState<boolean>(window.innerWidth > 1000);
	const location = useLocation();

	window.addEventListener('resize', () => {
		setRerender(window.innerWidth > 1000);
	});

	async function getPersonDetails(id: number) {
		try {
			const response = await axios.get(
				`${backBaseUrl}/api/TMDB/persons/${id}`,
				{
					withCredentials: true,
				}
			);
			console.log(response.data);
			setPerson(response.data);
		} catch (err) {
			console.error(err);
		}
	}

	function getAge(birthday: string, deathday: string | null) {
		let birthDate: Date | null = null;
		let secondDate: Date | null = null; // Date of the day or date of the death
		if (birthday) {
			birthDate = new Date(birthday);
			if (deathday) {
				secondDate = new Date(deathday);
			} else {
				secondDate = new Date();
			}
			const difference: number = secondDate.getTime() - birthDate.getTime();
			const age: number = Math.floor(
				difference / (365.25 * 24 * 60 * 60 * 1000)
			);
			return age;
		}
	}

	function compareByDate(a: Media, b: Media, order: string): number {
		const dateA = new Date(
			a.media_type === 'movie'
				? (a as Movie).release_date
				: (a as TVShow).first_air_date
		);
		const dateB = new Date(
			b.media_type === 'movie'
				? (b as Movie).release_date
				: (b as TVShow).first_air_date
		);

		if (isNaN(dateA.getTime())) {
			return order === 'ascending' ? -1 : 1;
		}
		if (isNaN(dateB.getTime())) {
			return order === 'ascending' ? 1 : -1;
		}

		return order === 'ascending'
			? dateA.getTime() - dateB.getTime()
			: dateB.getTime() - dateA.getTime();
	}

	function compareByPopularity(a: Media, b: Media, order: string): number {
		const popularityScoreA: number = a.vote_average * a.vote_count;
		const popularityScoreB: number = b.vote_average * b.vote_count;

		if (order === 'descending') return popularityScoreB - popularityScoreA;
		else return popularityScoreA - popularityScoreB;
	}

	function sortArrays(
		sortType: string,
		castMedia: Media[],
		crewMedia: Media[],
		directorsCreatorsMedia: Media[]
	) {
		const sort = sortType.split('-');

		const updatedCastMedia = castMedia.sort((a, b) => {
			if (sort[0] === 'year') return compareByDate(a, b, sort[1]);
			else return compareByPopularity(a, b, sort[1]);
		});
		const updatedCrewMedia = crewMedia.sort((a, b) => {
			if (sort[0] === 'year') return compareByDate(a, b, sort[1]);
			else return compareByPopularity(a, b, sort[1]);
		});
		const updatedDirectorsCreatorsMedia = directorsCreatorsMedia.sort(
			(a, b) => {
				if (sort[0] === 'year') return compareByDate(a, b, sort[1]);
				else return compareByPopularity(a, b, sort[1]);
			}
		);

		setDirectorsCreatorsMedia(updatedDirectorsCreatorsMedia);
		setCastMedia(updatedCastMedia);
		setCrewMedia(updatedCrewMedia);
	}

	useEffect(() => {
		if (id) {
			const personId = parseInt(id);
			getPersonDetails(personId);
		}
	}, [id]);

	useEffect(() => {
		if (person) {
			const updatedDirectorsCreatorsMedia: Media[] = [];
			const updatedCastMedia: Media[] = [];
			const updatedCrewMedia: Media[] = [];

			const mediaCastId: number[] = [];
			const mediaCrewId: number[] = [];
			const mediaDirectorsCreatorsId: number[] = [];

			for (const media of person.combined_credits.crew) {
				if (media.job === 'Creator' || media.job === 'Director')
					if (!mediaDirectorsCreatorsId.includes(media.id)) {
						updatedDirectorsCreatorsMedia.push(media);
						mediaDirectorsCreatorsId.push(media.id);
					}
				if (!mediaCrewId.includes(media.id)) {
					updatedCrewMedia.push(media);
					mediaCrewId.push(media.id);
				}
			}

			for (const media of person.combined_credits.cast) {
				if (!mediaCastId.includes(media.id)) {
					updatedCastMedia.push(media);
					mediaCastId.push(media.id);
				}
			}

			sortArrays(
				sortType,
				updatedCastMedia,
				updatedCrewMedia,
				updatedDirectorsCreatorsMedia
			);

			if (location.state) {
				setElementsOnTheScreen(location.state);
			} else {
				switch (person.known_for_department) {
					case 'Acting':
						setElementsOnTheScreen('cast');
						break;
					case 'Directing':
						setElementsOnTheScreen('director-creator');
						break;
					default:
						setElementsOnTheScreen('crew');
						break;
				}
			}
		}
	}, [person]);

	return (
		<>
			{elementsOnTheScreen !== '' && person ? (
				<div className='wrapper person'>
					<div className='left'>
						<Element
							elementId={person.id}
							elementAdditionalInformation={null}
							elementName={null}
							elementNavigation={null}
							elementPoster={
								person.profile_path &&
								`${TMDBBaseUrl}original${person.profile_path}`
							}
							posterWidth={300}
							posterHeight={450}
							scrollPosition={null}
						/>
						{window.innerWidth > 1000 ? (
							<h2>Personal information</h2>
						) : (
							<h1>{person.name}</h1>
						)}
						{person.known_for_department && (
							<>
								<h3>Known for department</h3>
								<p>{person.known_for_department}</p>
							</>
						)}
						{person.birthday && (
							<>
								<h3>Date</h3>
								{person.deathday ? (
									<span>
										{person.birthday} / {person.deathday} (
										{getAge(person.birthday, person.deathday)} years old)
									</span>
								) : (
									<span>
										{person.birthday} (
										{getAge(person.birthday, person.deathday)} years old)
									</span>
								)}
							</>
						)}
						{person.place_of_birth && (
							<>
								<h3>Place of birth</h3>
								<p>{person.place_of_birth}</p>
							</>
						)}
					</div>
					<div className='right'>
						{window.innerWidth > 1000 && <h1>{person.name}</h1>}
						<h2>Biography</h2>
						{person.biography ? (
							<div className='biography'>
								{person.biography.split('\n').map((paragraph, index) => (
									<p key={index}>{paragraph}</p>
								))}
							</div>
						) : (
							<p>There is no overview provided.</p>
						)}
						<h2>Filmography</h2>
						<div className='filters'>
							<select
								value={elementsOnTheScreen}
								onChange={(event) => setElementsOnTheScreen(event.target.value)}
							>
								<option value='cast'>Cast</option>
								<option value='crew'>Crew</option>
								<option value='director-creator'>Director - Creator</option>
							</select>

							<select
								value={sortType}
								onChange={(event) => {
									setSortType(event.target.value);
									sortArrays(
										event.target.value,
										castMedia,
										crewMedia,
										directorsCreatorsMedia
									);
								}}
							>
								<option value='year-descending'>Year: descending</option>
								<option value='year-ascending'>Year: ascending</option>
								<option value='popularity-descending'>
									Popularity: descending
								</option>
								<option value='popularity-ascending'>
									Popularity: ascending
								</option>
							</select>
						</div>
						<div className='media'>
							{elementsOnTheScreen === 'cast'
								? castMedia.map((element) => (
										<Element
											key={element.id}
											elementId={element.id}
											elementAdditionalInformation={
												element.media_type === 'movie'
													? (element as Movie).release_date.slice(0, 4) &&
													  (element as Movie).release_date.slice(0, 4)
													: (element as TVShow).first_air_date.slice(0, 4) &&
													  (element as TVShow).first_air_date.slice(0, 4)
											}
											elementName={
												element.media_type === 'movie'
													? (element as Movie).title
													: (element as TVShow).name
											}
											elementNavigation={
												element.media_type === 'movie'
													? `/movies/${element.id}`
													: `/tv/${element.id}`
											}
											elementPoster={
												element.poster_path &&
												`${TMDBBaseUrl}original${element.poster_path}`
											}
											scrollPosition={null}
											posterWidth={window.innerWidth > 1000 ? 233.3 : 150}
											posterHeight={window.innerWidth > 1000 ? 350 : 225}
										/>
								  ))
								: elementsOnTheScreen === 'crew'
								? crewMedia.map((element) => (
										<Element
											key={element.id}
											elementId={element.id}
											elementAdditionalInformation={
												element.media_type === 'movie'
													? (element as Movie).release_date.slice(0, 4) &&
													  (element as Movie).release_date.slice(0, 4)
													: (element as TVShow).first_air_date.slice(0, 4) &&
													  (element as TVShow).first_air_date.slice(0, 4)
											}
											elementName={
												element.media_type === 'movie'
													? (element as Movie).title
													: (element as TVShow).name
											}
											elementNavigation={
												element.media_type === 'movie'
													? `/movies/${element.id}`
													: `/tv/${element.id}`
											}
											elementPoster={
												element.poster_path &&
												`${TMDBBaseUrl}original${element.poster_path}`
											}
											scrollPosition={null}
											posterWidth={window.innerWidth > 1000 ? 233.3 : 150}
											posterHeight={window.innerWidth > 1000 ? 350 : 225}
										/>
								  ))
								: directorsCreatorsMedia.map((element) => (
										<Element
											key={element.id}
											elementId={element.id}
											elementAdditionalInformation={
												element.media_type === 'movie'
													? (element as Movie).release_date.slice(0, 4) &&
													  (element as Movie).release_date.slice(0, 4)
													: (element as TVShow).first_air_date.slice(0, 4) &&
													  (element as TVShow).first_air_date.slice(0, 4)
											}
											elementName={
												element.media_type === 'movie'
													? (element as Movie).title
													: (element as TVShow).name
											}
											elementNavigation={
												element.media_type === 'movie'
													? `/movies/${element.id}`
													: `/tv/${element.id}`
											}
											elementPoster={
												element.poster_path &&
												`${TMDBBaseUrl}original${element.poster_path}`
											}
											scrollPosition={null}
											posterWidth={window.innerWidth > 1000 ? 233.3 : 150}
											posterHeight={window.innerWidth > 1000 ? 350 : 225}
										/>
								  ))}
						</div>
					</div>
				</div>
			) : (
				<Loader />
			)}
		</>
	);
}

export default Person;
