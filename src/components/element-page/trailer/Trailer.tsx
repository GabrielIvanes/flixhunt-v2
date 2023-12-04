import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';

import { VideoItem } from '../../../utils/interface';
import './trailer.scss';

interface Props {
	trailer: VideoItem;
	setShowTrailer: (bool: boolean) => void;
}

function Trailer({ trailer, setShowTrailer }: Props) {
	return (
		<div className='trailer-page'>
			<div className='xmark'>
				<FontAwesomeIcon
					icon={faXmark}
					className='clickable'
					onClick={() => setShowTrailer(false)}
				/>
			</div>

			<iframe
				src={`https://www.youtube.com/embed/${trailer.key}?rel=0`}
				allowFullScreen
				title={`${trailer.name}`}
				style={{ border: '2px Solid white' }}
			></iframe>
		</div>
	);
}

export default Trailer;
