import { Filters } from '../../utils/interface';

interface Props {
	showDateSpecific: boolean;
	filters: Filters;
	handleDateChange: (
		newDate: string,
		filters: Filters,
		dateChange: string
	) => void;
	setShowDateSpecific: (b: boolean) => void;
	setFilters: (filters: Filters) => void;
}

function DateComponent({
	showDateSpecific,
	filters,
	handleDateChange,
	setShowDateSpecific,
	setFilters,
}: Props) {
	return (
		<section>
			<h1>Date</h1>
			<div className='date'>
				<div className='select-date-filter'>
					<div
						className={showDateSpecific ? 'active' : 'clickable'}
						onClick={() => {
							setShowDateSpecific(true);
							setFilters({ ...filters, date_gte: null, date_lte: null });
						}}
					>
						Specific
					</div>
					<div
						className={!showDateSpecific ? 'active' : 'clickable'}
						onClick={() => {
							setShowDateSpecific(false);
							setFilters({ ...filters, date: null });
						}}
					>
						Range
					</div>
				</div>
				{!showDateSpecific ? (
					<>
						<input
							type='number'
							value={filters.date_gte || ''}
							onChange={(event) =>
								handleDateChange(event.target.value, filters, 'gte')
							}
							min={1895}
							max={filters.date_lte || new Date().toJSON().slice(0, 4)}
						/>
						<span> to </span>
						<input
							type='number'
							value={filters.date_lte || ''}
							onChange={(event) =>
								handleDateChange(event.target.value, filters, 'lte')
							}
							min={filters.date_gte || 1895}
							max={new Date().toJSON().slice(0, 4)}
						/>
					</>
				) : (
					<input
						type='number'
						value={filters.date || ''}
						placeholder='Specific year'
						onChange={(event) =>
							handleDateChange(event.target.value, filters, '')
						}
						min={1895}
						max={new Date().toJSON().slice(0, 4)}
					/>
				)}
			</div>
		</section>
	);
}

export default DateComponent;
