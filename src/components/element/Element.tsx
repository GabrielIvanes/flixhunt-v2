import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faImage } from '@fortawesome/free-solid-svg-icons';

import './element.scss';

interface Props {
	elementId: number;
	elementName: string | null;
	elementPoster: string | null;
	elementDate: string | null;
	posterWidth: number;
	posterHeight: number;
}

function Element({
	elementId,
	elementName = null,
	elementPoster = null,
	elementDate = null,
	posterWidth,
	posterHeight,
}: Props) {
	return (
		<>
			{elementPoster ? (
				<img
					src={elementPoster}
					alt={elementName ? elementName : elementId.toString()}
					className='poster-element'
					width={posterWidth}
					height={posterHeight}
				/>
			) : (
				<div
					className='poster-element'
					style={{
						width: `${posterWidth}px`,
						height: `${posterHeight}px`,
						fontSize: `${posterWidth / 3}px`,
					}}
				>
					<FontAwesomeIcon icon={faImage} />
				</div>
			)}
			{elementName && <p className='name-element'>{elementName}</p>}
			{elementDate && <p className='date-element second-font'>{elementDate}</p>}
		</>
	);
}

export default Element;
