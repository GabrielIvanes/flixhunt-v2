import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';

import { Comment as CommentType } from '../../../utils/interface';
import './comment.scss';
import { useState } from 'react';

interface Props {
	comment: CommentType;
	handleSubmitComment: (commentValue: string) => void;
	setShowComment: (b: boolean) => void;
}

function Comment({ comment, handleSubmitComment, setShowComment }: Props) {
	const [textAreaValue, setTextAreaValue] = useState<string>(comment.comment);

	function handleFormSubmit(
		event: React.MouseEvent<HTMLInputElement, MouseEvent>
	) {
		event.preventDefault();
		setShowComment(false);
		handleSubmitComment(textAreaValue);
	}

	return (
		<div className='comment-page'>
			<form>
				<div className='xmark'>
					<FontAwesomeIcon
						icon={faXmark}
						className='clickable'
						onClick={() => setShowComment(false)}
					/>
				</div>

				<textarea
					value={textAreaValue}
					onChange={(event) => setTextAreaValue(event.target.value)}
					placeholder="Write something about what you felt or don't want to forget about this media.  ..."
					maxLength={1000}
				/>

				<input
					type='submit'
					value={'Comment'}
					className='clickable'
					onClick={(event) => handleFormSubmit(event)}
				/>
			</form>
		</div>
	);
}

export default Comment;
