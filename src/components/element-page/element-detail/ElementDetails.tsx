/* eslint-disable no-mixed-spaces-and-tabs */
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
	faCalendar,
	faHourglassStart,
	faStar,
} from '@fortawesome/free-solid-svg-icons';
import { useState } from 'react';

import { Crew, ElementParent, Genre, Provider } from '../../../utils/interface';
import Element from '../../element/Element';
import './element-details.scss';
import Actions from '../actions/Actions';
import { useNavigate } from 'react-router-dom';

interface Props {
	elementId: number;
	elementPoster: string | null;
	elementName: string;
	elementDirectors: Crew[] | null;
	elementTagLine: string | null;
	elementOverview: string | null;
	elementDate: string | null;
	elementGenres: Genre[] | null;
	elementDuration: number | null;
	elementRating: number | null;
	elementProviders: Provider[] | null;
	elementShowNumberSeasons: number | null;
	elementShowNumberEpisodes: number | null;
	elementParents: ElementParent[] | null;
	isElementHaveTrailer: boolean;
	media: 'movie' | 'tv' | 'season';
	setShowTrailer: (bool: boolean) => void;
	elementsId: number[];
	setElementsId: (elementsId: number[]) => void;
}

function ElementDetails({
	elementId,
	elementPoster,
	elementName,
	elementDirectors,
	elementTagLine,
	elementOverview,
	elementDate,
	elementGenres,
	elementDuration,
	elementRating,
	elementProviders,
	elementShowNumberEpisodes,
	elementShowNumberSeasons,
	elementParents,
	elementsId,
	setElementsId,
	media,
	setShowTrailer,
	isElementHaveTrailer,
}: Props) {
	const [_, setRerender] = useState<boolean>(window.innerWidth > 975);
	const navigate = useNavigate();

	function convertTime(minutes: number) {
		const hour = Math.floor(minutes / 60);
		const minute = minutes % 60;
		const minuteString = minute >= 10 ? `${minute}` : `0${minute}`;
		return `${hour}h ${minuteString}m`;
	}

	function navigateToParent() {
		if (elementParents && elementParents.length > 0) {
			if (elementParents.length === 1)
				navigate(`/tv/${elementParents[0].number}`);
			else if (elementParents.length === 2)
				navigate(
					`/tv/${elementParents[0].number}/seasons/${elementParents[1].number}`
				);
			const elementsIdTmp: number[] = [...elementsId];
			elementsIdTmp.pop();
			setElementsId(elementsIdTmp);
		}
	}

	window.addEventListener('resize', () => {
		setRerender(window.innerWidth > 950);
	});

	return (
		<div className='element-details'>
			<div className='left'>
				<Element
					elementId={elementId}
					elementName={null}
					elementPoster={elementPoster}
					elementAdditionalInformation={null}
					elementNavigation={null}
					posterWidth={333}
					posterHeight={500}
					scrollPosition={null}
				/>
			</div>
			<div className='right'>
				{elementParents ? (
					<h1>
						{elementParents.map((elementParent: ElementParent, index) => (
							<span
								key={index}
								className='clickable'
								onClick={navigateToParent}
							>
								{elementParent.name}
							</span>
						))}
						<span> - {elementName}</span>
					</h1>
				) : (
					<h1>{elementName}</h1>
				)}
				{elementDirectors === null || elementDirectors.length === 0 ? (
					<>
						{media === 'movie' ? (
							<>
								<h2>Director</h2>
								<p>There is no director provided.</p>
							</>
						) : media === 'tv' ? (
							<>
								<h2>Creator</h2>
								<p>There is no creator provided.</p>
							</>
						) : (
							''
						)}
					</>
				) : elementDirectors.length === 1 ? (
					<>
						<h2>{media === 'movie' ? 'Director' : 'Creator'}</h2>
						<span className='director-creator clickable'>
							{elementDirectors[0].name}
						</span>
					</>
				) : (
					<>
						<h2>{media === 'movie' ? 'Directors' : 'Creators'}</h2>
						{elementDirectors.map((elementDirector, index) => (
							<React.Fragment key={elementDirector.id}>
								<span className='director-creator clickable'>
									{elementDirector.name}
								</span>
								<span>{index < elementDirectors.length - 1 ? ', ' : ''}</span>
							</React.Fragment>
						))}
					</>
				)}
				{elementTagLine && (
					<p className='second-font tagline'>{elementTagLine}</p>
				)}
				<h2>Overview</h2>
				{elementOverview ? (
					<div className={media === 'season' ? 'season-overview' : 'overview'}>
						{elementOverview.split('\n').map((paragraph, index) => (
							<p key={index}>{paragraph}</p>
						))}
					</div>
				) : (
					<p>There is no overview provided.</p>
				)}
				<div className='row'>
					{elementDate && (
						<div>
							<span>{elementDate}</span>
							{window.innerWidth > 950 && (
								<span className='icon-row'>
									<FontAwesomeIcon icon={faCalendar} />
								</span>
							)}
						</div>
					)}
					{elementDuration && (
						<div>
							<span>{convertTime(elementDuration)}</span>
							{_ && (
								<span className='icon-row'>
									<FontAwesomeIcon icon={faHourglassStart} />
								</span>
							)}
						</div>
					)}
					{elementRating && (
						<div>
							<span>{elementRating}/10</span>
							{_ && (
								<span className='icon-row'>
									<FontAwesomeIcon icon={faStar} />
								</span>
							)}
						</div>
					)}
					{elementShowNumberSeasons &&
						(elementShowNumberSeasons > 1 ? (
							<div>{elementShowNumberSeasons} seasons</div>
						) : (
							<div>{elementShowNumberSeasons} season</div>
						))}
					{elementShowNumberEpisodes &&
						(elementShowNumberEpisodes > 1 ? (
							<div>{elementShowNumberEpisodes} episodes</div>
						) : (
							<div>{elementShowNumberEpisodes} episode</div>
						))}
				</div>
				{elementGenres &&
					elementGenres.length > 0 &&
					(_ ? (
						<div className='row genre-laptop'>
							{elementGenres.map((elementGenre) => (
								<div key={elementGenre.id} className='clickable'>
									{elementGenre.name}
								</div>
							))}
						</div>
					) : (
						<div className='genre-phone'>
							{elementGenres.length === 1 ? <h2>Genre</h2> : <h2>Genres</h2>}
							{elementGenres.map((elementGenre, index) => (
								<span key={elementGenre.id}>
									<span className='clickable'>{elementGenre.name}</span>
									<span>{index < elementGenres.length - 1 ? ', ' : ''}</span>
								</span>
							))}
						</div>
					))}
				<Actions
					isElementHaveTrailer={isElementHaveTrailer}
					setShowTrailer={setShowTrailer}
				/>
				{elementProviders && elementProviders.length > 0 && (
					<div className='providers-wrapper'>
						<h2>Streaming</h2>
						<div className='providers'>
							{elementProviders.map((provider) => (
								<img
									key={provider.provider_id}
									src={provider.logo_path}
									alt={provider.provider_name}
								/>
							))}
						</div>
					</div>
				)}
			</div>
		</div>
	);
}

export default ElementDetails;
