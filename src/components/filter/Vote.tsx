import { Filters } from '../../utils/interface';

interface Props {
	filters: Filters;
	handleVoteChange: (
		voteChange: string,
		value: number,
		filters: Filters
	) => void;
}

function Vote({ filters, handleVoteChange }: Props) {
	return (
		<section>
			<h1>Votes</h1>
			<div>
				<h2>Number of votes</h2>
				<input
					type='number'
					value={filters.vote_gte}
					min={0}
					max={filters.vote_lte || ''}
					onChange={(event) =>
						handleVoteChange(
							'vote_gte',
							parseFloat(event.target.value),
							filters
						)
					}
				/>
				<span> to </span>
				<input
					type='number'
					value={filters.vote_lte || ''}
					min={filters.vote_gte}
					onChange={(event) =>
						handleVoteChange(
							'vote_lte',
							parseFloat(event.target.value),
							filters
						)
					}
				/>
			</div>
			<div>
				<h2>Rating</h2>
				<input
					type='number'
					min={0}
					max={filters.rate_lte || 10}
					placeholder='1.0'
					value={filters.rate_gte || ''}
					onChange={(event) =>
						handleVoteChange(
							'rate_gte',
							parseFloat(event.target.value),
							filters
						)
					}
				/>
				<span> to </span>
				<input
					type='number'
					min={filters.rate_gte || 0}
					max={10}
					placeholder='10.0'
					value={filters.rate_lte || ''}
					onChange={(event) =>
						handleVoteChange(
							'rate_lte',
							parseFloat(event.target.value),
							filters
						)
					}
				/>
			</div>
		</section>
	);
}

export default Vote;
