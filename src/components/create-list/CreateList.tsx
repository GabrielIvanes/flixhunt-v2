import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { useState } from 'react';

import './create-list.scss';

interface Props {
	setCreatingList: (creatingList: boolean) => void;
	handleFormCreateList: (listName: string) => void;
	setErrorCreatingList: (error: string) => void;
	error: string;
}

function CreateList({
	setCreatingList,
	handleFormCreateList,
	error,
	setErrorCreatingList,
}: Props) {
	const [inputText, setInputText] = useState<string>('');

	return (
		<div className='creating-list-wrapper'>
			<div>
				<div className='xmark'>
					<FontAwesomeIcon
						icon={faXmark}
						className='clickable'
						onClick={() => {
							setErrorCreatingList('');
							setCreatingList(false);
						}}
					/>
				</div>
				<h1>Create a new list</h1>
				<form
					onSubmit={(event) => {
						event.preventDefault();
						handleFormCreateList(inputText);
					}}
				>
					<input
						type='text'
						placeholder='Name of your list ...'
						value={inputText}
						onChange={(event) => {
							setErrorCreatingList('');
							setInputText(event.target.value);
						}}
						maxLength={30}
					/>
					<input type='submit' value='Create list' />
					<div className='error-message'>{error}</div>
				</form>
			</div>
		</div>
	);
}

export default CreateList;
