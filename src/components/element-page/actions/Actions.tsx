import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
	faPlay,
	faHeart as faHeartFull,
	faBookmark as faBookmarkFull,
	faList,
	faPen,
} from '@fortawesome/free-solid-svg-icons';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import {
	faHeart,
	faBookmark,
	faEye,
	faEyeSlash,
} from '@fortawesome/free-regular-svg-icons';
import { useState, SVGProps } from 'react';

import './actions.scss';
import { ElementActions } from '../../../utils/interface';

interface Props {
	isElementHaveTrailer: boolean;
	setShowTrailer: (bool: boolean) => void;
}

export function MdiMovieOpenRemoveOutline(props: SVGProps<SVGSVGElement>) {
	return (
		<svg
			xmlns='http://www.w3.org/2000/svg'
			width='1em'
			height='1em'
			viewBox='0 0 24 24'
			{...props}
		>
			<path
				fill='currentColor'
				d='m19.65 6.5l-2.74-3.54l3.93-.78l.78 3.92l-1.97.4m-2.94.57l-2.74-3.53l-1.97.39l2.75 3.53l1.96-.39M4.16 5.5l-.98.19a1.995 1.995 0 0 0-1.57 2.35L2 10l4.9-.97L4.16 5.5m7.65 2.55L9.07 4.5l-1.97.41l2.75 3.53l1.96-.39M4 20v-8h16v1.09c.72.12 1.39.37 2 .72V10H2v10a2 2 0 0 0 2 2h9.81c-.35-.61-.59-1.28-.72-2H4m18.54-3.12l-1.42-1.41L19 17.59l-2.12-2.12l-1.41 1.41L17.59 19l-2.12 2.12l1.41 1.42L19 20.41l2.12 2.13l1.42-1.42L20.41 19l2.13-2.12Z'
			></path>
		</svg>
	);
}

export function MdiMovieOpenCheck(props: SVGProps<SVGSVGElement>) {
	return (
		<svg
			xmlns='http://www.w3.org/2000/svg'
			width='1em'
			height='1em'
			viewBox='0 0 24 24'
			{...props}
		>
			<path
				fill='currentColor'
				d='m19.65 6.5l-2.74-3.54l3.93-.78l.78 3.92l-1.97.4m-2.94.57l-2.74-3.53l-1.97.39l2.75 3.53l1.96-.39M19 13c1.1 0 2.12.3 3 .81V10H2v10a2 2 0 0 0 2 2h9.81c-.51-.88-.81-1.9-.81-3c0-3.31 2.69-6 6-6m-7.19-4.95L9.07 4.5l-1.97.41l2.75 3.53l1.96-.39M4.16 5.5l-.98.19a2.008 2.008 0 0 0-1.57 2.35L2 10l4.9-.97L4.16 5.5m17.18 10.34l-3.59 3.59l-1.59-1.59L15 19l2.75 3l4.75-4.75l-1.16-1.41Z'
			></path>
		</svg>
	);
}

function Actions({ isElementHaveTrailer, setShowTrailer }: Props) {
	const [elementActions, setElementActions] = useState<ElementActions>({
		like: {
			value: false,
			date: null,
		},
		watchlist: {
			value: false,
			date: null,
		},
		seen: {
			value: false,
			date: null,
		},
		theaterSeen: {
			value: false,
			date: null,
		},
		comment: {
			value: '',
			date: null,
		},
	});

	return (
		<div className='actions'>
			{isElementHaveTrailer && (
				<div
					className={
						window.innerWidth > 950
							? 'trailer clickable'
							: 'trailer clickable icon-actions-wrapper'
					}
					onClick={() => setShowTrailer(true)}
				>
					<FontAwesomeIcon icon={faPlay} />
					{window.innerWidth > 950 && <span>Run Trailer</span>}
				</div>
			)}
			<div
				className='clickable icon-actions-wrapper'
				onClick={() =>
					setElementActions((prevElementActions) => ({
						...prevElementActions,
						like: {
							...prevElementActions.like,
							value: !prevElementActions.like.value,
						},
					}))
				}
			>
				{(elementActions.like.value as boolean) ? (
					<>
						<FontAwesomeIcon icon={faHeartFull} />
					</>
				) : (
					<>
						<FontAwesomeIcon icon={faHeart as IconProp} />
					</>
				)}
			</div>
			<div
				className='clickable icon-actions-wrapper'
				onClick={() =>
					setElementActions((prevElementActions) => ({
						...prevElementActions,
						watchlist: {
							...prevElementActions.watchlist,
							value: !prevElementActions.watchlist.value,
						},
					}))
				}
			>
				{(elementActions.watchlist.value as boolean) ? (
					<>
						<FontAwesomeIcon icon={faBookmarkFull} />
					</>
				) : (
					<>
						<FontAwesomeIcon icon={faBookmark as IconProp} />
					</>
				)}
			</div>
			<div
				className='clickable icon-actions-wrapper'
				onClick={() =>
					setElementActions((prevElementActions) => ({
						...prevElementActions,
						seen: {
							...prevElementActions.seen,
							value: !prevElementActions.seen.value,
						},
					}))
				}
			>
				{(elementActions.seen.value as boolean) ? (
					<>
						<FontAwesomeIcon icon={faEye as IconProp} />
					</>
				) : (
					<>
						<FontAwesomeIcon icon={faEyeSlash as IconProp} />
					</>
				)}
			</div>
			<div
				className='clickable icon-actions-wrapper'
				onClick={() =>
					setElementActions((prevElementActions) => ({
						...prevElementActions,
						theaterSeen: {
							...prevElementActions.theaterSeen,
							value: !prevElementActions.theaterSeen.value,
						},
					}))
				}
			>
				{(elementActions.theaterSeen.value as boolean) ? (
					<>
						<MdiMovieOpenCheck />
					</>
				) : (
					<>
						<MdiMovieOpenRemoveOutline />
					</>
				)}
			</div>
			<div className='clickable icon-actions-wrapper'>
				<FontAwesomeIcon icon={faList as IconProp} />
			</div>
			<div className='clickable icon-actions-wrapper'>
				<FontAwesomeIcon icon={faPen as IconProp} />
			</div>
		</div>
	);
}

export default Actions;
