import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';

import Media from './Media';
import { MyListFilters } from '../../utils/interface';
import './filter.scss';

interface Props {
	filters: MyListFilters;
	setFilters: (filters: MyListFilters) => void;
	setShowFilters: (bool: boolean) => void;
	listReady: boolean;
	handleChangePageAndFilters: (filters: MyListFilters) => void;
	mediaInList: { devString: string; clientString: string }[];
}

function Filter({
	filters,
	setFilters,
	setShowFilters,
	listReady,
	handleChangePageAndFilters,
	mediaInList,
}: Props) {
	function handleMediaClick(
		mediaDevClick: string,
		mediaClientClick: string,
		filters: MyListFilters
	) {
		if (listReady) {
			const updatedFilters: MyListFilters = { ...filters };

			if (filters.media.some((media) => media.devString === mediaDevClick)) {
				updatedFilters.media = updatedFilters.media.filter(
					(media) => media.devString !== mediaDevClick
				);
			} else {
				updatedFilters.media.push({
					devString: mediaDevClick,
					clientString: mediaClientClick,
				});
			}

			console.log(updatedFilters);

			setFilters(updatedFilters);
			handleChangePageAndFilters(updatedFilters);
		}
	}

	return (
		<div className='my-list-filters-wrapper'>
			<div className='my-list-filters'>
				<div className='xmark'>
					<FontAwesomeIcon
						className='clickable'
						icon={faXmark}
						onClick={() => setShowFilters(false)}
					/>
				</div>
				<Media
					filters={filters}
					handleMediaClick={handleMediaClick}
					mediaInList={mediaInList}
				/>
			</div>
		</div>
	);
}

export default Filter;
