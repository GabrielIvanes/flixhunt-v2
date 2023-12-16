import { useState } from 'react';

import ElementDetails from './element-detail/ElementDetails';
import Trailer from './trailer/Trailer';
import List from '../list/List';
// import GoBack from '../goBack/GoBack';

import {
	Crew,
	ElementList,
	ElementParent,
	Genre,
	Provider,
	VideoItem,
} from '../../utils/interface';

interface Props {
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
	trailer: VideoItem | null;
	elementsId: number[];
	setElementsId: (elementsId: number[]) => void;
}

function ElementPage({
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
	trailer,
	elementsId,
	setElementsId,
}: Props) {
	const [showTrailer, setShowTrailer] = useState<boolean>(false);

	return (
		<div
			className='wrapper'
			style={
				showTrailer
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
					media={elementMedia}
					setShowTrailer={setShowTrailer}
					elementsId={elementsId}
					setElementsId={setElementsId}
				/>
			</section>

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
