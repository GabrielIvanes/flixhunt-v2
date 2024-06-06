import { MyListFilters } from '../../utils/interface';

interface Props {
	filters: MyListFilters;
	handleMediaClick: (
		mediaDev: string,
		mediaClient: string,
		filters: MyListFilters
	) => void;
	mediaInList: { devString: string; clientString: string }[];
}

function Media({ filters, mediaInList, handleMediaClick }: Props) {
	return (
		<section className='media-wrapper'>
			<h1>Media</h1>
			<div className='media'>
				{mediaInList.map((media) => (
					<div
						key={media.devString}
						className={
							filters.media.some((m) => m.devString === media.devString)
								? 'filter-media clickable'
								: 'clickable'
						}
						onClick={() =>
							handleMediaClick(media.devString, media.clientString, filters)
						}
					>
						{media.clientString}
					</div>
				))}
			</div>
		</section>
	);
}

export default Media;
