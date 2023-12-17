/* eslint-disable no-mixed-spaces-and-tabs */
import React from 'react';
import { useState, useEffect, useRef } from 'react';

import {
	Cast,
	Crew,
	ElementType,
	Movie,
	Person,
	TVShow,
	Season,
	Episode,
	Image,
} from '../../../utils/interface';
import './elementsCarousel.scss';
import Element from '../../element/Element';

interface Props {
	elements: ElementType[] | Image[];
	TMDBBaseUrl: string;
	elementWidth: number;
	elementHeight: number;
}

function ElementsCarousel({
	elements,
	TMDBBaseUrl,
	elementWidth,
	elementHeight,
}: Props) {
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
					: carouselScroll.current.clientWidth * 0.625;
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
					: carouselScroll.current.clientWidth * 0.625;
			const newScrollPosition = Math.max(scrollPosition - scrollAmount, 0);
			setScrollPosition(newScrollPosition);
		}
	}

	useEffect(() => {
		function isMaxReached() {
			if (
				(carouselScroll.current &&
					window.innerWidth >= carouselScroll.current.scrollWidth) ||
				(scrollPosition >= maxScrollPosition && scrollPosition !== 0)
			) {
				setMaxReached(true);
			} else {
				setMaxReached(false);
			}
		}

		isMaxReached();

		window.addEventListener('resize', () => {
			setScrollPosition(0);
			isMaxReached();
		});
	}, [maxScrollPosition, scrollPosition]);

	return (
		<div className='elements-carousel' ref={carouselScroll}>
			{elements.map((element, index) =>
				Object.prototype.hasOwnProperty.call(element, 'id') ? (
					<React.Fragment key={(element as ElementType).id}>
						{Object.prototype.hasOwnProperty.call(element, 'title') ? (
							<Element
								elementId={(element as ElementType).id}
								elementName={(element as Movie).title}
								elementPoster={
									(element as Movie).poster_path &&
									`${TMDBBaseUrl}original${(element as Movie).poster_path}`
								}
								elementAdditionalInformation={(element as Movie).release_date}
								elementNavigation={`/movies/${(element as ElementType).id}`}
								posterHeight={elementHeight}
								posterWidth={elementWidth}
								scrollPosition={scrollPosition}
							/>
						) : Object.prototype.hasOwnProperty.call(
								element,
								'known_for_department'
						  ) ? (
							<Element
								elementId={(element as ElementType).id}
								elementName={(element as Person).name}
								elementPoster={
									(element as Person).profile_path &&
									`${TMDBBaseUrl}original${(element as Person).profile_path}`
								}
								elementAdditionalInformation={
									(element as Cast).character || (element as Crew).job
								}
								elementNavigation={`/persons/${(element as Person).id}`}
								posterHeight={elementHeight}
								posterWidth={elementWidth}
								scrollPosition={scrollPosition}
							/>
						) : Object.prototype.hasOwnProperty.call(
								element,
								'episode_number'
						  ) ? (
							<Element
								elementId={(element as ElementType).id}
								elementName={(element as Episode).name}
								elementPoster={
									(element as Episode).still_path &&
									`${TMDBBaseUrl}original${(element as Episode).still_path}`
								}
								elementAdditionalInformation={`#Episode ${
									(element as Episode).episode_number
								}`}
								elementNavigation={`episodes/${
									(element as Episode).episode_number
								}`}
								posterHeight={elementHeight}
								posterWidth={elementWidth}
								scrollPosition={scrollPosition}
							/>
						) : Object.prototype.hasOwnProperty.call(
								element,
								'season_number'
						  ) ? (
							<Element
								elementId={(element as ElementType).id}
								elementName={(element as Season).name}
								elementPoster={
									(element as Season).poster_path &&
									`${TMDBBaseUrl}original${(element as Season).poster_path}`
								}
								elementAdditionalInformation={
									(element as Season).air_date
										? (element as Season).air_date.slice(0, 4)
										: null
								}
								elementNavigation={`seasons/${
									(element as Season).season_number
								}`}
								posterHeight={elementHeight}
								posterWidth={elementWidth}
								scrollPosition={scrollPosition}
							/>
						) : (
							<Element
								elementId={(element as ElementType).id}
								elementName={(element as TVShow).name}
								elementPoster={
									(element as TVShow).poster_path &&
									`${TMDBBaseUrl}original${(element as TVShow).poster_path}`
								}
								elementAdditionalInformation={
									(element as TVShow).first_air_date
								}
								elementNavigation={`/tv/${(element as ElementType).id}`}
								posterHeight={elementHeight}
								posterWidth={elementWidth}
								scrollPosition={scrollPosition}
							/>
						)}
					</React.Fragment>
				) : (
					<React.Fragment key={index}>
						<Element
							elementId={index}
							elementName={null}
							elementPoster={
								(element as Image).file_path &&
								`${TMDBBaseUrl}original${(element as Image).file_path}`
							}
							elementAdditionalInformation={null}
							elementNavigation={null}
							posterHeight={elementHeight}
							posterWidth={elementWidth}
							scrollPosition={scrollPosition}
						/>
					</React.Fragment>
				)
			)}
			{scrollPosition !== 0 && (
				<button
					onClick={prev}
					className='btn-carousel btn-prev'
					style={{ top: `${elementHeight / 2.0 - 10}px` }}
				>
					&#60;
				</button>
			)}
			{!maxReached && (
				<button
					onClick={next}
					className='btn-carousel btn-next'
					style={{ top: `${elementHeight / 2.0 - 10}px` }}
				>
					&#62;
				</button>
			)}
		</div>
	);
}

export default ElementsCarousel;
