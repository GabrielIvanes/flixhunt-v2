import { useState, useEffect, useRef } from 'react';

import { ElementType, Movie, TVShow } from '../../utils/interface';
import './elementsCarousel.scss';
import Element from '../element/Element';

interface Props {
	elements: ElementType[];
	TMDBBaseUrl: string;
	elementWidth: number;
}

function ElementsCarousel({ elements, TMDBBaseUrl, elementWidth }: Props) {
	const carouselScroll = useRef<HTMLDivElement>(null);
	const [scrollPosition, setScrollPosition] = useState<number>(0);
	const [maxReached, setMaxReached] = useState<boolean>(false);
	const maxScrollPosition = carouselScroll.current
		? carouselScroll.current.scrollWidth - carouselScroll.current.clientWidth
		: 0;

	function next() {
		if (carouselScroll.current) {
			const scrollWidth = carouselScroll.current.scrollWidth;
			const scrollAmount =
				window.innerWidth > 950
					? carouselScroll.current.clientWidth * 0.5
					: carouselScroll.current.clientWidth * 0.8;
			const newScrollPosition = Math.min(
				scrollPosition + scrollAmount,
				scrollWidth - carouselScroll.current.clientWidth
			);
			setScrollPosition(newScrollPosition);
		}
	}

	function prev() {
		if (carouselScroll.current) {
			const scrollAmount =
				window.innerWidth > 950
					? carouselScroll.current.clientWidth * 0.5
					: carouselScroll.current.clientWidth * 0.8;
			const newScrollPosition = Math.max(scrollPosition - scrollAmount, 0);
			setScrollPosition(newScrollPosition);
		}
	}

	useEffect(() => {
		if (
			(carouselScroll.current &&
				window.innerWidth >= carouselScroll.current.scrollWidth) ||
			(scrollPosition >= maxScrollPosition && scrollPosition !== 0)
		) {
			setMaxReached(true);
		} else {
			setMaxReached(false);
		}
	}, [maxScrollPosition, scrollPosition]);

	return (
		<div className='elements-carousel' ref={carouselScroll}>
			{elements.map((element) => (
				<div
					className='element-carousel'
					key={element.id}
					style={{
						transform: `translateX(-${scrollPosition}px)`,
						transition: 'transform 0.5s ease-in-out',
						width: `${elementWidth}px`,
					}}
				>
					{Object.prototype.hasOwnProperty.call(element, 'title') ? (
						<Element
							elementId={element.id}
							elementName={(element as Movie).title}
							elementPoster={`${TMDBBaseUrl}original${element.poster_path}`}
							elementDate={(element as Movie).release_date}
							posterHeight={elementWidth * (3 / 2)}
							posterWidth={elementWidth}
						/>
					) : (
						<Element
							elementId={element.id}
							elementName={(element as TVShow).name}
							elementPoster={`${TMDBBaseUrl}original${element.poster_path}`}
							elementDate={(element as TVShow).first_air_date}
							posterHeight={elementWidth * (3 / 2)}
							posterWidth={elementWidth}
						/>
					)}
				</div>
			))}
			{!maxReached && (
				<button
					onClick={next}
					className='btn-carousel btn-next'
					style={{ top: `${elementWidth * (3 / 4)}px` }}
				>
					&#62;
				</button>
			)}
			{scrollPosition !== 0 && (
				<button
					onClick={prev}
					className='btn-carousel btn-prev'
					style={{ top: `${elementWidth * (3 / 4)}px` }}
				>
					&#60;
				</button>
			)}
		</div>
	);
}

export default ElementsCarousel;
