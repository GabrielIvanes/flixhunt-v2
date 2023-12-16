import { ElementType, Image } from '../../utils/interface';
import ElementsCarousel from './carousel/ElementsCarousel';
import './list.scss';

interface Props {
	name: string;
	TMDBBaseUrl: string;
	elements: ElementType[] | Image[];
	elementWidth: number;
	elementHeight: number;
}

function List({
	name,
	TMDBBaseUrl,
	elements,
	elementWidth,
	elementHeight,
}: Props) {
	return (
		<div className='list'>
			<h1>{name}</h1>
			<ElementsCarousel
				elements={elements}
				TMDBBaseUrl={TMDBBaseUrl}
				elementWidth={elementWidth}
				elementHeight={elementHeight}
			/>
		</div>
	);
}

export default List;
