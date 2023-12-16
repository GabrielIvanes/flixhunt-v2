import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faImage } from '@fortawesome/free-solid-svg-icons';

import './element.scss';
import { useNavigate } from 'react-router-dom';

interface Props {
	elementId: number;
	elementName: string | null;
	elementPoster: string | null;
	elementAdditionalInformation: string | null;
	elementNavigation: string | null;
	posterWidth: number;
	posterHeight: number;
	scrollPosition: number | null;
}

function Element({
	elementId,
	elementName = null,
	elementPoster = null,
	elementAdditionalInformation = null,
	elementNavigation,
	posterWidth,
	posterHeight,
	scrollPosition,
}: Props) {
	const navigate = useNavigate();

	function handleElementClick() {
		if (elementNavigation) {
			navigate(elementNavigation);
			window.scrollTo(0, 0);
		}
	}

	return (
		<div
			className='element'
			style={{
				transform: `translateX(-${scrollPosition}px)`,
				transition: 'transform 0.5s ease-in-out',
				width: `${posterWidth}px`,
			}}
		>
			{elementPoster ? (
				<img
					src={elementPoster}
					alt={elementName ? elementName : elementId.toString()}
					className='poster-element'
					style={{
						width: `${posterWidth}px`,
						height: `${posterHeight}px`,
						fontSize: `${posterWidth / 3}px`,
						...(elementNavigation !== null ? { cursor: 'pointer' } : {}),
					}}
					onClick={handleElementClick}
				/>
			) : (
				<div
					className='poster-element'
					style={{
						width: `${posterWidth}px`,
						height: `${posterHeight}px`,
						fontSize: `${posterWidth / 3}px`,
						...(elementNavigation !== null ? { cursor: 'pointer' } : {}),
					}}
					onClick={handleElementClick}
				>
					<FontAwesomeIcon icon={faImage} />
				</div>
			)}
			{elementName && (
				<p className='name-element' onClick={handleElementClick}>
					{elementName}
				</p>
			)}
			{elementAdditionalInformation && (
				<p className='second-font'>{elementAdditionalInformation}</p>
			)}
		</div>
	);
}

export default Element;
