import './pagination.scss';

interface Props {
	page: number;
	setPage: (page: number) => void;
	lastPage: number;
}

function Pagination({ page, setPage, lastPage }: Props) {
	function goToPage(page: number) {
		window.scrollTo(0, 0);
		setPage(page);
	}

	return (
		<div className='pagination'>
			{page !== 1 && (
				<>
					<button
						className='prev-page clickable'
						onClick={() => goToPage(page - 1)}
					>
						&#60;
					</button>
					<button className='first-page clickable' onClick={() => goToPage(1)}>
						1
					</button>
				</>
			)}

			{page !== 1 &&
				page !== 2 &&
				page !== 3 &&
				(window.innerWidth > 650 ? (
					page !== 4 && <div>...</div>
				) : (
					<div>...</div>
				))}

			{window.innerWidth > 650 && page !== 1 && page !== 2 && page !== 3 && (
				<button
					className='prev-prev-current-page clickable'
					onClick={() => goToPage(page - 2)}
				>
					{page - 2}
				</button>
			)}
			{page !== 1 && page !== 2 && (
				<button
					className='prev-current-page clickable'
					onClick={() => goToPage(page - 1)}
				>
					{page - 1}
				</button>
			)}

			<button className='current-page'>{page}</button>

			{page !== lastPage && page !== lastPage - 1 && (
				<button
					className='next-current-page clickable'
					onClick={() => goToPage(page + 1)}
				>
					{page + 1}
				</button>
			)}
			{window.innerWidth > 650 &&
				page !== lastPage &&
				page !== lastPage - 1 &&
				page !== lastPage - 2 && (
					<button
						className='next-next-current-page clickable'
						onClick={() => goToPage(page + 2)}
					>
						{page + 2}
					</button>
				)}

			{page !== lastPage &&
				page !== lastPage - 1 &&
				page !== lastPage - 2 &&
				(window.innerWidth > 650 ? (
					page !== lastPage - 3 && <div>...</div>
				) : (
					<div>...</div>
				))}

			{page !== lastPage && (
				<>
					<button
						className='last-page clickable'
						onClick={() => goToPage(lastPage)}
					>
						{lastPage}
					</button>
					<button
						className='next-page clickable'
						onClick={() => goToPage(page + 1)}
					>
						&#62;
					</button>
				</>
			)}
		</div>
	);
}

export default Pagination;
