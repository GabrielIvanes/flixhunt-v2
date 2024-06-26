/* eslint-disable no-mixed-spaces-and-tabs */
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
	faCalendar,
	faHourglassStart,
	faStar,
} from '@fortawesome/free-solid-svg-icons';
import { useState } from 'react';

import {
	Crew,
	ElementAction,
	ElementParent,
	Genre,
	Provider,
} from '../../../utils/interface';
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
	elementPosterHeight: number;
	elementPosterWidth: number;
	isElementHaveTrailer: boolean;
	elementActions: ElementAction[];
	handleIconClick: (elementsAction: ElementAction | null) => void;
	media: 'movie' | 'tv' | 'season' | 'episode';
	setShowTrailer: (bool: boolean) => void;
	setShowOtherLists: (bool: boolean) => void;
	setShowComment: (bool: boolean) => void;
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
	elementPosterWidth,
	elementPosterHeight,
	elementsId,
	setElementsId,
	media,
	elementActions,
	handleIconClick,
	setShowTrailer,
	setShowComment,
	setShowOtherLists,
	isElementHaveTrailer,
}: Props) {
	const [_, setRerender] = useState<boolean>(window.innerWidth > 975);
	const navigate = useNavigate();

	function convertTime(minutes: number) {
		const hour = Math.floor(minutes / 60);
		const minute = minutes % 60;
		const minuteString = minute >= 10 ? `${minute}` : `0${minute}`;
		if (hour > 0) {
			return `${hour}h ${minuteString}m`;
		} else if (minute > 0) {
			return `${minuteString} min`;
		} else {
			return '';
		}
	}

	function navigateToParent(index: number) {
		let elementsIdTmp: number[] = [...elementsId];
		if (elementParents) {
			if (index === 0) {
				navigate(`/tv/${elementParents[0].number}`);
				elementsIdTmp = [elementParents[0].number];
			} else if (index === 1) {
				navigate(
					`/tv/${elementParents[0].number}/seasons/${elementParents[1].number}`
				);
				elementsIdTmp.pop();
			}
		}
		setElementsId(elementsIdTmp);
	}

	function handleGenreClick(genre: Genre) {
		if (media === 'tv') {
			navigate('/tv', { state: genre });
		} else {
			navigate('/movies', { state: genre });
		}
	}

	window.addEventListener('resize', () => {
		setRerender(window.innerWidth > 950);
	});

	return (
		<div
			className={`element-details ${media}`}
			style={{
				// height: `${elementPosterHeight + 10}px`,
				height: 'fit-content',
				gridTemplateColumns: `${elementPosterWidth + 10}px 1fr`,
			}}
		>
			<div className='left'>
				<Element
					elementId={elementId}
					elementName={null}
					elementPoster={elementPoster}
					elementAdditionalInformation={null}
					elementNavigation={null}
					posterWidth={elementPosterWidth}
					posterHeight={elementPosterHeight}
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
								onClick={() => navigateToParent(index)}
							>
								{elementParent.name} -{' '}
							</span>
						))}
						<span>{elementName}</span>
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
						<span
							className='director-creator clickable'
							onClick={() =>
								navigate(`/persons/${elementDirectors[0].id}`, {
									state: 'director-creator',
								})
							}
						>
							{elementDirectors[0].name}
						</span>
					</>
				) : (
					<>
						<h2>{media === 'movie' ? 'Directors' : 'Creators'}</h2>
						{elementDirectors.map((elementDirector, index) => (
							<React.Fragment key={elementDirector.id}>
								<span
									className='director-creator clickable'
									onClick={() =>
										navigate(`/persons/${elementDirector.id}`, {
											state: 'director-creator',
										})
									}
								>
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
					{elementDuration &&
						elementDuration &&
						convertTime(elementDuration) != '0' && (
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
								<div
									key={elementGenre.id}
									className='clickable'
									onClick={() => handleGenreClick(elementGenre)}
								>
									{elementGenre.name}
								</div>
							))}
						</div>
					) : (
						<div className='genre-phone'>
							{elementGenres.length === 1 ? <h2>Genre</h2> : <h2>Genres</h2>}
							{elementGenres.map((elementGenre, index) => (
								<span key={elementGenre.id}>
									<span
										className='clickable'
										onClick={() => handleGenreClick(elementGenre)}
									>
										{elementGenre.name}
									</span>
									<span>{index < elementGenres.length - 1 ? ', ' : ''}</span>
								</span>
							))}
						</div>
					))}
				<Actions
					elementActions={elementActions}
					handleIconClick={handleIconClick}
					isElementHaveTrailer={isElementHaveTrailer}
					setShowTrailer={setShowTrailer}
					setShowComment={setShowComment}
					setShowOtherLists={setShowOtherLists}
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
