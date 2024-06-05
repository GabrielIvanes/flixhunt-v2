import { useState } from 'react';

import ElementDetails from './element-detail/ElementDetails';
import Trailer from './trailer/Trailer';
import List from '../list/List';
import './element-page.css';
// import GoBack from '../goBack/GoBack';

import {
	Comment as CommentType,
	Crew,
	ElementAction,
	ElementList,
	ElementParent,
	Genre,
	Provider,
	VideoItem,
} from '../../utils/interface';
import Comment from './comment/Comment';
import OtherLists from './other-lists/OtherLists';

interface Props {
	comment: CommentType;
	handleSubmitComment: (commentValue: string) => void;
	elementId: number;
	elementBackdropPath: string | null;
	elementDate: string | null;
	elementDuration: number | null;
	elementCreatorsOrDirectors: Crew[] | null;
	elementGenres: Genre[] | null;
	elementName: string;
	elementOverview: string | null;
	elementPoster: string | null;
	elementProviders: Provider[] | null;
	elementRating: number | null;
	elementTagline: string | null;
	elementMedia: 'movie' | 'tv' | 'season' | 'episode';
	elementLists: ElementList[] | null;
	elementNumberSeasons: number | null;
	elementNumberEpisodes: number | null;
	elementParents: ElementParent[] | null;
	elementPosterHeight: number;
	elementPosterWidth: number;
	elementActions: ElementAction[];
	handleIconClick: (elementsAction: ElementAction | null) => void;
	trailer: VideoItem | null;
	elementsId: number[];
	setElementsId: (elementsId: number[]) => void;
}

function ElementPage({
	comment,
	handleSubmitComment,
	elementId,
	elementBackdropPath,
	elementDate,
	elementDuration,
	elementCreatorsOrDirectors,
	elementGenres,
	elementName,
	elementOverview,
	elementPoster,
	elementProviders,
	elementRating,
	elementTagline,
	elementMedia,
	elementNumberSeasons,
	elementNumberEpisodes,
	elementParents,
	elementLists,
	elementPosterWidth,
	elementPosterHeight,
	elementActions,
	handleIconClick,
	trailer,
	elementsId,
	setElementsId,
}: Props) {
	const [showTrailer, setShowTrailer] = useState<boolean>(false);
	const [showComment, setShowComment] = useState<boolean>(false);
	const [showOtherLists, setShowOtherLists] = useState<boolean>(false);

	return (
		<div
			className='wrapper'
			style={
				showTrailer || showComment || showOtherLists
					? { overflow: 'hidden', height: '100vh' }
					: { overflow: 'visible', height: 'fit-content' }
			}
		>
			{/* {window.innerWidth < 650 && <GoBack />} */}
			{elementBackdropPath && (
				<div
					className='backdrop'
					style={{
						backgroundImage: `url(${elementBackdropPath})`,
					}}
				></div>
			)}
			{trailer && showTrailer && (
				<Trailer trailer={trailer} setShowTrailer={setShowTrailer} />
			)}

			{showComment && (
				<Comment
					comment={comment}
					handleSubmitComment={handleSubmitComment}
					setShowComment={setShowComment}
				/>
			)}

			{showOtherLists && (
				<OtherLists
					elementLists={elementActions}
					setShowOtherLists={setShowOtherLists}
					media={elementMedia}
					handleIconClick={handleIconClick}
				/>
			)}

			<section className='element-details-wrapper'>
				<ElementDetails
					elementId={elementId}
					elementDate={elementDate}
					elementDirectors={elementCreatorsOrDirectors}
					elementDuration={elementDuration}
					elementGenres={elementGenres}
					elementName={elementName}
					elementOverview={elementOverview}
					elementPoster={elementPoster}
					elementProviders={elementProviders}
					elementRating={elementRating}
					elementTagLine={elementTagline}
					elementShowNumberEpisodes={elementNumberEpisodes}
					elementShowNumberSeasons={elementNumberSeasons}
					elementParents={elementParents}
					elementPosterHeight={elementPosterHeight}
					elementPosterWidth={elementPosterWidth}
					isElementHaveTrailer={trailer ? true : false}
					elementActions={elementActions}
					handleIconClick={handleIconClick}
					setShowOtherLists={setShowOtherLists}
					media={elementMedia}
					setShowTrailer={setShowTrailer}
					setShowComment={setShowComment}
					elementsId={elementsId}
					setElementsId={setElementsId}
				/>
			</section>

			{comment && comment.comment !== '' && (
				<section>
					<div className='list comment-wrapper'>
						<h1>Comment</h1>
						<div className='comment'>{comment.comment}</div>
						<div className='second-font comment-date'>{comment.date}</div>
					</div>
				</section>
			)}

			{elementLists &&
				elementLists.length > 0 &&
				elementLists.map((elementList) => (
					<section key={elementList.list.name}>
						<List
							name={elementList.list.name}
							elements={elementList.list.elements}
							TMDBBaseUrl={elementList.TMDBBaseUrl}
							elementWidth={elementList.elementWidth}
							elementHeight={elementList.elementHeight}
						/>
					</section>
				))}
		</div>
	);
}

export default ElementPage;
