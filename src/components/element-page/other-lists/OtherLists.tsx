import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark, faCheck } from '@fortawesome/free-solid-svg-icons';

import { ElementAction } from '../../../utils/interface';
import './other-lists.scss';

interface Props {
	elementLists: ElementAction[];
	setShowOtherLists: (bool: boolean) => void;
	media: string;
	handleIconClick: (elementsAction: ElementAction | null) => void;
}

function OtherLists({
	elementLists,
	setShowOtherLists,
	media,
	handleIconClick,
}: Props) {
	const enumDefaultListsName = ['Like', 'Watchlist', 'Seen', 'TheaterSeen'];

	return (
		<div className='other-lists-wrapper'>
			<div>
				<div className='xmark'>
					<FontAwesomeIcon
						icon={faXmark}
						className='clickable'
						onClick={() => {
							setShowOtherLists(false);
						}}
					/>
				</div>
				<h1>Add this {media === 'tv' ? 'tv show' : media} to a new list</h1>
				<div className='list-wrapper'>
					{elementLists.filter((elementList) => {
						return !enumDefaultListsName.includes(elementList.name);
					}).length === 0 ? (
						<div>Create an other list to see it there !</div>
					) : (
						<div className='other-lists'>
							{elementLists.map(
								(elementList) =>
									!enumDefaultListsName.includes(elementList.name) && (
										<div
											key={elementList._id}
											onClick={() => handleIconClick(elementList)}
										>
											{elementList.name}
											{elementList.value ? (
												<FontAwesomeIcon
													icon={faCheck}
													className='clickable icon check'
												/>
											) : (
												<div className='clickable icon xmark'></div>
											)}
										</div>
									)
							)}
						</div>
					)}
				</div>
			</div>
		</div>
	);
}

export default OtherLists;
