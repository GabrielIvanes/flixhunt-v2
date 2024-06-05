import { MyListFilters } from '../../utils/interface';

interface Props {
	filters: MyListFilters;
	handleMediaClick: (
		mediaDev: string,
		mediaClient: string,
		filters: MyListFilters
	) => void;
}

function Media({ filters, handleMediaClick }: Props) {
	const medias = [
		{ devString: 'movie', clientString: 'Movie' },
		{ devString: 'tv', clientString: 'TV Show' },
		{ devString: 'season', clientString: 'Season' },
		{ devString: 'episode', clientString: 'Episode' },
	];
	return (
		<section className='media-wrapper'>
			<h1>Media</h1>
			<div className='media'>
				{medias.map((media) => (
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
