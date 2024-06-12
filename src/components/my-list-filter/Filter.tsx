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
	handleChangePageAndFilters: (filters: MyListFilters, page: number) => void;
	mediaInList: { devString: string; clientString: string }[];
	setPage: (page: number) => void;
}

function Filter({
	filters,
	setFilters,
	setShowFilters,
	listReady,
	handleChangePageAndFilters,
	setPage,
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
			setPage(1);
			handleChangePageAndFilters(updatedFilters, 1);
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
